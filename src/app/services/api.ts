import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

declare global {
  interface Window {
    electronAPI: {
      saveToLocal: (key: string, value: any) => Promise<any>;
      getFromLocal: (key: string) => Promise<any>;
      getAllFromLocal: () => Promise<any[]>;
      deleteFromLocal: (key: string) => Promise<any>;
      minimizeWindow: () => Promise<void>;
      maximizeWindow: () => Promise<void>;
      closeWindow: () => Promise<void>;
      showNotification: (title: string, body: string) => Promise<boolean>;
    };
  }
}

@Injectable({
  providedIn: 'root'
})
export class Api {

  constructor(private http: HttpClient) { }

  // HTTP Client methods
  get(url: string): Observable<any> {
    return this.http.get(url);
  }

  post(url: string, data: any): Observable<any> {
    return this.http.post(url, data);
  }

  put(url: string, data: any): Observable<any> {
    return this.http.put(url, data);
  }

  delete(url: string): Observable<any> {
    return this.http.delete(url);
  }

  // Electron Database methods
  async saveToLocal(key: string, value: any) {
    if (window.electronAPI) {
      return await window.electronAPI.saveToLocal(key, value);
    }
    throw new Error('Electron API not available');
  }

  async getFromLocal(key: string) {
    if (window.electronAPI) {
      return await window.electronAPI.getFromLocal(key);
    }
    throw new Error('Electron API not available');
  }

  async getAllFromLocal() {
    if (window.electronAPI) {
      return await window.electronAPI.getAllFromLocal();
    }
    throw new Error('Electron API not available');
  }

  async deleteFromLocal(key: string) {
    if (window.electronAPI) {
      return await window.electronAPI.deleteFromLocal(key);
    }
    throw new Error('Electron API not available');
  }

  // Window control methods
  async minimizeWindow() {
    if (window.electronAPI) {
      return await window.electronAPI.minimizeWindow();
    }
  }

  async maximizeWindow() {
    if (window.electronAPI) {
      return await window.electronAPI.maximizeWindow();
    }
  }

  async closeWindow() {
    if (window.electronAPI) {
      return await window.electronAPI.closeWindow();
    }
  }
}