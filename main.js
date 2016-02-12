'use strict';

// ************
// DEPENDENCIES
// ************

const electron 						= require('electron');
const app 								= electron.app;
const BrowserWindow 			= electron.BrowserWindow;
const menu 								= electron.Menu;
let mainWindow;

// ***************
// CRASH REPORTING
// ***************

const crashReporter 			= require('electron').crashReporter;
crashReporter.start({
  productName: 'Doc-tor',
  companyName: 'DocWave',
  submitURL: 'http://192.168.1.57:3000/error',
  autoSubmit: true
});

// ***************************
// APPLICATION EVENT LISTENERS
// ***************************

// once electron has booted up, createWindow
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function() {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});
// if theres no window, and the app icon is clicked => createWindow()
app.on('activate', function() {
	if (mainWindow === null) {
		createWindow();
	}
});

// *****************
// HELPER FUNCTIONS
// *****************

// creates the view window for desktop application
function createWindow() {
	mainWindow = new BrowserWindow({
		width: 900,
		minWidth: 900,
		height: 600,
		minHeight: 600,
		"node-integration": "iframe",
	});

	mainWindow.loadURL('file://' + __dirname + '/view/index.html');
	mainWindow.webContents.openDevTools();

	mainWindow.on('closed', function() {
		mainWindow = null;
	});
	initMenu()
}

// initialize a menu in top-left of desktop
//		-- included in createWindow() fn
function initMenu() {
	var Menu = require("menu");
	var template = [{
			label: "Application",
			submenu: [
				{
					label: "Doc-tor",
					selector: "orderFrontStandardAboutPanel:"
				},
				{
					type: "separator"
				},
				{
					label: "Quit",
					accelerator: "Command+Q",
					click: function() {
						app.quit();
					}
				}
	    ]
		}, {
			label: "Edit",
			submenu: [
				{
					label: "Undo",
					accelerator: "CmdOrCtrl+Z",
					selector: "undo:"
				},
				{
					label: "Redo",
					accelerator: "Shift+CmdOrCtrl+Z",
					selector: "redo:"
				},
				{
					type: "separator"
				},
				{
					label: "Cut",
					accelerator: "CmdOrCtrl+X",
					selector: "cut:"
				},
				{
					label: "Copy",
					accelerator: "CmdOrCtrl+C",
					selector: "copy:"
				},
				{
					label: "Paste",
					accelerator: "CmdOrCtrl+V",
					selector: "paste:"
				},
				{
					label: "Select All",
					accelerator: "CmdOrCtrl+A",
					selector: "selectAll:"
				},
        {
					label: "Find",
					accelerator: "Cmd+F",
					selector: "find:"
				}
	    ]
		}
	];
	Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}
