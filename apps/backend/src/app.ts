import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import noteRoutes from './routes/notes';
import aiRoutes from './routes/ai';

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({ message: 'Backend API is running!' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.use('/api/notes', noteRoutes);
app.use('/api/ai', aiRoutes);

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});


app.use('/{*any}', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

export default app;