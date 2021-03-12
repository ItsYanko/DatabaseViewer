require("./server")(); // Start server
const { app, BrowserWindow } = require('electron')

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 500,
        minWidth: 500,
        minHeight: 500,
        maxWidth: 1000,
        maxHeight: 750,
        title: "Base de Dados do ZOO",
        webPreferences: {
            nodeIntegration: true
        }
    })

    win.loadFile('./app/index.html');
    win.setMenu(null);
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
})
