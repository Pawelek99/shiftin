const { app, BrowserWindow } = require('electron');
const url = require('url');
const path = require('path');

const createWindow = () => {
  const win = new BrowserWindow({
    paintWhenInitiallyHidden: false,
    title: 'Shift.in',
    show: false,
    webPreferences: {
      allowRunningInsecureContent: true,
      devTools: false,
      scrollBounce: true,
      nodeIntegration: true,
    },
  });

  win.loadURL(
    process.env.URL ||
      url.format({
        pathname: path.join(__dirname, '/build/index.html'),
        protocol: 'file:',
        slashes: true,
      })
  );
  win.maximize();
  win.show();
};

app.on('ready', createWindow);
app.on('window-all-closed', app.quit);
