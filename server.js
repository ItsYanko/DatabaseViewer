const express = require('express');
const mysql = require("mysql2/promise");

let app = express();
let db = mysql.createPool({
    host: "remotemysql.com",
    user: "T0SgpA4OYx",
    password: "TzsndCTnvI",
    database: "T0SgpA4OYx",
    waitForConnections: true
})

app.use(express.static("./assets"));

app.get("/api/*", async (req, res) => {
    let action = req.path.replace('/api/', '');
    switch (action) {
        case "": {
            res.json({ error: false, status: "OK" })
            break;
        }

        case "list": { // List all tables
            try {
                let [DBres] = await db.query("SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE'");
                res.json({ error: false, data: DBres.map(t => t.TABLE_NAME) });
            } catch (e) {
                res.json({ error: true, message: "Error on query" })
            }
            break;
        }

        case "info": { // Info about table (fields and total entries)
            let [fields] = await db.query(`SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = '${req.query.table}' ORDER BY ORDINAL_POSITION`)
            let [count] = await db.query(`SELECT COUNT(*) FROM \`${req.query.table}\``)
            res.json({ error: false, fields: fields.map(c => c.COLUMN_NAME), count: count[0]["COUNT(*)"] });
            break;
        }

        case "data": {
            let [data] = await db.query(`SELECT * FROM \`${req.query.table}\` LIMIT 1 OFFSET ${req.query.index};`);
            res.json({ error: false, data: Object.values(data[0]) });
            break;
        }

        default: {
            res.json({ error: true, message: "Invalid endpoint" })
            break;
        }
    }
})

module.exports = () => {
    app.listen(3090);
}