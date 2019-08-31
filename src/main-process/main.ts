import { app, BrowserWindow } from 'electron';

let mainWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({ width: 420, height: 700 });
  mainWindow.loadURL('http://localhost:1234');
});
