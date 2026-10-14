require('dotenv').config();
const { Pool } = require('pg');
console.log('DATABASE_URL carregada:', Boolean(process.env.DATABASE_URL));

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  family: 4,
});

// Testa a conexão ao iniciar
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Erro ao conectar ao Supabase:', err.message);
    if (err.errors) {
      console.error('Detalhes:', err.errors);
    }
  } else {
    console.log('✅ Conectado ao Supabase (PostgreSQL) com sucesso!');
    release();
  }
});

module.exports = pool;