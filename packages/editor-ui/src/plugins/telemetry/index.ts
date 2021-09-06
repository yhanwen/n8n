import _Vue from "vue";
import {
	ITelemetrySettings,
	IDataObject,
} from 'n8n-workflow';

import * as telemetryClient from 'rudder-sdk-js';

declare module 'vue/types/vue' {
	interface Vue {
		$telemetry: Telemetry;
	}
}

export function TelemetryPlugin(vue: typeof _Vue): void {
	const telemetry = new Telemetry();

	Object.defineProperty(vue, '$telemetry', {
		get() { return telemetry; },
	});
	Object.defineProperty(vue.prototype, '$telemetry', {
		get() { return telemetry; },
	});
}

class Telemetry {

	private telemetry?: any; // tslint:disable-line:no-any

	init(options: ITelemetrySettings, instanceId: string) {
		if (options.enabled && !this.telemetry) {
			if(!options.config) {
				return;
			}

			telemetryClient.load(options.config.key, options.config.url, { logLevel: 'DEBUG', integrations: { All: false }, loadIntegration: false });
			this.telemetry = telemetryClient;
			this.telemetry.identify(instanceId);
		}
	}

	track(event: string, properties?: IDataObject) {
		if (this.telemetry) {
			this.telemetry.track(event, properties);
		}
	}
}
