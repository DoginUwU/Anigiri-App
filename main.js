const {app, BrowserWindow, Notification} = require('electron');
const path = require('path');
const mongoose = require("mongoose");
const ejse = require('ejs-electron')
require('electron-reload')(__dirname);

mongoose.connect('mongodb+srv://Moeefa:l567h789x@animes-vbz1o.mongodb.net/animes', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

init();

require('./src/dlna');

async function init () {
  const ptBR_animes = require("./src/schemas/pt-br_animes");
  var ptBR_result = {};
  await ptBR_animes.find({}, (err, resulted) => {
    ptBR_result = resulted;
  });
  /*setInterval(async () => {
    await ptBR_animes.find({}, (err, resulted) => {
      ptBR_result = resulted;
    });
  }, 120000);*/

  ejse.data('ptBR_animes', ptBR_result);

  function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 800,
    show: true,
    frame: false,
    icon: __dirname + 'Icon/AppIcon.ico',
    titleBarStyle: "hidden",
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true
    }
  })

  mainWindow.loadURL(`file://${__dirname}/src/index.ejs`)
  //mainWindow.loadFile('src/index.html')
  }
  app.whenReady().then(createWindow);

  app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
  })

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  })

  
};

 

