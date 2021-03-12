const express = require('express');
let app = express();

app.use(express.static("./assets"));

app.get("/api/*", (req, res) => {
    let action = req.path.replace('/api/', '');
    switch (action) {
        case "": {
            res.json({ error: false, status: "OK" })
        }

        default: {
            res.json({error: true, message: "Invalid endpoint"})
        }
    }
})

module.exports = () => {
    app.listen(3090);
}