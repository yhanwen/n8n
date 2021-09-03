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

	init(options: ITelemetrySettings) {
		if (options.enabled && !this.telemetry) {
			if(!options.config) {
				return;
			}

			telemetryClient.load(options.config.key, options.config.url, { logLevel: 'DEBUG' });
			this.telemetry = telemetryClient;
		}
	}

	identify(event: string, properties?: IDataObject) {
		if (this.telemetry) {
			this.telemetry.identify(event, properties);
		}
	}

	track(event: string, properties?: IDataObject) {
		if (this.telemetry) {
			this.telemetry.track(event, properties);
		}
	}
}
