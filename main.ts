import { app, BrowserWindow, ipcMain, Notification } from 'electron';
import * as path from 'path';
import * as isDev from 'electron-is-dev';
import { DatabaseService } from './electron-services/database.service';
import * as notifier from 'node-notifier';

let mainWindow: BrowserWindow | null = null;
let dbService: DatabaseService;

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  const startUrl = isDev 
    ? 'http://localhost:4200' 
    : `file://${path.join(__dirname, '../dist/electron-angular-app/index.html')}`;
  
  mainWindow.loadURL(startUrl);

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// IPC Handlers
function setupIpcHandlers() {
  // Database operations
  ipcMain.handle('save-to-local', async (event, key: string, value: any) => {
    const result = await dbService.saveToLocal(key, value);
    
    // Show notification when data is saved
    if (Notification.isSupported()) {
      new Notification({
        title: 'Data Saved',
        body: `Successfully saved "${key}" to local database`,
        icon: path.join(__dirname, '../src/assets/icon.png') // Optional: add an icon
      }).show();
    }
    
    return result;
  });

  ipcMain.handle('get-from-local', async (event, key: string) => {
    return await dbService.getFromLocal(key);
  });

  ipcMain.handle('get-all-from-local', async () => {
    return await dbService.getAllFromLocal();
  });

  ipcMain.handle('delete-from-local', async (event, key: string) => {
    const result = await dbService.deleteFromLocal(key);
    
    // Show notification when data is deleted
    if (Notification.isSupported()) {
      new Notification({
        title: 'Data Deleted',
        body: `Successfully deleted "${key}" from local database`,
      }).show();
    }
    
    return result;
  });

  // Custom notification handler
  ipcMain.handle('show-notification', (event, title: string, body: string) => {
    if (Notification.isSupported()) {
      new Notification({
        title: title,
        body: body,
        urgency: 'normal'
      }).show();
      return true;
    }
    return false;
  });

  // Window operations
  ipcMain.handle('minimize-window', () => {
    mainWindow?.minimize();
  });

  ipcMain.handle('maximize-window', () => {
    mainWindow?.isMaximized() ? mainWindow.unmaximize() : mainWindow?.maximize();
  });

  ipcMain.handle('close-window', () => {
    mainWindow?.close();
  });
}
app.setName('Your App Name');
app.on('ready', () => {
  createWindow();
  dbService = new DatabaseService();
  setupIpcHandlers();
  
  // Show app started notification
  if (Notification.isSupported()) {
    new Notification({
      title: 'App Started',
      body: 'Electron Angular App is now running!',
    }).show();
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});