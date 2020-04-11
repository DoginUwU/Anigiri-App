const {app, BrowserWindow, Notification, globalShortcut, Menu} = require('electron');
const path = require('path');
const mongoose = require("mongoose");
const ejse = require('ejs-electron');
var fs = require('fs');
const Store = require('electron-store');
const store = new Store();
require('dotenv').config();
//require('electron-reload')(__dirname);

mongoose.connect(process.env.MONGODB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

init();

//require('./src/dlna');

const template = [
  {
  label: 'Anigiri',
  submenu: [
    { role: 'quit' }
  ]
  },
  {
    label: 'Outros',
    submenu: [
      { role: 'reload' },
      { role: 'forcereload' },
      { role: 'toggledevtools' },
      { role: 'togglefullscreen' }
    ]
  }
]

const menu = Menu.buildFromTemplate(template);


async function init () {
  const ptBR_animes = require("./src/schemas/pt-br_animes");
  var ptBR_result = {};
  await ptBR_animes.find({}, (err, resulted) => {
    ptBR_result = resulted;
  });

  ejse.data('ptBR_animes', ptBR_result);
  ejse.data('page', 1);

  fs.readdir(__dirname + "/src/temp", (err, files) => {
    if (err) throw err;
  
    for (const file of files) {
      fs.unlink(path.join(__dirname + "/src/temp", file), err => {
        if (err) throw err;
      });
    }
  });

  if(!store.has("MBtoWaitForConnectOnTV")){
    store.set("MBtoWaitForConnectOnTV", 10);
  }
  if(!store.has("enableNotify")){
    store.set("enableNotify", true);
  }

  let mainWindow,
    loadingScreen,
    windowParams = {
      width: 1240,
      height: 730,
      show: true,
      backgroundColor: '#222',
      frame: false,
      icon: __dirname + 'Icon/AppIcon.ico',
      titleBarStyle: "hidden",
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        nodeIntegration: true,
        nodeIntegrationInWorker: true
      }
    }; 

  function createWindow () {
  mainWindow = new BrowserWindow(windowParams);

  mainWindow.loadURL(`file://${__dirname}/src/index.ejs`)

  Menu.setApplicationMenu(menu);

  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.show();

    let contents = mainWindow.webContents
  });

  mainWindow.on('closed', function() {
    mainWindow = null;
  })

  //mainWindow.loadFile('src/index.html')
  }
  app.whenReady().then(createWindow);

  app.on('ready', () => {
    //createWindow();
    //console.log("a");
  })

  app.on('window-all-closed', function () {
    app.quit()
  })

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0 || mainWindow === null) createWindow();
  })
};

 

