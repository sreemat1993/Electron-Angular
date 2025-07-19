import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Database operations
  dbQuery: (query: string, params?: any[]) => ipcRenderer.invoke('db-query', query, params),
  dbRun: (query: string, params?: any[]) => ipcRenderer.invoke('db-run', query, params),
  
  // Windows operations
  showMessageBox: (options: any) => ipcRenderer.invoke('show-message-box', options),
  showSaveDialog: (options: any) => ipcRenderer.invoke('show-save-dialog', options),
  showOpenDialog: (options: any) => ipcRenderer.invoke('show-open-dialog', options),
  
  // App info
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  getAppPath: (name: string) => ipcRenderer.invoke('get-app-path', name),
  
  // File system operations
  readFile: (filePath: string) => ipcRenderer.invoke('fs-read-file', filePath),
  writeFile: (filePath: string, data: string) => ipcRenderer.invoke('fs-write-file', filePath, data),
});

// Define the interface for TypeScript
declare global {
  interface Window {
    electronAPI: {
      dbQuery: (query: string, params?: any[]) => Promise<any>;
      dbRun: (query: string, params?: any[]) => Promise<any>;
      showMessageBox: (options: any) => Promise<any>;
      showSaveDialog: (options: any) => Promise<any>;
      showOpenDialog: (options: any) => Promise<any>;
      getAppVersion: () => Promise<string>;
      getAppPath: (name: string) => Promise<string>;
      readFile: (filePath: string) => Promise<string>;
      writeFile: (filePath: string, data: string) => Promise<boolean>;
    };
  }
}