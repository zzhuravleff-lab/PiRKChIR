import 'dotenv/config'; 
import { Pool } from 'pg'; 

if (!process.env.SESSION_SECRET) {
  throw new Error('SESSION_SECRET не задан в .env');
}
  
const pool = new Pool({ 
  host: process.env.DB_HOST, 
  port: Number(process.env.DB_PORT), 
  database: process.env.DB_NAME, 
  user: process.env.DB_USER, 
  password: process.env.DB_PASSWORD, 
}); 
  
export default pool;