import postgresql from 'pg';

const {Pool} = postgresql;

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME
});

pool.on('connect', ()=>{
    console.log('Database connected');
});

pool.on('error',(err)=>{
    console.error('Database error:', err);
    process.exit(-1);
});

export const query = (text, params) => pool.query(text, params);
