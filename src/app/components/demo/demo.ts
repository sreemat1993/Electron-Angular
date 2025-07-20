import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Api } from '../../services/api';
import { Notification } from '../../services/notification';

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './demo.html',
  styleUrls: ['./demo.css']
})
export class DemoComponent implements OnInit {

  // Local storage demo
  localKey = '';
  localValue = '';
  localData: any[] = [];

  // HTTP demo
  httpUrl = 'https://jsonplaceholder.typicode.com/posts';
  httpData: any[] = [];

  // Status messages
  statusMessage = '';

  constructor(private apiService: Api, private notificationService: Notification) { }

  ngOnInit() {
    this.loadLocalData();
    this.loadHttpData();
  }

  // Local SQLite operations
  async saveToLocal() {
    try {
      if (this.localKey && this.localValue) {
        await this.apiService.saveToLocal(this.localKey, this.localValue);
        this.statusMessage = 'Data saved to local database!';
        this.localKey = '';
        this.localValue = '';
        this.loadLocalData();
      }
    } catch (error) {
      this.statusMessage = `Error saving: ${error}`;
    }
  }

  async loadLocalData() {
    try {
      this.localData = await this.apiService.getAllFromLocal();
    } catch (error) {
      this.statusMessage = `Error loading local data: ${error}`;
    }
  }

  async deleteLocalItem(key: string) {
    try {
      await this.apiService.deleteFromLocal(key);
      this.statusMessage = 'Item deleted!';
      this.loadLocalData();
    } catch (error) {
      this.statusMessage = `Error deleting: ${error}`;
    }
  }

  // HTTP operations
  loadHttpData() {
    this.apiService.get(this.httpUrl).subscribe({
      next: (data: any) => {
        this.httpData = data.slice(0, 5); // Show first 5 posts
        this.statusMessage = 'HTTP data loaded successfully!';
      },
      error: (error: any) => {
        this.statusMessage = `HTTP Error: ${error.message}`;
      }
    });
  }

  // Window controls
  minimizeWindow() {
    this.apiService.minimizeWindow();
  }

  maximizeWindow() {
    this.apiService.maximizeWindow();
  }

  closeWindow() {
    this.apiService.closeWindow();
  }

  async triggerNotification() {
    const success = await this.notificationService.showNotification(
      'Test Notification',
      'This is a test notification from your app!'
    );
    console.log('Notification shown:', success);
  }
}