import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Notification {
  async showNotification(title: string, body: string): Promise<boolean> {
    if (window.electronAPI) {
      return await window.electronAPI.showNotification(title, body);
    }
    return false;
  }
}