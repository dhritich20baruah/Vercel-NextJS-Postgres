import { Pool } from "pg";

export const pool = new Pool({
    connectionString: process.env.POSTGRES_URL + "?sslmode=require",
})

export default async function dbConnect(){
    await pool.connect((err,client, release)=>{
        if(err){
            return console.err("Error in connection", err.stack)
        }
        client.query("SELECT NOW()", (err, result)=>{
            release()
            if(err){
                return console.error("Error in query execution", err.stack)
            }
        })
    })
}