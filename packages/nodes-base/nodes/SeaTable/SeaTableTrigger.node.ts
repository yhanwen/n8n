import {
	IPollFunctions,
} from 'n8n-core';

import {
	IDataObject,
	ILoadOptionsFunctions,
	INodeExecutionData,
	INodePropertyOptions,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

import {
	getBaseAccessToken,
	getColumns,
	getDownloadableColumns,
	seatableApiRequest,
	setableApiRequestAllItems,
	simplify,
} from './GenericFunctions';

import * as moment from 'moment';

export class SeaTableTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'SeaTable Trigger',
		name: 'seatableTrigger',
		icon: 'file:seaTable.svg',
		group: ['trigger'],
		version: 1,
		description: 'Starts the workflow when SeaTable events occur',
		subtitle: '={{$parameter["event"]}}',
		defaults: {
			name: 'SeaTable Trigger',
			color: '#FF8000',
		},
		credentials: [
			{
				name: 'seatableApi',
				required: true,
			},
		],
		polling: true,
		inputs: [],
		outputs: ['main'],
		properties: [
			{
				displayName: 'Table',
				name: 'tableName',
				type: 'options',
				required: true,
				typeOptions: {
					loadOptionsMethod: 'getTableNames',
				},
				default: '',
				description: 'The name of SeaTable table to access',
			},
			{
				displayName: 'Event',
				name: 'event',
				type: 'options',
				options: [
					{
						name: 'Row Created',
						value: 'rowCreated',
						description: 'Trigger has newly created rows',
					},
					{
						name: 'Row Modified',
						value: 'rowModified',
						description: 'Trigger has recently modified rows',
					},
				],
				default: 'rowCreated',
			},
			{
				displayName: 'Simplify Response',
				name: 'simple',
				type: 'boolean',
				default: true,
				description: 'Return a simplified version of the response instead of the raw data.',
			},
		],
	};

	methods = {
		loadOptions: {
			async getTableNames(this: ILoadOptionsFunctions) {
				const returnData: INodePropertyOptions[] = [];
				const credentials = await this.getCredentials('seatableApi') as IDataObject;
				const { access_token: accessToken, dtable_uuid: tableId } = await getBaseAccessToken.call(this, credentials);
				Object.assign(credentials, { accessToken });
				const { metadata: { tables } } = await seatableApiRequest.call(this, credentials, 'GET', `/dtable-server/api/v1/dtables/${tableId}/metadata`);
				for (const table of tables) {
					returnData.push({
						name: table.name,
						value: table.name,
					});
				}
				return returnData;
			},
		},
	};

	async poll(this: IPollFunctions): Promise<INodeExecutionData[][] | null> {
		const webhookData = this.getWorkflowStaticData('node');
		const tableName = this.getNodeParameter('tableName') as string;
		const simple = this.getNodeParameter('simple') as boolean;
		const event = this.getNodeParameter('event') as string;
		const credentials = await this.getCredentials('seatableApi') as IDataObject;

		const now = moment().utc().format();

		const startDate = webhookData.lastTimeChecked as string || now;

		const endDate = now;

		webhookData.lastTimeChecked = endDate;

		const { access_token: accessToken, dtable_uuid: baseId } = await getBaseAccessToken.call(this, credentials);

		Object.assign(credentials, { accessToken });

		let rows;

		const filterField = (event === 'rowCreated') ? '_ctime' : '_mtime';

		const endpoint = `/dtable-db/api/v1/query/${baseId}/`;

		if (this.getMode() === 'manual') {
			rows = await seatableApiRequest.call(this, credentials, 'POST', endpoint, { sql: `SELECT * FROM ${tableName} LIMIT 1` });
		} else {
			rows = await seatableApiRequest.call(this, credentials, 'POST', endpoint,
				{ sql: `SELECT * FROM ${tableName} WHERE ${filterField} BETWEEN "${moment(startDate).utc().format('YYYY-MM-D HH:mm:ss')}" AND "${moment(endDate).utc().format('YYYY-MM-D HH:mm:ss')}"` });
		}

		let response;

		if (rows.metadata && rows.results) {
			const columns = getColumns(rows);
			if (simple === true) {
				response = simplify(rows, columns);
			} else {
				response = rows.results;
			}
		}

		response = response.map((row: IDataObject) => ({ json: row }));

		if (Array.isArray(response) && response.length) {
			return [response];
		}

		return null;
	}
}