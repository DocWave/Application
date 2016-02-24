'use strict';
const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const Menu = electron.Menu;
const ipcMain = electron.ipcMain;
const fs = require('fs')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
	// BELOW IS SQL PARSING LOGIC, TEMPORARY TESTING
	ipcMain.on('reqDocset', function(event, arg) {
		console.log(arg);
		if (arg === 'node') {
			let node_data = JSON.parse(fs.readFileSync(__dirname + '/app/docStorage/node.docs/index.json'))
			event.sender.send('reqDocset', ['node', node_data.result]);
		}
		if (arg === 'express') {
			let express_data = JSON.parse(fs.readFileSync(__dirname + '/app/docStorage/express.docs/index.json'))
			event.sender.send('reqDocset', ['express', express_data.result]);
		}
	});

	// Create the browser window.
	let windowOptions = {
    minWidth: 1000,
		width: 1000,
    minHeight: 900,
		height: 900,
    titleBarStyle: 'hidden-inset'
	}

	mainWindow = new BrowserWindow(windowOptions);
	mainWindow.maximize()

	// and load the index.html of the app.
	mainWindow.loadURL('file://' + __dirname + '/app/index.html');

	// Open the DevTools.
	//mainWindow.webContents.openDevTools();

	// Emitted when the window is closed.
	mainWindow.on('closed', function() {
		// Dereference the window object, usually you would store windows
		// in an array if your app supports multi windows, this is the time
		// when you should delete the corresponding element.
		mainWindow = null;
	});
	initMenu();
}

// Menu
function initMenu() {
	// var Menu = require("menu");
	var template = [{
			label: "Application",
			submenu: [
				{
					label: "DocWave",
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
				}
	    ]
		}
	];
	Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', createWindow);
// Quit when all windows are closed.
app.on('window-all-closed', function() {
	// On OS X it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== 'darwin') {
		app.quit();
	}
});
app.on('activate', function() {
	// On OS X it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (mainWindow === null) {
		createWindow();
	}
});
