/* eslint-disable import/no-cycle */
import { IDataObject, IRun, TelemetryHelpers } from 'n8n-workflow';
import { IDiagnosticInfo, IInternalHooksClass, IWorkflowBase } from '.';
import { Telemetry } from './telemetry';

export class InternalHooksClass implements IInternalHooksClass {
	constructor(private telemetry: Telemetry) {}

	async onServerStarted(diagnosticInfo: IDiagnosticInfo): Promise<void> {
		await this.telemetry.identify({ ...diagnosticInfo });
		await this.telemetry.track('Instance started', { n8n_version: diagnosticInfo.versionCli });
	}

	async onWorkflowDeleted(workflowId: string): Promise<void> {
		await this.telemetry.track('User deleted workflow', {
			workflow_id: workflowId,
		});
	}

	async onWorkflowPostExecute(workflow: IWorkflowBase, runData?: IRun): Promise<void> {
		const properties: IDataObject = {
			workflow_id: workflow.id,
		};

		if (runData !== undefined) {
			properties.execution_mode = runData.mode;
			if (runData.mode === 'manual') {
				properties.nodes_graph = TelemetryHelpers.generateNodesGraph(workflow);
			}

			properties.success = !!runData.finished;

			if (!properties.success && runData?.data.resultData.error) {
				properties.error_message = runData?.data.resultData.error.message;
				properties.error_node_type = runData?.data.resultData.error.node?.type;

				if (runData.data.resultData.lastNodeExecuted) {
					const lastNode = TelemetryHelpers.getNodeTypeForName(
						workflow,
						runData.data.resultData.lastNodeExecuted,
					);

					if (lastNode !== undefined) {
						properties.error_node_type = lastNode.type;
					}
				}
			}
		}

		await this.telemetry.trackWorkflowExecution(properties);
	}

	async onN8nStop(): Promise<void> {
		await this.telemetry.trackN8nStop();
	}
}
