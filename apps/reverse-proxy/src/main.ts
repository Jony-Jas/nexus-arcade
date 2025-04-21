const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Backend app proxy
app.use(
  '/api',
  createProxyMiddleware({
    target: 'http://localhost:3001',
    changeOrigin: true,
    secure: false,
    pathRewrite: { '^': '/api' },
  })
);

// Auth app proxy
app.use(
  '/auth',
  createProxyMiddleware({
    target: 'http://localhost:4202',
    changeOrigin: true,
    secure: false,
  })
);

// Handle root path requests - serve from games app
app.use(
  '/',
  createProxyMiddleware({
    target: 'http://localhost:4200',
    changeOrigin: true,
    secure: false,
  })
);

app.listen(3000, () => {
  console.log('Reverse proxy listening on port 3000');
});
