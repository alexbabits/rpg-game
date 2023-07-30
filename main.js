const { app, BrowserWindow, ipcMain } = require('electron')
const ElectronStore = require('electron-store')
const path = require('path')

let win;
let store;

function createWindow () {
  win = new BrowserWindow({
    width: 1400,
    height: 900,
    icon: path.join(__dirname, 'assets/images/gameicon.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
    }
  })
  win.setBackgroundColor('#000')
  win.removeMenu();
  win.webContents.openDevTools()
  store = new ElectronStore()
  win.loadFile('index.html')
}

app.whenReady().then(createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

ipcMain.handle('saveGameState', (event, gameState) => {
  return store.set('gameState', gameState);
});

ipcMain.handle('loadGameState', (event) => {
  return store.get('gameState');
});

ipcMain.on('quit-app', () => {
  app.quit();
});