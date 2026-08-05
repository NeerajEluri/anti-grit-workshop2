import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import farmRoutes from './routes/farms.routes';
import advisoryRoutes from './routes/advisory.routes';
import diagnosisRoutes from './routes/diagnosis.routes';
import chatRoutes from './routes/chat.routes';
import weatherRoutes from './routes/weather.routes';
import marketRoutes from './routes/market.routes';
import adminRoutes from './routes/admin.routes';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Parsing Middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'OK', app: 'AgriAdvisor AI Backend', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/farms', farmRoutes);
app.use('/api/advisory', advisoryRoutes);
app.use('/api/diagnosis', diagnosisRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/market', marketRoutes);
app.use('/api/admin', adminRoutes);

// Global Error Handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🌱 AgriAdvisor AI Backend Server running on port ${PORT}`);
  console.log(`====================================================`);
});
