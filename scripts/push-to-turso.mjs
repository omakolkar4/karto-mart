/**
 * push-to-turso.mjs
 * Reads the local SQLite db/custom.db and migrates schema + data to Turso.
 * Run: node scripts/push-to-turso.mjs
 */

import { createClient } from '@libsql/client';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import Database from 'better-sqlite3';

const require = createRequire(import.meta.url);
const __dirname = dirname(fileURLToPath(import.meta.url));

const TURSO_URL = process.env.TURSO_DATABASE_URL;
const TURSO_TOKEN = process.env.TURSO_AUTH_TOKEN;

if (!TURSO_URL || !TURSO_TOKEN) {
  console.error('❌ Missing TURSO_DATABASE_URL or TURSO_AUTH_TOKEN env vars');
  process.exit(1);
}

const localDbPath = join(__dirname, '..', 'db', 'custom.db');

console.log('📂 Opening local SQLite DB:', localDbPath);
const local = new Database(localDbPath, { readonly: true });

const turso = createClient({ url: TURSO_URL, authToken: TURSO_TOKEN });

async function run() {
  console.log('🚀 Connecting to Turso:', TURSO_URL);

  // 1. Get the schema (CREATE TABLE statements) from local DB
  const tables = local.prepare(
    `SELECT name, sql FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE '_prisma_%' ORDER BY name`
  ).all();

  console.log(`\n📋 Found ${tables.length} tables: ${tables.map(t => t.name).join(', ')}`);

  // 2. Drop + recreate each table in Turso
  for (const { name, sql } of tables) {
    if (!sql) continue;
    console.log(`  ⬇ Dropping ${name} if exists...`);
    await turso.execute(`DROP TABLE IF EXISTS "${name}"`);
  }

  // Create in reverse-dependency order (children first for drops, parents first for creates)
  // Order: User, Product, Address, Order, OrderItem, ContactMessage, WishlistItem, CartItem
  const ordered = [
    'User', 'Product', 'Address', 'Order', 'OrderItem',
    'ContactMessage', 'WishlistItem', 'CartItem'
  ];

  for (const name of ordered) {
    const t = tables.find(t => t.name === name);
    if (!t || !t.sql) { console.log(`  ⚠ Skipping ${name} (not found locally)`); continue; }
    console.log(`  ✚ Creating ${name}...`);
    await turso.execute(t.sql);
  }

  // Also create any _prisma_ tables (migrations tracking)
  const prismaTables = local.prepare(
    `SELECT name, sql FROM sqlite_master WHERE type='table' AND name LIKE '_prisma_%'`
  ).all();
  for (const { name, sql } of prismaTables) {
    if (!sql) continue;
    await turso.execute(`DROP TABLE IF EXISTS "${name}"`);
    await turso.execute(sql);
  }

  // 3. Migrate data table by table
  for (const name of ordered) {
    const rows = local.prepare(`SELECT * FROM "${name}"`).all();
    if (rows.length === 0) { console.log(`  • ${name}: empty, skipping`); continue; }

    console.log(`  📤 Inserting ${rows.length} rows into ${name}...`);
    const cols = Object.keys(rows[0]);
    const placeholders = cols.map(() => '?').join(', ');
    const insertSql = `INSERT OR REPLACE INTO "${name}" (${cols.map(c => `"${c}"`).join(', ')}) VALUES (${placeholders})`;

    // Batch in chunks of 50
    const chunkSize = 50;
    for (let i = 0; i < rows.length; i += chunkSize) {
      const chunk = rows.slice(i, i + chunkSize);
      const batch = chunk.map(row => ({
        sql: insertSql,
        args: cols.map(c => {
          const v = row[c];
          if (v === null || v === undefined) return null;
          return typeof v === 'boolean' ? (v ? 1 : 0) : v;
        }),
      }));
      await turso.batch(batch, 'write');
    }
    console.log(`    ✓ Done`);
  }

  // 4. Verify
  const userCount = (await turso.execute('SELECT COUNT(*) as c FROM User')).rows[0].c;
  const productCount = (await turso.execute('SELECT COUNT(*) as c FROM Product')).rows[0].c;
  console.log(`\n✅ Migration complete!`);
  console.log(`   Users: ${userCount} | Products: ${productCount}`);

  local.close();
}

run().catch(e => {
  console.error('❌ Migration failed:', e);
  local.close();
  process.exit(1);
});
