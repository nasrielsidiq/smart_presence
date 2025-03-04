// filepath: /home/muca/Codes/Express/Smart_Presence_API/src/db.js
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD);


const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
});


module.exports = pool;