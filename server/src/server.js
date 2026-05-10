import 'dotenv/config';
import app from './app.js';
import connectDB from './config/db.js';

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ CampusCare API running on port ${PORT}`);
      console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
    });
  })
  .catch((error) => {
    console.warn('⚠️  DB connection issue, starting server in mock mode:', error.message);
    app.listen(PORT, () => {
      console.log(`✅ CampusCare API running on port ${PORT} (Mock Mode)`);
      console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
    });
  });
