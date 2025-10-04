const { app, BrowserWindow, ipcMain, session, shell } = require('electron');
const path = require('path');
const zipFolder = require('zip-folder');

function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });
  win.loadFile('index.html');
}

app.whenReady().then(() => {
  createWindow();
  zipBuild();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

function zipBuild() {
  const outPath = path.resolve(__dirname, 'out/make');
  const zipPath = path.resolve(__dirname, 'out/OmniBrowser_Package.zip');

  zipFolder(outPath, zipPath, function (err) {
    if (err) {
      console.log('❌ 壓縮失敗:', err);
    } else {
      console.log('✅ 壓縮完成：', zipPath);
      shell.openPath(path.dirname(zipPath));
    }
  });
}