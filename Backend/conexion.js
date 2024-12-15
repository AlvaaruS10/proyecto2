import pkg from 'pg';
const { Pool } = pkg;
const db = new Pool ({
    host: 'localhost',
    user: 'postgres',
    password: 'Florinda..',
    database: 'likeme',
    port: 5432,
    allowExitOnIdle: true,
})
   
export default db;