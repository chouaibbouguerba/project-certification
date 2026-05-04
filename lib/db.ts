import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";
import { join } from "path";
import { promises as fs } from "fs";

declare global {
  var __sqliteDb: { db: Database<sqlite3.Database, sqlite3.Statement> | null } | undefined;
}

const databasePath = join(process.cwd(), "data", "projects.db");

let cached: { db: Database<sqlite3.Database, sqlite3.Statement> | null } = globalThis.__sqliteDb || {
  db: null
};

async function ensureDatabaseDirectory() {
  const directory = join(process.cwd(), "data");
  await fs.mkdir(directory, { recursive: true });
}

export async function getDatabase() {
  if (cached.db) {
    return cached.db;
  }

  await ensureDatabaseDirectory();

  const db = await open({
    filename: databasePath,
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      projectName TEXT NOT NULL,
      teamName TEXT NOT NULL,
      members TEXT NOT NULL,
      supervisor TEXT NOT NULL,
      email TEXT NOT NULL,
      createdAt TEXT NOT NULL
    );
  `);

  cached.db = db;
  globalThis.__sqliteDb = cached;

  return db;
}
