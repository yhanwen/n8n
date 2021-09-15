import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import { app, BrowserWindow, protocol } from "electron";
const path = require('path');
const url = require('url');

protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } },
]);

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
			createProtocol("app");
			// this.mainWindow.loadURL("app://./index.html");

			// this.mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY as string);

			console.log();
			console.log('***************');
			// console.log(path.join(__dirname, '..', 'renderer', 'main_window', 'index.html'))
			// console.log(MAIN_WINDOW_WEBPACK_ENTRY);

			// working for make, not for start
			const myPath = path.join(__dirname, '..', 'renderer', 'main_window', 'index.html');

			const myUrl = url.format({
				pathname: myPath,
				protocol: 'file:',
				slashes: true,
			});
			// const myUrl2 = "app://./../../renderer/index.html";
			console.log(myUrl);
			console.log('***************');

			// this.mainWindow.loadURL(myPath); // working

			// this.mainWindow.webContents.openDevTools();

			// @ts-ignore
			this.mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY); // WORKING!

			// this.mainWindow.loadURL(url.format({
			// 	// pathname: path.join(__dirname, '..', 'dist', 'index.html'), // dev server (original)
			// 	// pathname: path.join(__dirname, '..', 'renderer', 'main_window', 'index.html'), // electron-forge start/make
			// 	pathname: myPath,
			// 	protocol: 'app:',
			// 	slashes: true,
			// }));
		}

		this.mainWindow.on("closed", () => {
			this.mainWindow = null;
		});
	}

}

new MainProcess(); // tslint:disable-line
