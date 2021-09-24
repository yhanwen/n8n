import {
	IExecuteFunctions,
	IHookFunctions
} from 'n8n-core';

import {
	OptionsWithUri,
} from 'request';

import {
	IDataObject,
	ILoadOptionsFunctions,
	INodeExecutionData,
	INodePropertyOptions,
	IPollFunctions,
	NodeApiError,
	NodeOperationError
} from 'n8n-workflow';

import {
	TCredentials,
	TDtableMetadataColumns,
	TDtableMetadataTables,
	TEndpoint,
	TEndpointExpr,
	TEndpointResolvedExpr,
	TEndpointVariableName,
	TLoadedResource,
	TMethod,
} from './types';

import {
	schema,
} from './Schema';

import {
	IApi,
	IAppAccessToken,
	ICtx,
	IDtableMetadata,
	IDtableMetadataColumn,
	IDtableMetadataTable,
	IEndpointVariables,
	IName,
	IRow,
	IRowObject,
} from './Interfaces';

import {
	URL,
} from 'url';

import * as _ from 'lodash';

const normalize = (subject: string): string => subject ? subject.normalize() : '';

export const split = (subject: string): string[] =>
	normalize(subject)
		.split(/\s*((?:[^\\,]*?(?:\\[\s\S])*)*?)\s*(?:,|$)/)
		.filter(s => s.length)
		.map(s => s.replace(/\\([\s\S])/gm, ($0, $1) => $1))
	;

export function apiCtx(api: IApi): ICtx {
	if (api === undefined) {
		throw new Error('Expectation failed: SeaTable: Context: Need api/credentials to create context, got undefined.');
	}

	const prepApi = api;
	prepApi.server = normalize(prepApi.server);
	if (prepApi.server === '') {
		throw new Error(`Expectation failed: SeaTable: Context: Need server to create context, got server-less: ${Object.prototype.toString.call(api)}.`);
	}
	// noinspection HttpUrlsUsage
	if (['http://', 'https://'].includes(prepApi.server)) {
		throw new Error(`Expectation failed: SeaTable: Context: Need server to create context, got URL-scheme only: "${prepApi.server}".`);
	}

	try {
		const serverUrl = new URL(prepApi.server);
		if (!['http:', 'https:'].includes(serverUrl.protocol)) {
			throw new Error(`Unsupported protocol: "${serverUrl.protocol}"`);
		}
		serverUrl.hash = serverUrl.search = '';
		// throw new Error(`debug: ${Object.prototype.toString.call(serverUrl)} "${serverUrl}"`);
		prepApi.server = serverUrl.toString();
	} catch (e) {
		throw new Error(`Expectation failed: SeaTable: Context: Server URL: ${e.message}`);
	}

	return { api: prepApi } as ICtx;
}


export async function seatableApiRequest(this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions | IPollFunctions, credentials: IDataObject, method: string, endpoint: string, body: any = {}, qs: IDataObject = {}, url: string | undefined = undefined, option: IDataObject = {}): Promise<any> { // tslint:disable-line:no-any

	const options: OptionsWithUri = {
		headers: {
			Authorization: `Token ${credentials.accessToken || credentials.token}`,
		},
		method,
		qs,
		body,
		uri: url || `${credentials.server}${endpoint}`,
		json: true,
	};

	if (Object.keys(body).length === 0) {
		delete options.body;
	}

	if (Object.keys(option).length !== 0) {
		Object.assign(options, option);
	}

	try {
		//@ts-ignore
		return await this.helpers.request!(options);
	} catch (error) {
		throw new NodeApiError(this.getNode(), error);
	}
}

export async function setableApiRequestAllItems(this: IExecuteFunctions | IPollFunctions, credentials: IDataObject, propertyName: string, method: string, endpoint: string, body: IDataObject, query?: IDataObject): Promise<any> { // tslint:disable-line:no-any

	if (query === undefined) {
		query = {};
	}
	const segment = schema.rowFetchSegmentLimit;
	query.start = 0;
	query.limit = segment;

	const returnData: IDataObject[] = [];

	let responseData;

	do {
		responseData = await seatableApiRequest.call(this, credentials, method, endpoint, body, query) as unknown as IRows;
		//@ts-ignore
		returnData.push.apply(returnData, responseData[propertyName]);
		query.start = +query.start + segment;
	} while (responseData.rows && responseData.rows.length > segment - 1);

	return returnData;
}


export async function getTableColumns(this: ILoadOptionsFunctions | IExecuteFunctions, tableName: string): Promise<TDtableMetadataColumns> {
	const credentials = await this.getCredentials('seatableApi') as IDataObject;
	const { access_token: accessToken, dtable_uuid: tableId } = await getBaseAccessToken.call(this, credentials);
	Object.assign(credentials, { accessToken });
	const { metadata: { tables } } = await seatableApiRequest.call(this, credentials, 'GET', `/dtable-server/api/v1/dtables/${tableId}/metadata`);
	for (const table of tables) {
		if (table.name === tableName) {
			return table.columns;
		}
	}
	return [];
}

