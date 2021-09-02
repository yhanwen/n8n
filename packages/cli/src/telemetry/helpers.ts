/* eslint-disable import/no-cycle */
import { IDataObject } from 'n8n-workflow';
import { WorkflowEntity } from '../databases/entities/WorkflowEntity';

export async function generateNodesGraph(workflow: WorkflowEntity): Promise<IDataObject> {
	return {
		node_types: workflow.nodes.map((node) => node.type.split('.')[1]),
	};
}
