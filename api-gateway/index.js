const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = 3030;

// --- Logs et CORS
app.use(morgan('dev'));
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.options('*', cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

// --- Proxy vers microservices
const services = [
    { route: '/auth', target: 'http://127.0.0.1:4002' },
    { route: '/catalogue', target: 'http://localhost:8001' },
    { route: '/sessions', target: 'http://localhost:8002' },
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
            }
        })
    );
});

app.listen(PORT, () => {
    console.log(`API Gateway running on http://localhost:${PORT}`);
});