export function getBaseAccessToken(this: IExecuteFunctions | ILoadOptionsFunctions | IPollFunctions, credentials: IDataObject): Promise<IDataObject> {

	const options: OptionsWithUri = {
		headers: {
			Authorization: `Token ${credentials.token}`,
		},
		uri: `${credentials.server}/api/v2.1/dtable/app-access-token/`,
		json: true,
	};

	return this.helpers.request!(options);
}

export function simplify(data: { results: [{ key: string, value: string }] }, metadata: IDataObject) {
	return data.results.map((row: IDataObject) => {
		for (const key of Object.keys(row)) {
			if (!key.startsWith('_')) {
				row[metadata[key] as string] = row[key];
				delete row[key];
			} else {
				delete row[key];
			}
		}
		return row;
	});
}

export function getColumns(data: { metadata: [{ key: string, name: string }] }) {
	return data.metadata.reduce((obj, value) => Object.assign(obj, { [`${value.key}`]: value.name }), {});
}

export function getDownloadableColumns(data: { metadata: [{ key: string, name: string, type: string }] }) {
	return data.metadata.filter(row => (['image', 'file'].includes(row.type))).map(row => row.name);
}

// export async function downloadAttachments(this: IExecuteFunctions | IPollFunctions, credentials: IDataObject, records: [{ [key: string]: any }], fieldNames: string[]): Promise<INodeExecutionData[]> {
// 	const elements: INodeExecutionData[] = [];
// 	for (const record of records) {
// 		const element: INodeExecutionData = { json: {}, binary: {} };
// 		element.json = record as unknown as IDataObject;
// 		for (const fieldName of fieldNames) {
// 			if (record[fieldName] !== undefined) {
// 				for (const [index, attachment] of (record[fieldName] as [{ url: string,  }]).entries()) {
// 					let file;
// 					let type;
// 					let path;
// 					if (attachment?.url) {
// 						path = attachment.url.split('/files')[1];
// 						type = 'file';
// 						const { download_link } = await seatableApiRequest.call(this, credentials, 'GET', '/api/v2.1/dtable/app-download-link', {}, { path });
// 						file = await seatableApiRequest.call(this, credentials, 'GET', '', {}, { path }, download_link, { json: false, encoding: null });

// 					} else {
// 						continue;
// 						//@ts-ignore
// 						path = (attachment as string).split('/images')[1];
// 						type = 'image';
// 						//const { download_link } = await seatableApiRequest.call(this, credentials, 'GET', '/api/v2.1/dtable/app-download-link', {}, { path });
// 						//file = await seatableApiRequest.call(this, credentials, 'GET', '', {}, { path }, download_link, { json: false, encoding: null });
// 					}
// 					element.binary![`${fieldName}_${type}_${index}`] = await this.helpers.prepareBinaryData(file);
// 				}
// 			}
// 		}
// 		if (Object.keys(element.binary as IBinaryKeyData).length === 0) {
// 			delete element.binary;
// 		}
// 		elements.push(element);
// 	}
// 	return elements;
// }

/**
 * Helper function for mangling options parts for an API request with the HTTP client in n8n.
 *
 * @param options
 * @param body
 * @param option
 */
function apiRequestMergeOptionsWithUri(options: OptionsWithUri, body: object, option: IDataObject): OptionsWithUri {
	if (Object.keys(option).length !== 0) {
		Object.assign(options, option);
	}

	if (Object.keys(body).length === 0) {
		delete options.body;
	}

	return options;
}

const uniquePredicate = (current: string, index: number, all: string[]) => all.indexOf(current) === index;
const nonInternalPredicate = (name: string) => !Object.keys(schema.internalNames).includes(name);
const namePredicate = (name: string) => (named: IName) => named.name === name;
export const nameOfPredicate = (names: ReadonlyArray<IName>) => (name: string) => names.find(namePredicate(name));

export function columnNamesToArray(columnNames: string): string[] {
	return columnNames
		? split(columnNames)
			.filter(nonInternalPredicate)
			.filter(uniquePredicate)
		: []
		;
}

export function columnNamesGlob(columnNames: string[], dtableColumns: TDtableMetadataColumns): string[] {
	const buffer: string[] = [];
	const names: string[] = dtableColumns.map(c => c.name).filter(nonInternalPredicate);
	columnNames.forEach(columnName => {
		if (columnName !== '*') {
			buffer.push(columnName);
			return;
		}
		buffer.push(...names);
	});
	return buffer.filter(uniquePredicate);
}

/**
 * sequence rows on _seq
 */
export function rowsSequence(rows: IRows) {
	const l = rows.rows.length;
	if (l) {
		const [first] = rows.rows;
		if (first && first._seq !== undefined) {
			return;
		}
	}
	for (let i = 0; i < l;) {
		rows.rows[i]._seq = ++i;
	}
}

export function rowDeleteInternalColumns(row: IRow): IRow {
	Object.keys(schema.internalNames).forEach(columnName => delete row[columnName]);
	return row;
}

