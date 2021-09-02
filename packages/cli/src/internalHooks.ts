/* eslint-disable import/no-cycle */
import * as telemetryHelpers from './telemetry/helpers';
import { IInternalHooksClass } from '.';
import { Telemetry } from './telemetry';
import { WorkflowEntity } from './databases/entities/WorkflowEntity';

export class InternalHooks implements IInternalHooksClass {
	constructor(private telemetry: Telemetry) {}

	async onServerStarted(): Promise<void> {
		await this.telemetry.track('Instance started');
	}

	async onWorkflowSave(workflow: WorkflowEntity): Promise<void> {
		const nodesGraph = telemetryHelpers.generateNodesGraph(workflow);
		await this.telemetry.track('User saved workflow', {
			workflow_id: workflow.id?.toString(),
			nodesGraph,
		});
	}
}
