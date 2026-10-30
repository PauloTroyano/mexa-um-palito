const { app, BrowserWindow, shell } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 860,
    height: 1000,
    minWidth: 420,
    minHeight: 640,
    title: 'Mexa Um Palito',
    backgroundColor: '#FCFCF7',
    autoHideMenuBar: true,
    webPreferences: { contextIsolation: true, nodeIntegration: false, sandbox: true },
  });
  win.loadFile(path.join(__dirname, '..', 'dist', 'index.html'));
  // links externos abrem no navegador padrão, nunca dentro do jogo
  win.webContents.setWindowOpenHandler(({ url }) => { shell.openExternal(url); return { action: 'deny' }; });
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => app.quit());
