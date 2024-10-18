const express = require('express');

const app = express();

app.use(express.json());

app.get('/hello', (req,res) => {
    res.send(`hello, ${req.query.person}!`);
});

app.listen(5000);
