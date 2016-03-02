'use strict';
const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const Menu = electron.Menu;
const ipcMain = electron.ipcMain;
const fs = require('fs');
const request = require('request');
const yauzl = require('yauzl');
const mkdirp = require('mkdirp');


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

// test a request to endpoint provided later
function getDocsFromServer(endPoint, locationToPlaceRetrievedFiles, cb) {
	let readStream = fs.createWriteStream(locationToPlaceRetrievedFiles)
	request(endPoint).pipe(readStream)

	readStream.on('close', function() {
		if (cb) {cb()}
	})
}
const endPoints = {
	node: 'http://104.131.124.20:8080/node',
	express: 'http://104.131.124.20:8080/express',
	mdn_javascript: 'http://104.131.124.20:8080/mdn_javascript',
	mdn_html: 'http://104.131.124.20:8080/mdn_html',
	mdn_css: 'http://104.131.124.20:8080/mdn_css',
}

function createWindow() {

	//if the render process requests a docset, we're going to want to check if we have.
	//		* if we do, we'll pass back the json file - render process transforms it into sidebar listItems!
	// 		* if we don't...
	// 					* query the endpoint associated with that file, storing the zip in docStorage
	//					* unZip the zip file, creating a sibling directory next to the zip file
	// 					* read the new directories JSON file and send it back


	ipcMain.on('reqDocset', (event, arg) => {
		console.log(arg);
		let data = JSON.parse(fs.readFileSync(__dirname + `/app/docStorage/${arg}.docs/index.json`))
		event.sender.send('reqDocset', [arg, data.result]);

	// 	if (arg === 'node') {
	// 		let node_data = JSON.parse(fs.readFileSync(__dirname + '/app/docStorage/node.docs/index.json'))
	// 		event.sender.send('reqDocset', ['node', node_data.result]);
	// 	}
	// 	if (arg === 'express') {
	// 		let express_data = JSON.parse(fs.readFileSync(__dirname + '/app/docStorage/express.docs/index.json'))
	// 		event.sender.send('reqDocset', ['express', express_data.result]);
	// 	}
	});

		// try {
		// 	fs.statSync('app/docStorage/'+arg+'.docs');
		// 	fs.readdir('app/docStorage/'+arg+'.docs', (err, data) => {
		// 		// throw(err)
		// 		// if (err) console.log('right under readdir in try ',err)
		// 		// if file exists => readFile
		// 			console.log('file exists!!');
		// 			fs.readFile(__dirname + '/app/docStorage/'+arg+'.docs/index.json', (err, data) => {
		// 				console.log('file exists!!', err, data);
		// 				if (err) {event.sender.send('reqDocset', [arg, 'An error occured while trying to grab ' + arg]) }
		// 				else { event.sender.send('reqDocset', [arg, JSON.parse(data).result]) }
		// 			})
		// 		}) //end of no error and data exists
		//
		// }
		// catch(e) {
		// 	console.log('querying docs from API');
		// 	getDocsFromServer(endPoints[arg], 'app/docStorage/' + arg + '.docs/', () => {
		// 		console.log('attempting unzipping');
		// 		unZipThisFile('app/docStorage/'+arg+'.zip', 'app/docStorage/', () => {
		// 			console.log('unzipping succesful, reading new directory');
		// 			fs.readFile(__dirname + '/app/docStorage/'+arg+'.docs/index.json', (err, data) => {
		// 				if (err) {event.sender.send('reqDocset', [arg, 'An error occured while trying to grab '+arg ])}
		// 				else {
		// 					event.sender.send('reqDocset', [arg, JSON.parse(data).result])
		// 				}
		// 			})
		// 		})//end of unZipThisFile
		// 	}) //end of getDocsFromServer
		// }

			// if file doesn't exist => getDocs from server, unzip them, and then read the JSON file to send back.
			// else {
			//
			// } //end of error and no data
		//}) //end of readdir



	// Create the browser window.
	let windowOptions = {
		minWidth: 1000,
		width: 1000,
		minHeight: 900,
		height: 900,
		titleBarStyle: 'hidden-inset',
		fullscreen: true
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
function initMenu() {var template = [
  {
    label: 'Edit',
    submenu: [
      {
        label: 'Undo',
        accelerator: 'CmdOrCtrl+Z',
        role: 'undo'
      },
      {
        label: 'Redo',
        accelerator: 'Shift+CmdOrCtrl+Z',
        role: 'redo'
      },
      {
        type: 'separator'
      },
      {
        label: 'Cut',
        accelerator: 'CmdOrCtrl+X',
        role: 'cut'
      },
      {
        label: 'Copy',
        accelerator: 'CmdOrCtrl+C',
        role: 'copy'
      },
      {
        label: 'Paste',
        accelerator: 'CmdOrCtrl+V',
        role: 'paste'
      },
      {
        label: 'Select All',
        accelerator: 'CmdOrCtrl+A',
        role: 'selectall'
      },
    ]
  },
  {
    label: 'View',
    submenu: [
      {
        label: 'Reload',
        accelerator: 'CmdOrCtrl+R',
        click: function(item, focusedWindow) {
          if (focusedWindow)
            focusedWindow.reload();
        }
      },
      {
        label: 'Toggle Full Screen',
        accelerator: (function() {
          if (process.platform == 'darwin')
            return 'Ctrl+Command+F';
          else
            return 'F11';
        })(),
        click: function(item, focusedWindow) {
          if (focusedWindow)
            focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
        }
      },
      {
        label: 'Toggle Developer Tools',
        accelerator: (function() {
          if (process.platform == 'darwin')
            return 'Alt+Command+I';
          else
            return 'Ctrl+Shift+I';
        })(),
        click: function(item, focusedWindow) {
          if (focusedWindow)
            focusedWindow.toggleDevTools();
        }
      },
    ]
  },
  {
    label: 'Window',
    role: 'window',
    submenu: [
      {
        label: 'Minimize',
        accelerator: 'CmdOrCtrl+M',
        role: 'minimize'
      },
      {
        label: 'Close',
        accelerator: 'CmdOrCtrl+W',
        role: 'close'
      },
    ]
  },
  {
    label: 'Help',
    role: 'help',
    submenu: [
      {
        label: 'Learn More',
        click: function() { require('electron').shell.openExternal('http://electron.atom.io') }
      },
    ]
  },
];

if (process.platform == 'darwin') {
  var name = require('electron').app.getName();
  template.unshift({
    label: name,
    submenu: [
      {
        label: 'About ' + name,
        role: 'about'
      },
      {
        type: 'separator'
      },
      {
        label: 'Services',
        role: 'services',
        submenu: []
      },
      {
        type: 'separator'
      },
      {
        label: 'Hide ' + name,
        accelerator: 'Command+H',
        role: 'hide'
      },
      {
        label: 'Hide Others',
        accelerator: 'Command+Alt+H',
        role: 'hideothers'
      },
      {
        label: 'Show All',
        role: 'unhide'
      },
      {
        type: 'separator'
      },
      {
        label: 'Quit',
        accelerator: 'Command+Q',
        click: function() { app.quit(); }
      },
    ]
  });
  // Window menu.
  template[3].submenu.push(
    {
      type: 'separator'
    },
    {
      label: 'Bring All to Front',
      role: 'front'
    }
  );
}

var menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);
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




// function to unzip and place file somewhere
function unZipThisFile(fileToUnzip, locationToPlaceUnZippedFiles, cb) {
	yauzl.open(fileToUnzip, {
		lazyEntries: true
	}, function(err, zipfile) {
		if (err) throw err
		zipfile.readEntry()
		zipfile.on("entry", function(entry) {
			if (/\/$/.test(locationToPlaceUnZippedFiles + entry.fileName)) {
				// directory file names end with '/'
				mkdirp(locationToPlaceUnZippedFiles + entry.fileName, function(err) {
					if (err) throw err
					zipfile.readEntry()
					if (cb) cb()
				})
			} else {
				// file entry
				zipfile.openReadStream(entry, function(err, readStream) {
					if (err) throw err
						// ensure parent directory exists
					mkdirp(locationToPlaceUnZippedFiles + path.dirname(entry.fileName), function(err) {
						if (err) throw err
						readStream.pipe(fs.createWriteStream(locationToPlaceUnZippedFiles + entry.fileName))
						readStream.on("end", function() {
							zipfile.readEntry()
							if (cb) cb()
						})
					})
				})
			}
		})
	})
}
