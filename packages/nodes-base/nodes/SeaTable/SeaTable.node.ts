import {
	IExecuteFunctions,
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
	apiDtableColumns,
	apiMetadata,
	apiRequest,
	apiRequestAllItems,
	columnNamesGlob,
	columnNamesToArray,
	dtableSchemaColumns,
	getBaseAccessToken,
	getTableColumns,
	nameOfPredicate,
	rowDeleteInternalColumns,
	rowExport,
	rowFormatColumns,
	rowMapKeyToName,
	rowsFormatColumns,
	seatableApiRequest,
	setableApiRequestAllItems,
	split,
	toOptions,
	updateAble,
} from './GenericFunctions';

import {
	rowFields,
	rowOperations,
} from './RowDescription';

import {
	TColumnsUiValues,
	TColumnValue,
	TDeferredEndpoint,
	TDtableMetadataColumns,
	TMethod,
	TOperation,
} from './types';

import {
	ICtx,
	IRow,
	IRowObject,
} from './Interfaces';

export class SeaTable implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'SeaTable',
		name: 'seatable',
		icon: 'file:seaTable.svg',
		group: ['input'],
		version: 1,
		subtitle: '={{$parameter["resource"] + ": " + $parameter["operation"]}}',
		description: 'Read, update, write and delete data from SeaTable',
		defaults: {
			name: 'SeaTable',
			color: '#FF8000',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'seatableApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				options: [
					{
						name: 'Row',
						value: 'row',
					},
				],
				default: 'row',
				description: 'The operation being performed',
			},
			...rowOperations,
			...rowFields,
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

			async getTableUpdateAbleColumns(this: ILoadOptionsFunctions) {
				const tableName = this.getNodeParameter('tableName') as string;
				const columns = await getTableColumns.call(this, tableName);
				return columns.filter(column => column.editable).map(column => ({ name: column.name, value: column.name }));
			},
			async getAllColumns(this: ILoadOptionsFunctions) {
				const tableName = this.getNodeParameter('tableName') as string;
				const columns = await getTableColumns.call(this, tableName);
				return columns.map(column => ({ name: column.name, value: column.name }));
			},
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: IDataObject[] = [];
		let responseData;

		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		const body: IDataObject = {};
		const qs: IDataObject = {};

		if (resource === 'row') {

			const credentials = await this.getCredentials('seatableApi') as IDataObject;
			const { access_token: accessToken, dtable_uuid: tableId } = await getBaseAccessToken.call(this, credentials);
			Object.assign(credentials, { accessToken });

			if (operation === 'create') {
				// ----------------------------------
				//         row:create
				// ----------------------------------

				const tableName = this.getNodeParameter('tableName', 0) as string;
				const tableColumns = await getTableColumns.call(this, tableName);

				body.table_name = tableName;

				const dataToSend = this.getNodeParameter('dataToSend', 0) as 'defineBelow' | 'autoMapInputData';
				let rowInput: IRowObject = {};

				for (let i = 0; i < items.length; i++) {
					rowInput = {} as IRowObject;
					try {
						if (dataToSend === 'autoMapInputData') {
							const incomingKeys = Object.keys(items[i].json);
							const inputDataToIgnore = split(this.getNodeParameter('inputsToIgnore', i, '') as string);
							for (const key of incomingKeys) {
								if (inputDataToIgnore.includes(key)) continue;
								rowInput[key] = items[i].json[key] as TColumnValue;
							}
						} else {
							const columns = this.getNodeParameter('columnsUi.columnValues', i, []) as TColumnsUiValues;
							for (const column of columns) {
								rowInput[column.columnName] = column.columnValue;
							}
						}
						body.row = rowExport(rowInput, updateAble(tableColumns));

						responseData = await seatableApiRequest.call(this, credentials, 'POST', `/dtable-server/api/v1/dtables/${tableId}/rows/`, body);

						const { _id: insertId } = responseData;
						if (insertId === undefined) {
							throw new NodeOperationError(this.getNode(), 'SeaTable: No identity after appending row.');
						}
						const newRowInsertData = rowMapKeyToName(responseData, tableColumns);

						qs.table_name = tableName;
						qs.convert = true;
						const newRow = await seatableApiRequest.call(this, credentials, 'GET', `/dtable-server/api/v1/dtables/${tableId}/rows/${encodeURIComponent(insertId)}/` as TDeferredEndpoint, body, qs) as unknown as IRow;
						if (newRow._id === undefined) {
							throw new NodeOperationError(this.getNode(), 'SeaTable: No identity for appended row.');
						}
						const row = rowFormatColumns({ ...newRowInsertData, ...newRow }, tableColumns.map(({ name }) => name));
						returnData.push(rowDeleteInternalColumns(row));
					} catch (error) {
						if (this.continueOnFail()) {
							returnData.push({ json: { error: error.message } });
							continue;
						}
						throw error;
					}
				}
			} else if (operation === 'getAll') {
				// ----------------------------------
				//         row:getAll
				// ----------------------------------

				const tableName = this.getNodeParameter('tableName', 0) as string;

				const additionalFields = this.getNodeParameter('additionalFields', 0) as IDataObject;

				try {
					const tableColumns = await getTableColumns.call(this, tableName);
					const endpoint = `/dtable-server/api/v1/dtables/${tableId}/rows/`;
					qs.table_name = tableName;
					const returnAll = this.getNodeParameter('returnAll', 0) as boolean;

					if (returnAll) {
						responseData = await setableApiRequestAllItems.call(this, credentials, 'rows', 'GET', endpoint, body, qs);
					} else {
						qs.limit = this.getNodeParameter('limit', 0) as number;
						responseData = await seatableApiRequest.call(this, credentials, 'GET', endpoint, body, qs);
						responseData = responseData.rows;
					}

					let columnNames = additionalFields.columnNames as string[];
					columnNames = columnNamesGlob(columnNames, tableColumns);
					const [{ name: defaultColumn }] = tableColumns;
					columnNames = [
						defaultColumn,
						...columnNames,
					].filter(nameOfPredicate(tableColumns));

					rowsFormatColumns(responseData, columnNames);

					returnData.push(...responseData);
				} catch (error) {
					if (this.continueOnFail()) {
						returnData.push({ json: { error: error.message } });
					}
					throw error;
				}
				//} 

				// else if (operation === 'metadata') {
				// 	// ----------------------------------
				// 	//         metadata
				// 	// ----------------------------------

				// 	try {
				// 		const tableName = this.getNodeParameter('tableName', 0) as string;
				// 		const metaData = await apiMetadata.call(this, ctx);
				// 		let { tables } = metaData;
				// 		const tableNameIndex = tables.findIndex(({ name }) => name === tableName);
				// 		if (tableNameIndex > -1) {
				// 			tables = [tables[tableNameIndex]];
				// 		}
				// 		const result = tables.map(({ name, columns }) => (
				// 			{ name, columns: dtableSchemaColumns(columns).map(({ name }) => name).join(', ') }
				// 		)) as unknown as IDataObject[];

				// 		returnData.push(...result);
				// 	} catch (error) {
				// 		if (this.continueOnFail()) {
				// 			returnData.push({ json: { error: error.message } });
				// 		}
				// 		throw error;
				// 	}
			} else {
				throw new NodeOperationError(this.getNode(), `The operation "${operation}" is not known!`);
			}
		}

		return [this.helpers.returnJsonArray(returnData)];
	}
}
