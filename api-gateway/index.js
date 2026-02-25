const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = 3030;

// --- Logs et CORS
app.use(morgan('dev'));
app.use(cors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// local development
// app.use(cors({
//     origin: 'http://localhost:5173',
//     credentials: true
// }));

app.options('*', cors({
    origin: 'http://jgsw0c0ggggwsg4ss000skgc.72.62.179.60.sslip.io',
    credentials: true
}));

// --- Proxy vers microservices
const services = [
    { route: '/auth', target: process.env.AUTH_URL || 'http://127.0.0.1:4002' },
    { route: '/movies', target: process.env.CATALOG_URL || 'http://127.0.0.1:4001' },
    { route: '/sessions', target: process.env.BOOKING_URL || 'http://127.0.0.1:4003' },
    { route: '/payments', target: process.env.PAYMENT_URL || 'http://127.0.0.1:4004' },
];

services.forEach(({ route, target }) => {
    app.use(
        route,
        createProxyMiddleware({
            target,
            changeOrigin: true,
            secure: false,
            onProxyReq: (proxyReq, req) => {
                if (req.headers.cookie) {
                    proxyReq.setHeader('cookie', req.headers.cookie);
                }
                if (req.headers.authorization) {
                    proxyReq.setHeader('Authorization', req.headers.authorization);
                }
            }
        })
    );
});

app.listen(PORT, () => {
    console.log(`API Gateway running on http://localhost:${PORT}`);
});
