const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    showNotification: (data) => ipcRenderer.invoke('show-notification', data),
    onNotificationClicked: (callback) => ipcRenderer.on('notification-clicked', (event, actionUrl) => callback(actionUrl)),
});
