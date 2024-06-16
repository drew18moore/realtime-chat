import postgres from "postgres";

require('dotenv').config();

const env = process.env.DATABASE_URL
const sql = postgres(env as string);

export default sql;