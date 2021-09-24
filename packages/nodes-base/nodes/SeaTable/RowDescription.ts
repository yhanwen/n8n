import {
	INodeProperties,
} from 'n8n-workflow';

export const rowOperations = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a row',
			},
			{
				name: 'Get All',
				value: 'getAll',
				description: 'Get all rows',
			},
		],
		default: 'create',
		description: 'The operation being performed',
	},
] as INodeProperties[];

export const rowFields = [
	// ----------------------------------
	//             shared
	// ----------------------------------

	{
		displayName: 'Table',
		name: 'tableName',
		type: 'options',
		placeholder: 'Name of table',
		required: true,
		typeOptions: {
			loadOptionsMethod: 'getTableNames',
		},
		default: '',
		description: 'The name of SeaTable table to access',
	},

	// ----------------------------------
	//             getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				operation: [
					'getAll',
				],
			},
		},
		default: true,
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: {
				operation: [
					'getAll',
				],
				returnAll: [
					false,
				],
			},
		},
		typeOptions: {
			minValue: 1,
			maxValue: 100,
		},
		default: 50,
		description: 'How many results to return',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		displayOptions: {
			show: {
				operation: [
					'getAll',
				],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Columns:',
				name: 'columnNames',
				type: 'multiOptions',
				typeOptions: {
					loadOptionsMethod: 'getAllColumns',
				},
				default: [],
				description: 'Additional columns to be included. <br><br>By default the standard (always first) column is returned, this field allows to add one or more additional.<br><br><ul><li>Multiple can be separated by comma. Example: <samp>Title,Surname</samp>.',
			},
		],
	},

	// ----------------------------------
	//             create
	// ----------------------------------
	{
		displayName: 'Data to Send',
		name: 'dataToSend',
		type: 'options',
		options: [
			{
				name: 'Auto-Map Input Data to Columns',
				value: 'autoMapInputData',
				description: 'Use when node input properties match destination column names',
			},
			{
				name: 'Define Below for Each Column',
				value: 'defineBelow',
				description: 'Set the value for each destination column',
			},
		],
		displayOptions: {
			show: {
				operation: [
					'create',
				],
			},
		},
		default: 'defineBelow',
		description: 'Whether to insert the input data this node receives in the new row',
	},
	{
		displayName: 'Inputs to Ignore',
		name: 'inputsToIgnore',
		type: 'string',
		displayOptions: {
			show: {
				operation: [
					'create',
				],
				dataToSend: [
					'autoMapInputData',
				],
			},
		},
		default: '',
		description: 'List of input properties to avoid sending, separated by commas. Leave empty to send all properties.',
		placeholder: 'Enter properties...',
	},
	{
		displayName: 'Columns to Send',
		name: 'columnsUi',
		placeholder: 'Add Column',
		type: 'fixedCollection',
		typeOptions: {
			multipleValueButtonText: 'Add Column to Send',
			multipleValues: true,
		},
		options: [
			{
				displayName: 'Column',
				name: 'columnValues',
				values: [
					{
						displayName: 'Column Name',
						name: 'columnName',
						type: 'options',
						typeOptions: {
							loadOptionsDependsOn: [
								'table',
							],
							loadOptionsMethod: 'getTableUpdateAbleColumns',
						},
						default: '',
						description: 'Name of the column',
					},
					{
						displayName: 'Column Value',
						name: 'columnValue',
						type: 'string',
						default: '',
						description: 'Value of the column',
					},
				],
			},
		],
		displayOptions: {
			show: {
				operation: [
					'create',
				],
				dataToSend: [
					'defineBelow',
				],
			},
		},
		default: {},
		description: 'Add destination column with its value',
	},

] as INodeProperties[];
