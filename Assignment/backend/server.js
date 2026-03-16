const express = require("express");
const {Pool} = require("pg"); 

const app = express(); 
app.use(express.json());

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  port: 5432
});

pool.query(`
CREATE TABLE IF NOT EXISTS users (
id SERIAL PRIMARY KEY,
name TEXT
);
`);

app.post("/users", async (req,res)=>{
  const {name} = req.body;
  await pool.query("INSERT INTO users(name) VALUES($1)",[name]);
  res.send("User added");
});

app.get("/users", async (req,res)=>{
  const result = await pool.query("SELECT * FROM users");
  res.json(result.rows);
});

app.get("/health",(req,res)=>{
  res.send("OK");
});

app.listen(3000, ()=> console.log("Server running"));