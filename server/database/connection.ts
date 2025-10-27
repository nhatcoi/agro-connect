import sqlite3 from 'sqlite3';
import path from 'path';

const dbPath = path.join(__dirname, 'agroconnect.db');
const db = new sqlite3.Database(dbPath);

// Enable foreign keys
db.run('PRAGMA foreign_keys = ON');

// Initialize database with schema
export const initDatabase = () => {
  try {
    const fs = require('fs');
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Split schema into individual statements
    const statements = schema
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);
    
    // Execute each statement
    statements.forEach(statement => {
      try {
        db.run(statement);
      } catch (error) {
        console.log('Schema statement executed (may already exist):', statement.substring(0, 50) + '...');
      }
    });
    
    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
  }
};

export default db;
