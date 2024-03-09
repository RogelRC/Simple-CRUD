import pkg from 'pg';
const { Pool } = pkg;
import "dotenv/config"

export const pool = new Pool({
    allowExitOnIdle: true,
});

try{
    await pool.query("SELECT NOW()");
    console.log("Database connected");
}
catch(error){
    console.log(error);
}