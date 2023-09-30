import { Pool } from 'pg'
import { credentials } from './config'

const pool = new Pool(credentials)

export async function execute (query: string, params?): Promise<any> {
  const connection = await pool.connect()
  try {
    return connection.query(query, params)
  } catch (e) {
    console.log(e)
  } finally {
    connection.release()
  }
}
export async function createDatabase (): Promise<void> {
  const sql = 'CREATE TABLE IF NOT EXISTS  Persons( id SERIAL PRIMARY KEY,  username VARCHAR(255) NOT NULL UNIQUE ,email VARCHAR(255) NOT NULL UNIQUE, password VARCHAR(255) NOT NULL, firstname VARCHAR(255) NOT NULL,  lastname VARCHAR(255) NOT NULL);'
  await execute(sql)
}
createDatabase().then(() => {
  console.log('Persons table created')
})
