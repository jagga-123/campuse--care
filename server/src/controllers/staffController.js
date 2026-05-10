import Complaint from '../models/Complaint.js';

export async function getAssignedComplaints(req, res, next) {
  try {
    const complaints = await Complaint.find({
      $or: [{ assignedTo: req.user._id }, { department: req.user.department }]
    })
      .sort({ priority: 1, createdAt: -1 })
      .populate('createdBy', 'name email role')
      .populate('assignedTo', 'name role department');

    res.json(complaints);
  } catch (error) {
    next(error);
  }
}

export async function resolveComplaint(req, res, next) {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    complaint.status = 'Resolved';
    await complaint.save();

    res.json({ message: 'Complaint resolved', complaint });
  } catch (error) {
    next(error);
  }
}
