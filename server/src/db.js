import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();
const pool = new Pool({
    host: 'db',
    port: 5432,
    user: process.env.POSTGRES_USER,
    database: 'fred-tracker',
    password: process.env.POSTGRES_PASSWORD
});

export default pool;