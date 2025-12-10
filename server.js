const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, '/')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/ourapi', (req, res) => {
    res.json({ status: "Active", version: "4.0.0", region: "US-East" });
});

app.use((req, res) => {
    res.status(404).redirect('/');
});

app.listen(port, () => {
    console.log(`BatProx Server running on port ${port}`);
});
