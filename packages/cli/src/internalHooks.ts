import * as telemetryHelpers from './telemetry/helpers';
import { Telemetry } from './telemetry';
import { IInternalHooksClass } from './Interfaces';
import { WorkflowEntity } from './databases/entities/WorkflowEntity';

export class InternalHooks implements IInternalHooksClass {

	constructor(private telemetry: Telemetry) { }

	async onServerStarted(): Promise<void> {
		this.telemetry.track('Instance started');
	}

	async onWorkflowSave(workflow: WorkflowEntity): Promise<void> {
		const nodesGraph = telemetryHelpers.generateNodesGraph(workflow);
		this.telemetry.track('User saved workflow', { workflow_id: workflow.id.toString(), nodesGraph });
	}
}
