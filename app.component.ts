import { Component, OnInit } from '@angular/core';
import { ElectronService } from './services/electron.service';
import { ApiService } from './services/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface User {
  id?: number;
  name: string;
  email: string;
  created_at?: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="app-container">
      <header class="header">
        <h1>Electron + Angular App</h1>
        <div class="app-info">
          <span>Version: {{ appVersion }}</span>
          <button (click)="testConnection()" class="btn btn-secondary">Test API</button>
        </div>
      </header>

      <main class="main-content">
        <div class="section">
          <h2>Local Database (SQLite)</h2>
          
          <div class="form-group">
            <h3>Add User</h3>
            <input 
              [(ngModel)]="newUser.name" 
              placeholder="Name" 
              class="form-control"
            >
            <input 
              [(ngModel)]="newUser.email" 
              placeholder="Email" 
              class="form-control"
            >
            <button (click)="addUser()" class="btn btn-primary">Add User</button>
          </div>

          <div class="users-list">
            <h3>Users ({{ localUsers.length }})</h3>
            <div *ngFor="let user of localUsers" class="user-card">
              <div class="user-info">
                <strong>{{ user.name }}</strong>
                <span>{{ user.email }}</span>
                <small>{{ user.created_at | date:'short' }}</small>
              </div>
              <div class="user-actions">
                <button (click)="editUser(user)" class="btn btn-sm btn-secondary">Edit</button>
                <button (click)="deleteUser(user.id!)" class="btn btn-sm btn-danger">Delete</button>
              </div>
            </div>
          </div>
        </div>

        <div class="section">
          <h2>Remote API Data</h2>
          <div class="api-actions">
            <button (click)="fetchApiUsers()" class="btn btn-primary">Fetch Users</button>
            <button (click)="syncData()" class="btn btn-success">Sync Data</button>
          </div>
          
          <div class="api-status">
            <span [class]="'status ' + (apiStatus === 'connected' ? 'connected' : 'disconnected')">
              API Status: {{ apiStatus }}
            </span>
          </div>

          <div *ngIf="apiUsers.length > 0" class="users-list">
            <h3>API Users ({{ apiUsers.length }})</h3>
            <div *ngFor="let user of apiUsers" class="user-card">
              <div class="user-info">
                <strong>{{ user.name }}</strong>
                <span>{{ user.email }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="section">
          <h2>File Operations</h2>
          <div class="file-actions">
            <button (click)="saveFile()" class="btn btn-primary">Save Data</button>
            <button (click)="loadFile()" class="btn btn-secondary">Load Data</button>
            <button (click)="exportData()" class="btn btn-success">Export Users</button>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .app-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      font-family: Arial, sans-serif;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 2px solid #eee;
    }

    .app-info {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .main-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 30px;
    }

    .section {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .section:last-child {
      grid-column: 1 / -1;
    }

    .form-group {
      margin-bottom: 20px;
      padding: 15px;
      background: white;
      border-radius: 6px;
    }

    .form-control {
      width: 100%;
      padding: 8px 12px;
      margin: 5px 0;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
    }

    .btn {
      padding: 8px 16px;
      margin: 5px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      transition: background-color 0.2s;
    }

    .btn-primary {
      background-color: #007bff;
      color: white;
    }

    .btn-secondary {
      background-color: #6c757d;
      color: white;
    }

    .btn-success {
      background-color: #28a745;
      color: white;
    }

    .btn-danger {
      background-color: #dc3545;
      color: white;
    }

    .btn-sm {
      padding: 4px 8px;
      font-size: 12px;
    }

    .btn:hover {
      opacity: 0.9;
    }

    .users-list {
      max-height: 400px;
      overflow-y: auto;
    }

    .user-card {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px;
      margin: 5px 0;
      background: white;
      border-radius: 4px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    .user-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .user-info strong {
      font-weight: 600;
    }

    .user-info span {
      color: #666;
      font-size: 14px;
    }

    .user-info small {
      color: #999;
      font-size: 12px;
    }

    .user-actions {
      display: flex;
      gap: 5px;
    }

    .api-actions, .file-actions {
      margin-bottom: 15px;
    }

    .api-status {
      margin-bottom: 15px;
    }

    .status {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
    }

    .status.connected {
      background-color: #d4edda;
      color: #155724;
    }

    .status.disconnected {
      background-color: #f8d7da;
      color: #721c24;
    }

    h1, h2, h3 {
      color: #333;
    }

    h2 {
      margin-top: 0;
      margin-bottom: 20px;
    }

    h3 {
      margin-bottom: 15px;
      font-size: 16px;
    }
  `]
})
export class AppComponent implements OnInit {
  title = 'electron-angular-app';
  appVersion = '';
  localUsers: User[] = [];
  apiUsers: User[] = [];
  apiStatus = 'disconnected';
  
  newUser: User = {
    name: '',
    email: ''
  };

  constructor(
    private electronService: ElectronService,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.loadAppVersion();
    this.loadLocalUsers();
    this.testConnection();
  }

  loadAppVersion() {
    if (this.electronService.isElectron) {
      this.electronService.getAppVersion().subscribe(version => {
        this.appVersion = version;
      });
    }
  }

  loadLocalUsers() {
    this.electronService.getUsers().subscribe(users => {
      this.localUsers = users;
    });
  }

  addUser() {
    if (this.newUser.name && this.newUser.email) {
      this.electronService.createUser(this.newUser.name, this.newUser.email).subscribe(() => {
        this.loadLocalUsers();
        this.newUser = { name: '', email: '' };
        this.showMessage('User added successfully!');
      });
    }
  }

  editUser(user: User) {
    const newName = prompt('Edit name:', user.name);
    const newEmail = prompt('Edit email:', user.email);
    
    if (newName && newEmail) {
      this.electronService.updateUser(user.id!, newName, newEmail).subscribe(() => {
        this.loadLocalUsers();
        this.showMessage('User updated successfully!');
      });
    }
  }

  deleteUser(id: number) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.electronService.deleteUser(id).subscribe(() => {
        this.loadLocalUsers();
        this.showMessage('User deleted successfully!');
      });
    }
  }

  testConnection() {
    this.apiService.healthCheck().subscribe(
      response => {
        this.apiStatus = 'connected';
        console.log('API health check passed:', response);
      },
      error => {
        this.apiStatus =