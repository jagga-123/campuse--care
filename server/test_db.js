import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

import Complaint from './src/models/Complaint.js';
import User from './src/models/User.js';
import Department from './src/models/Department.js';

async function test() {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI ||
      process.env.MONGO_URI ||
      'mongodb://127.0.0.1:27017/campuscare'
    );
    console.log('Connected to DB');

    console.log('Testing Admin Dashboard data...');
    const [openCount, resolvedCount, usersCount, departmentsCount, categoryBreakdown] = await Promise.all([
      Complaint.countDocuments({ status: { $in: ['Open', 'Assigned', 'In Progress'] } }),
      Complaint.countDocuments({ status: 'Resolved' }),
      User.countDocuments(),
      Department.countDocuments(),
      Complaint.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ])
    ]);
    console.log({ openCount, resolvedCount, usersCount, departmentsCount, categoryBreakdown });

    console.log('Testing Heatmap data...');
    const heatmap = await Complaint.find({ latitude: { $ne: null }, longitude: { $ne: null } })
      .select('latitude longitude title priority status category');
    console.log(`Heatmap returned ${heatmap.length} records`);

    mongoose.disconnect();
    console.log('Done');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

test();
