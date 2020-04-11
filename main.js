const {app, BrowserWindow, Notification, globalShortcut, Menu} = require('electron');
const path = require('path');
const mongoose = require("mongoose");
const ejse = require('ejs-electron')
require('electron-reload')(__dirname);

mongoose.connect('mongodb+srv://ElectronRead:KPADEGA8iDKNXgKN@animes-vbz1o.mongodb.net/animes', {
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
        nodeIntegration: true
      }
    }; 

  function createWindow () {
  mainWindow = new BrowserWindow(windowParams);

  mainWindow.loadURL(`file://${__dirname}/src/index.ejs`)

  Menu.setApplicationMenu(menu);

  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.show();

    globalShortcut.register('f5', function() {
      console.log('f5 is pressed')
      mainWindow.reload()
    })
    globalShortcut.register('CommandOrControl+R', function() {
      console.log('CommandOrControl+R is pressed')
      mainWindow.reload()
    })
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

 

