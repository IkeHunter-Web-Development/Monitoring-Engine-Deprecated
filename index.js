const express = require('express');
const cron = require('node-cron');

const app = express();

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});


