import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { apiRouter } from './src/server/presentation/controllers.js';
import { seedDatabase } from './src/db/seed.js';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Initialize Cloud SQL Seed Data if needed
  try {
    await seedDatabase();
  } catch (seedErr) {
    console.error('Failed to seed Cloud SQL database:', seedErr);
  }

  // JSON Body Parser
  app.use(express.json());

  // API Router FIRST
  app.use('/api/v1', apiRouter);

  // Catch unhandled /api requests and return 404 JSON instead of falling through to Vite HTML
  app.use('/api', (req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      message: `API endpoint '${req.originalUrl}' not found.`,
      meta: { timestamp: new Date().toISOString() },
    });
  });

  // Global Error Handler Middleware
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error('💥 Server Global Exception Handled:', err);
    res.status(err.status || 500).json({
      success: false,
      message: err.message || 'Internal Server Error',
      errors: [err.toString()],
      meta: { timestamp: new Date().toISOString() },
    });
  });

  // Vite Middleware for Development / Static Fallback for Production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Enterprise ERP Engine listening at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
