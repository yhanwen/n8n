/* eslint-disable import/no-cycle */
import { IDataObject, IRun, TelemetryHelpers } from 'n8n-workflow';
import { IDiagnosticInfo, IInternalHooksClass, IWorkflowBase } from '.';
import { Telemetry } from './telemetry';

export class InternalHooksClass implements IInternalHooksClass {
	constructor(private telemetry: Telemetry) {}

	async onServerStarted(diagnosticInfo: IDiagnosticInfo): Promise<void> {
		const info = {
			version_cli: diagnosticInfo.versionCli,
			db_type: diagnosticInfo.databaseType,
			notifications_enabled: diagnosticInfo.notificationsEnabled,
			disable_production_webhooks_on_main_process:
				diagnosticInfo.disableProductionWebhooksOnMainProcess,
			basic_auth_active: diagnosticInfo.basicAuthActive,
			system_info: diagnosticInfo.systemInfo,
			execution_variables: diagnosticInfo.executionVariables,
			deployment_type: diagnosticInfo.deploymentType,
		};
		await this.telemetry.identify(info);
		await this.telemetry.track('Instance started', info);
	}

	async onWorkflowDeleted(workflowId: string): Promise<void> {
		await this.telemetry.track('User deleted workflow', {
			workflow_id: workflowId,
		});
	}

	async onWorkflowPostExecute(workflow: IWorkflowBase, runData?: IRun): Promise<void> {
		const properties: IDataObject = {
			workflow_id: workflow.id,
			is_manual: false,
		};

		if (runData !== undefined) {
			properties.execution_mode = runData.mode;
			if (runData.mode === 'manual') {
				properties.is_manual = true;
			}

			properties.success = !!runData.finished;

			if (!properties.success && runData?.data.resultData.error) {
				properties.error_message = runData?.data.resultData.error.message;
				let errorNodeName = runData?.data.resultData.error.node?.name;
				properties.error_node_type = runData?.data.resultData.error.node?.type;

				if (runData.data.resultData.lastNodeExecuted) {
					const lastNode = TelemetryHelpers.getNodeTypeForName(
						workflow,
						runData.data.resultData.lastNodeExecuted,
					);

					if (lastNode !== undefined) {
						properties.error_node_type = lastNode.type;
						errorNodeName = lastNode.name;
					}
				}

				if (properties.is_manual) {
					const nodeGraphResult = TelemetryHelpers.generateNodesGraph(workflow);
					properties.node_graph = nodeGraphResult.nodeGraph;
					if(errorNodeName) {
						properties.error_node_id = nodeGraphResult.nameIndices[errorNodeName];
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
