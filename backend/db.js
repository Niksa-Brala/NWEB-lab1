require('dotenv').config({ path: '.gitignore/.env' });
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  port: 5432,
  database: 'TicketGenerator',  
  password: 'uedCh3V6',
});

module.exports = pool;
