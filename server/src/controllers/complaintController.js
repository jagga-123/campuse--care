import Complaint from '../models/Complaint.js';
import { buildAiSuggestion } from '../utils/ai.js';

export async function createComplaint(req, res, next) {
  try {
    const suggestion = buildAiSuggestion(req.body);

    const complaint = await Complaint.create({
      title: req.body.title,
      description: req.body.description,
      location: req.body.location || '',
      latitude: req.body.latitude ? parseFloat(req.body.latitude) : null,
      longitude: req.body.longitude ? parseFloat(req.body.longitude) : null,
      imageUrl: req.file ? `/uploads/${req.file.filename}` : '',
      emergency: req.body.emergency === 'true' || Boolean(req.body.emergency),
      nearbyIssue: req.body.nearbyIssue === 'true' || Boolean(req.body.nearbyIssue),
      createdBy: req.user._id,
      category: suggestion.category,
      department: suggestion.department,
      priority: suggestion.priority,
      aiSuggestion: suggestion.summary
    });

    const populated = await complaint.populate(['createdBy', 'assignedTo']);
    res.status(201).json(populated);
  } catch (error) {
    next(error);
  }
}

export async function getMyComplaints(req, res, next) {
  try {
    const complaints = await Complaint.find({ createdBy: req.user._id })
      .sort({ createdAt: -1 })
      .populate('assignedTo', 'name role department');

    res.json(complaints);
  } catch (error) {
    next(error);
  }
}

export async function getAllComplaints(req, res, next) {
  try {
    const complaints = await Complaint.find()
      .sort({ createdAt: -1 })
      .populate('createdBy', 'name email role')
      .populate('assignedTo', 'name role department');

    res.json(complaints);
  } catch (error) {
    next(error);
  }
}

export async function getComplaintById(req, res, next) {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('createdBy', 'name email role')
      .populate('assignedTo', 'name role department');

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    res.json(complaint);
  } catch (error) {
    next(error);
  }
}

export async function updateComplaintStatus(req, res, next) {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    complaint.status = req.body.status || complaint.status;
    if (req.body.assignedTo) {
      complaint.assignedTo = req.body.assignedTo;
    }
    if (req.body.resolutionNote) {
      complaint.resolutionNote = req.body.resolutionNote;
    }

    await complaint.save();
    const updated = await complaint.populate(['createdBy', 'assignedTo']);
    res.json(updated);
  } catch (error) {
    next(error);
  }
}

export async function addComplaintComment(req, res, next) {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    complaint.comments.push({
      author: req.user._id,
      message: req.body.message
    });

    await complaint.save();
    res.status(201).json(complaint);
  } catch (error) {
    next(error);
  }
}
