const express = require('express');
require('dotenv').config();
const port = 5000;

app.express();
app.use(express.json());

app.listen('port', () => console.log(`Server running on port: ${port}`));
