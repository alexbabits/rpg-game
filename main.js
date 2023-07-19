const { app, BrowserWindow } = require('electron')

function createWindow () {
  let win = new BrowserWindow({
    width: 912,
    height: 936,
    backgroundColor: '#000',
    webPreferences: {
      nodeIntegration: true,
    }
  })
  //win.webContents.openDevTools()
  win.loadFile('index.html')
  win.removeMenu();
  win.on('closed', function(){
    win = null
  })
}

app.whenReady().then(createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  } 
})