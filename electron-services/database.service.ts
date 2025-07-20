import * as sqlite3 from 'sqlite3';
import * as path from 'path';

export class DatabaseService {
  private sqliteDb: sqlite3.Database;

  constructor() {
    // Initialize SQLite database
    const dbPath = path.join(process.cwd(), 'local-data.db');
    this.sqliteDb = new sqlite3.Database(dbPath);
    this.initializeSQLite();
  }

  private initializeSQLite() {
    // Create tables if they don't exist
    this.sqliteDb.run(`
      CREATE TABLE IF NOT EXISTS local_cache (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        key TEXT UNIQUE,
        value TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }

  // SQLite methods
  saveToLocal(key: string, value: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.sqliteDb.run(
        'INSERT OR REPLACE INTO local_cache (key, value) VALUES (?, ?)',
        [key, JSON.stringify(value)],
        function(err) {
          if (err) reject(err);
          else resolve({ lastID: this.lastID, changes: this.changes });
        }
      );
    });
  }

  getFromLocal(key: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.sqliteDb.get(
        'SELECT value FROM local_cache WHERE key = ?',
        [key],
        (err, row: any) => {
          if (err) reject(err);
          else resolve(row ? JSON.parse(row.value) : null);
        }
      );
    });
  }

  getAllFromLocal(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.sqliteDb.all(
        'SELECT * FROM local_cache',
        [],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
  }

  deleteFromLocal(key: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.sqliteDb.run(
        'DELETE FROM local_cache WHERE key = ?',
        [key],
        function(err) {
          if (err) reject(err);
          else resolve({ changes: this.changes });
        }
      );
    });
  }
}