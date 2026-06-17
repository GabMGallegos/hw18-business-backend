require('dotenv').config();

const express = require('express');
const cors = require('cors');
const vinylRoutes = require('./routes/vinylRoutes');

const app = express();

const port = process.env.PORT || 3010;
const host = process.env.HOST || '0.0.0.0';
const corsOrigin = process.env.CORS_ORIGIN || '*';

app.use(cors({ origin: corsOrigin }));
app.use(express.json());

app.use('/store', vinylRoutes);

app.use((req, res) => {
    res.status(404).json({
        message: 'Business endpoint not found'
    });
});

app.use((error, req, res, next) => {
    res.status(error.statusCode || 500).json({
        message: error.message || 'Internal business backend error'
    });
});

app.listen(port, host, () => {
    console.log(`Business backend running on http://${host}:${port}`);
});