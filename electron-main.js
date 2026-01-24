const { app, BrowserWindow, Notification, ipcMain } = require('electron');
const { spawn } = require('child_process');
const path = require('path');

let mainWindow;
let nextProcess;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1400,
        height: 900,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js'),
        },
        icon: path.join(__dirname, 'public', 'icon.ico'),
    });

    // Espera a que Next.js esté listo
    setTimeout(() => {
        mainWindow.loadURL('http://localhost:3000');
    }, 3000);

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

function startNextServer() {
    // En Windows, npm es npm.cmd
    const isWindows = process.platform === 'win32';
    const npmCommand = isWindows ? 'npm.cmd' : 'npm';

    nextProcess = spawn(npmCommand, ['run', 'start'], {
        cwd: __dirname,
        shell: true,
    });

    nextProcess.stdout.on('data', (data) => {
        console.log(`Next.js: ${data}`);
    });

    nextProcess.stderr.on('data', (data) => {
        console.error(`Next.js Error: ${data}`);
    });
}

// IPC Handler for native notifications
ipcMain.handle('show-notification', (event, { title, body, actionUrl }) => {
    const notification = new Notification({
        title: title,
        body: body,
        icon: path.join(__dirname, 'public', 'icon.ico'),
    });

    notification.on('click', () => {
        if (mainWindow && actionUrl) {
            mainWindow.webContents.send('notification-clicked', actionUrl);
        }
    });

    notification.show();
    return true;
});

app.on('ready', () => {
    startNextServer();
    createWindow();
});

app.on('window-all-closed', () => {
    if (nextProcess) {
        nextProcess.kill();
    }
    app.quit();
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});
