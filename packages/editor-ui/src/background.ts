// import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import { app, BrowserWindow, protocol } from "electron";
const path = require('path');
const url = require('url');

// protocol.registerSchemesAsPrivileged([
//   { scheme: "app", privileges: { secure: true, standard: true } },
// ]);

class MainProcess {
	mainWindow: BrowserWindow | null = null;

	constructor() {
		app.whenReady().then(() => this.createMainWindow());
		app.on("window-all-closed", app.quit);
	}

	private createMainWindow() {
		this.mainWindow = new BrowserWindow({
			width: 1000,
			height: 600,
			resizable: true,
			webPreferences: { nodeIntegration: true, webSecurity: false },
		});

		if (process.env.WEBPACK_DEV_SERVER_URL) {
			this.mainWindow.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
		} else {
			// createProtocol("app");
			// this.mainWindow.loadURL("app://./index.html");

			// file:///Users/ivov/Development/n8n/packages/editor-ui/dist/index.htmls
			this.mainWindow.loadURL(url.format({
				// pathname: path.join(__dirname, '..', 'dist', 'index.html'), // dev server (original)
				pathname: path.join('..', 'renderer', 'main_window', 'index.html'), // electron-forge start/make
				protocol: 'file:',
				slashes: true,
			}));
		}

		this.mainWindow.on("closed", () => {
			this.mainWindow = null;
		});
	}

}

new MainProcess(); // tslint:disable-line
