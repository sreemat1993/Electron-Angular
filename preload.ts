import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  // Database operations
  saveToLocal: (key: string, value: any) => ipcRenderer.invoke('save-to-local', key, value),
  getFromLocal: (key: string) => ipcRenderer.invoke('get-from-local', key),
  getAllFromLocal: () => ipcRenderer.invoke('get-all-from-local'),
  deleteFromLocal: (key: string) => ipcRenderer.invoke('delete-from-local', key),
  
  // Notification operations
  showNotification: (title: string, body: string) => ipcRenderer.invoke('show-notification', title, body),
  
  // Window operations
  minimizeWindow: () => ipcRenderer.invoke('minimize-window'),
  maximizeWindow: () => ipcRenderer.invoke('maximize-window'),
  closeWindow: () => ipcRenderer.invoke('close-window')
});