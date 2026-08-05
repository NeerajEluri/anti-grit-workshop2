import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import authRoutes from '../server/routes/auth.routes';
import farmRoutes from '../server/routes/farms.routes';
import advisoryRoutes from '../server/routes/advisory.routes';
import diagnosisRoutes from '../server/routes/diagnosis.routes';
import chatRoutes from '../server/routes/chat.routes';
import weatherRoutes from '../server/routes/weather.routes';
import marketRoutes from '../server/routes/market.routes';
import adminRoutes from '../server/routes/admin.routes';
import { errorHandler } from '../server/middleware/errorHandler';

dotenv.config();

const app = express();

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'OK', app: 'AgriAdvisor AI Vercel Serverless Backend', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/farms', farmRoutes);
app.use('/api/advisory', advisoryRoutes);
app.use('/api/diagnosis', diagnosisRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/market', marketRoutes);
app.use('/api/admin', adminRoutes);

app.use(errorHandler);

export default app;
