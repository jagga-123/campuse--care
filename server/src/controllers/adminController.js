import Complaint from '../models/Complaint.js';
import User from '../models/User.js';
import Department from '../models/Department.js';

export async function getAdminDashboard(_req, res, next) {
  try {
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

    res.json({
      openCount,
      resolvedCount,
      usersCount,
      departmentsCount,
      categoryBreakdown
    });
  } catch (error) {
    next(error);
  }
}

export async function listUsers(_req, res, next) {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    next(error);
  }
}

export async function listDepartments(_req, res, next) {
  try {
    const departments = await Department.find().sort({ createdAt: -1 });
    res.json(departments);
  } catch (error) {
    next(error);
  }
}

export async function getHeatmapData(_req, res, next) {
  try {
    const complaints = await Complaint.find({ latitude: { $ne: null }, longitude: { $ne: null } })
      .select('latitude longitude title priority status category');
    res.json(complaints);
  } catch (error) {
    next(error);
  }
}
