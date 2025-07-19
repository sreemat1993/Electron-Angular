const { build } = require('electron-builder');
const { execSync } = require('child_process');

async function buildApp() {
  try {
    console.log('Building Angular app...');
    execSync('ng build --configuration production', { stdio: 'inherit' });
    
    console.log('Compiling TypeScript for Electron...');
    execSync('tsc main.ts --outDir dist --target es2020 --module commonjs --esModuleInterop', { stdio: 'inherit' });
    execSync('tsc preload.ts --outDir dist --target es2020 --module commonjs --esModuleInterop', { stdio: 'inherit' });
    
    console.log('Building Electron app...');
    await build({
      targets: process.platform === 'win32' ? 'win' : process.platform === 'darwin' ? 'mac' : 'linux',
      config: {
        appId: 'com.yourcompany.electronangularapp',
        productName: 'Electron Angular App',
        directories: {
          output: 'release'
        },
        files: [
          'dist/**/*',
          'node_modules/**/*',
          'package.json'
        ],
        extraFiles: [
          {
            from: 'assets',
            to: 'assets'
          }
        ]
      }
    });
    
    console.log('Build completed successfully!');
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

buildApp();