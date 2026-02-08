import { Pool } from '@neondatabase/serverless'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

export async function query(text: string, params?: any[]) {
  const client = await pool.connect()
  try {
    return await client.query(text, params)
  } finally {
    client.release()
  }
}

export async function getUser(username: string) {
  const result = await query('SELECT * FROM users WHERE username = $1', [
    username,
  ])
  return result.rows[0]
}

export async function createUser(username: string, passwordHash: string) {
  const result = await query(
    'INSERT INTO users (username, password_hash, status) VALUES ($1, $2, $3) RETURNING id, username, status',
    [username, passwordHash, 'pending']
  )
  return result.rows[0]
}

export async function getProducts() {
  const result = await query(
    'SELECT * FROM products ORDER BY name ASC'
  )
  return result.rows
}

export async function getProduct(id: number) {
  const result = await query('SELECT * FROM products WHERE id = $1', [id])
  return result.rows[0]
}

export async function updateProductStock(id: number, stock: number) {
  const result = await query(
    'UPDATE products SET stock = $1 WHERE id = $2 RETURNING *',
    [stock, id]
  )
  return result.rows[0]
}

export async function createBill(
  billNo: string,
  customerName: string,
  items: any[],
  totalAmount: number,
  billDiscount: number,
  amountPaid?: number,
  changeReturned?: number,
  customerReturnBalance?: number,
  enableReturnBalance?: boolean
) {
  // Get current date and time in local timezone
  const currentTime = new Date()
  const result = await query(
    'INSERT INTO bill_history (bill_no, customer_name, items, total_amount, bill_discount, amount_paid, change_returned, customer_return_balance, enable_return_balance, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
    [
      billNo,
      customerName,
      JSON.stringify(items),
      totalAmount,
      billDiscount,
      amountPaid || null,
      changeReturned || null,
      customerReturnBalance || 0,
      enableReturnBalance === true,
      currentTime
    ]
  )
  return result.rows[0]
}

export async function getBillHistory(limit: number = 50) {
  const result = await query(
    'SELECT * FROM bill_history ORDER BY created_at DESC LIMIT $1',
    [limit]
  )
  return result.rows
}

export async function getBillByNumber(billNo: string) {
  const result = await query(
    'SELECT * FROM bill_history WHERE bill_no = $1',
    [billNo]
  )
  return result.rows[0]
}

export async function getLastBillNumber() {
  const result = await query(
    'SELECT bill_no FROM bill_history ORDER BY created_at DESC LIMIT 1'
  )
  return result.rows[0]?.bill_no || null
}

export async function getAllUsers() {
  const result = await query(
    'SELECT id, username, status, created_at FROM users ORDER BY created_at DESC'
  )
  return result.rows
}

export async function updateUserStatus(userId: number, status: string) {
  const result = await query(
    'UPDATE users SET status = $1 WHERE id = $2 RETURNING id, username, status',
    [status, userId]
  )
  return result.rows[0]
}
