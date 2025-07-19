# Electron-Angular
# Electron + Angular App with SQLite and REST API

A complete desktop application built with Electron and Angular that features local SQLite database storage, REST API integration, and Windows-specific functionality.

## Features

- **Angular 17+** with standalone components
- **Electron** desktop application framework
- **SQLite** local database for offline storage
- **REST API** integration with error handling
- **Windows-specific operations** (dialogs, file system)
- **Data synchronization** between local and remote
- **File import/export** functionality
- **TypeScript** throughout the application

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager
- Git

## Installation

1. **Clone or create the project:**
```bash
mkdir electron-angular-app
cd electron-angular-app
```

2. **Initialize the project:**
```bash
npm init -y
```

3. **Install Angular CLI globally:**
```bash
npm install -g @angular/cli
```

4. **Create Angular project:**
```bash
ng new . --routing=false --style=css --package-manager=npm --standalone
```

5. **Install dependencies:**
```bash
npm install electron sqlite3 concurrently wait-on electron-builder
npm install --save-dev @types/node
```

## Project Structure

```
electron-angular-app/
├── src/
│   ├── app/
│   │   ├── services/
│   │   │   ├── electron.service.ts
│   │   │   └── api.service.ts
│   │   └── app.component.ts
│   ├── main.ts
│   └── index.html
├── main.ts (Electron main process)
├── preload.ts (Electron preload script)
├── build.js (Build script)
├── package.json
├── angular.json
└── README.md
```

## Development

1. **Start the development server:**
```bash
npm run electron-dev
```

This command will:
- Start the Angular development server on `http://localhost:4200`
- Wait for the server to be ready
- Launch the Electron application

2. **Build for production:**
```bash
npm run build-electron
```

## Scripts

- `npm start` - Start Angular development server
- `npm run electron` - Run Electron (after building Angular)
- `npm run electron-dev` - Run in development mode
- `npm run build` - Build Angular for production
- `npm run build-electron` - Build complete Electron app

## Configuration

### API Configuration

Update the `baseUrl` in `src/app/services/api.service.ts`:

```typescript
private baseUrl = 'https://your-api-endpoint.com/v1';
```

### Database Schema

The SQLite database is automatically created with these tables:

- **users**: id, name, email, created_at
- **settings**: id, key, value, updated_at

### Electron Security

The app uses:
- `contextIsolation: true`
- `nodeIntegration: false`
- Preload scripts for secure IPC communication

## Features in Detail

### Local Database (SQLite)
- Automatic database creation
- CRUD operations for users
- Settings management
- Offline-first approach

### REST API Integration
- HTTP client with error handling
- Authentication support
- Retry logic for failed requests
- Data synchronization

### Windows Integration
- Native dialogs (save, open, message)
- File system operations
- App version and path information
- System tray support (can be added)

### Data Management
- JSON import/export
- CSV export functionality
- Data validation
- Conflict resolution

## Troubleshooting

### Common Issues

1. **SQLite installation issues:**
```bash
npm rebuild sqlite3
```

2. **Electron build issues:**
```bash
npm run postinstall
```

3. **Angular build issues:**
```bash
ng build --configuration production
```

### Development Tips

1. **Debug the main process:**
   - Use `console.log()` in `main.ts`
   - Check the terminal output

2. **Debug the renderer process:**
   - Use Chrome DevTools (F12)
   - Check the console for errors

3. **Database debugging:**
   - Database file location: `app.getPath('userData')/app.db`
   - Use SQLite browser tools

## Deployment

### Windows
```bash
npm run build-electron
```

The installer will be created in the `release` folder.

### Auto-updater (Optional)

Add electron-updater for automatic updates:
```bash
npm install electron-updater
```

## Security Considerations

1. **API Keys**: Store sensitive keys in environment variables
2. **Database**: Encrypt sensitive data before storing
3. **Updates**: Implement code signing for production builds
4. **Content Security Policy**: Add CSP headers for additional security

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
1. Check the troubleshooting section
2. Search existing issues
3. Create a new issue with details

---

This template provides a solid foundation for building desktop applications with modern web technologies while maintaining native desktop capabilities.