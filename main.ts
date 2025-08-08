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

// main.js - Main Electron process
const { app, BrowserWindow, ipcMain, screen } = require('electron');
const path = require('path');

class BubbleManager {
  constructor() {
    this.mainWindow = null;
    this.bubbleWindow = null;
    this.isMinimized = false;
  }

  createMainWindow() {
    this.mainWindow = new BrowserWindow({
      width: 1200,
      height: 800,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false
      }
    });

    this.mainWindow.loadURL('http://localhost:4200'); // Your Angular dev server

    // Handle minimize to bubble
    this.mainWindow.on('minimize', () => {
      this.minimizeToBubble();
    });

    this.mainWindow.on('close', (event) => {
      if (!this.isMinimized) {
        event.preventDefault();
        this.minimizeToBubble();
      }
    });
  }

  minimizeToBubble() {
    this.isMinimized = true;
    this.mainWindow.hide();
    this.createBubble();
  }

  createBubble() {
    if (this.bubbleWindow) {
      this.bubbleWindow.show();
      return;
    }

    const { width, height } = screen.getPrimaryDisplay().workAreaSize;
    
    this.bubbleWindow = new BrowserWindow({
      width: 80,
      height: 80,
      x: width - 100,
      y: height - 100,
      frame: false,
      alwaysOnTop: true,
      resizable: false,
      transparent: true,
      skipTaskbar: true,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false
      }
    });

    // Load bubble HTML
    this.bubbleWindow.loadFile(path.join(__dirname, 'bubble.html'));

    // Make bubble draggable
    this.bubbleWindow.setIgnoreMouseEvents(false);
    
    // Handle bubble click to restore main window
    this.bubbleWindow.on('click', () => {
      this.restoreMainWindow();
    });

    // Keep bubble on top and handle positioning
    this.bubbleWindow.setAlwaysOnTop(true, 'floating');
  }

  restoreMainWindow() {
    this.isMinimized = false;
    this.mainWindow.show();
    this.mainWindow.focus();
    if (this.bubbleWindow) {
      this.bubbleWindow.hide();
    }
  }
}

// Initialize app
const bubbleManager = new BubbleManager();

app.whenReady().then(() => {
  bubbleManager.createMainWindow();
});

// IPC handlers
ipcMain.handle('minimize-to-bubble', () => {
  bubbleManager.minimizeToBubble();
});

ipcMain.handle('restore-from-bubble', () => {
  bubbleManager.restoreMainWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    bubbleManager.createMainWindow();
  }
});