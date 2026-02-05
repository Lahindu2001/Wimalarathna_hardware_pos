// Script to run the master products migration
import { query } from '../lib/db.js'
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

async function runMasterProductsMigration() {
  try {
    console.log('Starting master products migration...')
    
    const sqlPath = join(__dirname, 'add-master-products.sql')
    const sql = readFileSync(sqlPath, 'utf8')
    
    await query(sql)
    
    // Get product count
    const result = await query('SELECT COUNT(*) as count FROM products')
    const count = result.rows[0].count
    
    console.log('✅ Master products migration completed successfully!')
    console.log(`📦 Total products in database: ${count}`)
    
    // Get products by category sample
    console.log('\n📊 Sample products added:')
    const samples = await query(`
      SELECT name, price, stock 
      FROM products 
      WHERE name LIKE 'Hammer%' OR name LIKE 'Nail%' OR name LIKE 'PVC Pipe%'
      ORDER BY name 
      LIMIT 10
    `)
    
    samples.rows.forEach(product => {
      console.log(`   - ${product.name}: Rs.${product.price} (Stock: ${product.stock})`)
    })
    
  } catch (error) {
    console.error('❌ Error running migration:', error)
    throw error
  }
}

runMasterProductsMigration()
  .then(() => {
    console.log('\n✅ Migration completed!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Migration failed:', error)
    process.exit(1)
  })
