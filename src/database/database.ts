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
export async function createDatabases (): Promise<void> {
  const sql1 = 'CREATE TABLE IF NOT EXISTS  Persons( id SERIAL PRIMARY KEY,  username VARCHAR(255) NOT NULL UNIQUE ,email VARCHAR(255) NOT NULL UNIQUE,salt VARCHAR(255), passhash VARCHAR(255) NOT NULL, firstname VARCHAR(255) NOT NULL,  lastname VARCHAR(255) NOT NULL);'
  await execute(sql1)
  const sql2 = 'CREATE TABLE IF NOT EXISTS Sessions (id SERIAL PRIMARY KEY, userid int NOT NULL UNIQUE, sessionid VARCHAR(255),created_at TIMESTAMP NOT NULL DEFAULT NOW(),updated_at TIMESTAMP NOT NULL DEFAULT NOW(),FOREIGN KEY (userid) REFERENCES Persons(id))'
  await execute(sql2)
  const sql3 = `CREATE OR REPLACE FUNCTION trigger_set_timestamp()
          RETURNS TRIGGER AS $$
          BEGIN
            NEW.updated_at = NOW();
            RETURN NEW;
          END;
          $$ LANGUAGE plpgsql;`
  await execute(sql3)
  const sql4 = `CREATE TRIGGER set_timestamp
              BEFORE UPDATE ON Sessions
              FOR EACH ROW
              EXECUTE PROCEDURE trigger_set_timestamp();`
  await execute(sql4)
}
createDatabases().then(() => {
  console.log('Database created')
})
