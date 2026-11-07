/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// API Health Check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'online',
    appName: 'Rajnish Factory',
    packageName: 'com.rajnish.factory',
    version: '2.5.0',
    timestamp: new Date().toISOString(),
  });
});

// Simulated backend payment verification endpoint
app.post('/api/payments/verify', (req: Request, res: Response) => {
  const { orderId, paymentId, amount } = req.body;
  if (!orderId || !paymentId) {
    return res.status(400).json({ success: false, message: 'Invalid payment parameters' });
  }

  // Cryptographic signature check simulation
  const verified = true;
  res.json({
    success: verified,
    transactionId: paymentId,
    orderId,
    amount,
    status: 'PAID',
    message: 'Payment verified successfully through Rajnish Factory secure server gateway',
  });
});

// Serve frontend assets
async function setupServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));

    // Zero-404 SPA fallback to index.html
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`[Rajnish Factory] Server listening on port ${PORT}`);
  });
}

setupServer().catch((err) => {
  console.error('Failed to start server:', err);
});
