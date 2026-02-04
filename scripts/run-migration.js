const { Pool } = require('@neondatabase/serverless')
const fs = require('fs')
const path = require('path')

async function runMigration() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  })

  try {
    const sql = fs.readFileSync(
      path.join(__dirname, 'update-timestamp-timezone.sql'),
      'utf8'
    )

    console.log('Running migration...')
    console.log(sql)
    
    await pool.query(sql)
    
    console.log('✓ Migration completed successfully!')
  } catch (error) {
    console.error('Migration failed:', error.message)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

runMigration()
