const express = require('express');
const { setRoutes } = require('./routes/index.js');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); 

setRoutes(app);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});