export function rowsDeleteInternalColumns(rows: IRows) {
	rows.rows = rows.rows.map(rowDeleteInternalColumns);
}

function rowFormatColumn(input: unknown): boolean | number | string | string[] | null {
	if (null === input || undefined === input) {
		return null;
	}

	if (typeof input === 'boolean' || typeof input === 'number' || typeof input === 'string') {
		return input;
	}

	if (Array.isArray(input) && input.every(i => (typeof i === 'string'))) {
		return input;
	}

	return null;
}

export function rowFormatColumns(row: IRow, columnNames: string[]): IRow {
	const outRow = {} as IRow;
	columnNames.forEach((c) => (outRow[c] = rowFormatColumn(row[c])));
	return outRow;
}

export function rowsFormatColumns(rows: IRow[], columnNames: string[]) {
	rows = rows.map((row) => rowFormatColumns(row, columnNames));
}

export function rowMapKeyToName(row: IRow, columns: TDtableMetadataColumns): IRow {
	const mappedRow = {} as IRow;

	// move internal columns first
	Object.keys(schema.internalNames).forEach((key) => {
		if (row[key]) {
			mappedRow[key] = row[key];
			delete row[key];
		}
	});

	// pick each by its key for name
	Object.keys(row).forEach(key => {
		const column = columns.find(c => c.key === key);
		if (column) {
			mappedRow[column.name] = row[key];
		}
	});

	return mappedRow;
}

export function rowExport(row: IRowObject, columns: TDtableMetadataColumns): IRowObject {
	for (const columnName of Object.keys(columns)) {
		if (!columns.find(namePredicate(columnName))) {
			delete row[columnName];
		}
	}
	return row;
}

const assertResponse = (responsible: unknown): boolean => {
	if (responsible === undefined || !responsible || typeof responsible === 'string') {
		return false;
	}
	return typeof responsible === 'object';
};

async function ctxStageApiCredentials(this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions | IPollFunctions, ctx?: ICtx): Promise<ICtx> {
	ctx = ctx || {} as ICtx;
	if (!ctx.api) {
		const credentials: TCredentials = await this.getCredentials('seatableApi');

		if (credentials === undefined) {
			throw new NodeOperationError(this.getNode(), 'No credentials got returned!');
		}

		if (0 === Object.keys(credentials).length) {
			throw new NodeOperationError(this.getNode(), 'Empty credentials got returned!');
		}

		ctx = apiCtx(credentials as unknown as IApi);
	}

	if (ctx.api === undefined || !assertResponse(ctx.api)) {
		throw new NodeOperationError(this.getNode(), 'SeaTable: Unable to stage on "api".');
	}

	return ctx;
}

export const dtableSchemaIsColumn = (column: IDtableMetadataColumn): boolean =>
	!!schema.columnTypes[column.type];

const dtableSchemaIsUpdateAbleColumn = (column: IDtableMetadataColumn): boolean =>
	!!schema.columnTypes[column.type] && !schema.nonUpdateAbleColumnTypes[column.type];

export const dtableSchemaColumns = (columns: TDtableMetadataColumns): TDtableMetadataColumns =>
	columns.filter(dtableSchemaIsColumn);

export const updateAble = (columns: TDtableMetadataColumns): TDtableMetadataColumns =>
	columns.filter(dtableSchemaIsUpdateAbleColumn);

const trimEnd = (str: string, ch: '/') => {
	let end = str.length;
	while (end > 0 && str[end - 1] === ch) {
		--end;
	}
	return end < str.length ? str.substring(0, end) : str;
};

function endpointCtxExpr(this: void, ctx: ICtx, endpoint: TEndpointExpr): TEndpointResolvedExpr {
	const endpointVariables: IEndpointVariables = {};
	endpointVariables.access_token = ctx.api.appAccessToken?.access_token;
	endpointVariables.dtable_uuid = ctx.api.appAccessToken && ctx.api.appAccessToken['dtable_uuid'];
	endpointVariables.server = ctx.api.server;

	endpoint = normalize(endpoint);
	if (endpoint === undefined || !endpoint.length) {
		return '';
	}

	if (endpoint.charAt(0) === '/') {
		endpoint = trimEnd(endpointVariables.server, '/') + endpoint;
	}

	return endpoint.replace(/({{ *(access_token|dtable_uuid|server) *}})/g, (match: string, expr: string, name: TEndpointVariableName) => {
		return endpointVariables[name] || match;
	}) as TEndpointResolvedExpr;
}

const endpointExprFunctor = (ctx: ICtx) => (expression: TEndpointExpr): TEndpointResolvedExpr => endpointCtxExpr(ctx, expression);

/**
 * Make an API request to SeaTable
 *
 * @export
 * @param {ICtx} ctx
 * @returns {Promise<IDtableMetadata>}
 */
export async function apiMetadata(this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions | IPollFunctions, ctx: ICtx): Promise<IDtableMetadata> {
	ctx = await ctxStageDtableMetadata.call(this, ctx);

	return ctx.metadata;
}