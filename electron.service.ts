import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ElectronService {
  private get electronAPI() {
    return (window as any).electronAPI;
  }

  get isElectron(): boolean {
    return !!(window && window.process && window.process.type);
  }

  // Database operations
  dbQuery(query: string, params?: any[]): Observable<any> {
    if (!this.isElectron) {
      throw new Error('Not running in Electron environment');
    }
    return from(this.electronAPI.dbQuery(query, params));
  }

  dbRun(query: string, params?: any[]): Observable<any> {
    if (!this.isElectron) {
      throw new Error('Not running in Electron environment');
    }
    return from(this.electronAPI.dbRun(query, params));
  }

  // User management
  createUser(name: string, email: string): Observable<any> {
    return this.dbRun(
      'INSERT INTO users (name, email) VALUES (?, ?)',
      [name, email]
    );
  }

  getUsers(): Observable<any[]> {
    return this.dbQuery('SELECT * FROM users ORDER BY created_at DESC');
  }

  updateUser(id: number, name: string, email: string): Observable<any> {
    return this.dbRun(
      'UPDATE users SET name = ?, email = ? WHERE id = ?',
      [name, email, id]
    );
  }

  deleteUser(id: number): Observable<any> {
    return this.dbRun('DELETE FROM users WHERE id = ?', [id]);
  }

  // Settings management
  getSetting(key: string): Observable<any> {
    return this.dbQuery('SELECT value FROM settings WHERE key = ?', [key]);
  }

  setSetting(key: string, value: string): Observable<any> {
    return this.dbRun(
      `INSERT OR REPLACE INTO settings (key, value, updated_at) 
       VALUES (?, ?, CURRENT_TIMESTAMP)`,
      [key, value]
    );
  }

  // Windows operations
  showMessageBox(options: any): Observable<any> {
    if (!this.isElectron) {
      throw new Error('Not running in Electron environment');
    }
    return from(this.electronAPI.showMessageBox(options));
  }

  showSaveDialog(options: any): Observable<any> {
    if (!this.isElectron) {
      throw new Error('Not running in Electron environment');
    }
    return from(this.electronAPI.showSaveDialog(options));
  }

  showOpenDialog(options: any): Observable<any> {
    if (!this.isElectron) {
      throw new Error('Not running in Electron environment');
    }
    return from(this.electronAPI.showOpenDialog(options));
  }

  // App info
  getAppVersion(): Observable<string> {
    if (!this.isElectron) {
      throw new Error('Not running in Electron environment');
    }
    return from(this.electronAPI.getAppVersion());
  }

  getAppPath(name: string): Observable<string> {
    if (!this.isElectron) {
      throw new Error('Not running in Electron environment');
    }
    return from(this.electronAPI.getAppPath(name));
  }

  // File operations
  readFile(filePath: string): Observable<string> {
    if (!this.isElectron) {
      throw new Error('Not running in Electron environment');
    }
    return from(this.electronAPI.readFile(filePath));
  }

  writeFile(filePath: string, data: string): Observable<boolean> {
    if (!this.isElectron) {
      throw new Error('Not running in Electron environment');
    }
    return from(this.electronAPI.writeFile(filePath, data));
  }
}