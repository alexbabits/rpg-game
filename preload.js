const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld(
  'electron',
  {
    invokeSave: async (gameState) => await ipcRenderer.invoke('saveGameState', gameState),
    invokeLoad: async () => await ipcRenderer.invoke('loadGameState'),
  }
);