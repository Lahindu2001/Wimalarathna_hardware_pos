const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') })
const { Pool } = require('@neondatabase/serverless')
const fs = require('fs')

async function runMigration() {
  const connectionString = process.env.DATABASE_URL

  if (!connectionString) {
    console.error('DATABASE_URL environment variable is not set')
    process.exit(1)
  }

  const pool = new Pool({ connectionString })

  try {
    console.log('Running migration: add-reorder-level.sql')
    
    const sqlFile = path.join(__dirname, 'add-reorder-level.sql')
    const sql = fs.readFileSync(sqlFile, 'utf8')
    
    await pool.query(sql)
    
    console.log('✓ Migration completed successfully!')
    console.log('Added column: reorder_level to products table (default: 50)')
  } catch (error) {
    console.error('Migration failed:', error)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

runMigration()
