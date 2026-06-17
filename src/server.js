require('dotenv').config();

const express = require('express');
const cors = require('cors');
const computerstoreRoutes = require('./routes/computerstoreRoutes');

const app = express();
const port = process.env.PORT || 3010;
const host = process.env.HOST || '0.0.0.0';
const corsOrigin = process.env.CORS_ORIGIN || '*';

app.use(cors({ origin: corsOrigin }));
app.use(express.json());

app.get('/health', (req, res) => {
    res.json({
        service: 'hw18-business-backend',
        status: 'running'
    });
});

app.use('/computerstore', computerstoreRoutes);

app.use((req, res) => {
    res.status(404).json({ message: 'Business endpoint not found' });
});

app.use((error, req, res, next) => {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
        message: error.message || 'Internal business backend error'
    });
});

app.listen(port, host, () => {
    console.log(`Business backend running on http://${host}:${port}`);
});
