import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    category: {
      type: String,
      default: 'General'
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium'
    },
    status: {
      type: String,
      enum: ['Open', 'Assigned', 'In Progress', 'Resolved', 'Closed'],
      default: 'Open'
    },
    location: {
      type: String,
      default: ''
    },
    latitude: {
      type: Number,
      default: null
    },
    longitude: {
      type: Number,
      default: null
    },
    emergency: {
      type: Boolean,
      default: false
    },
    nearbyIssue: {
      type: Boolean,
      default: false
    },
    department: {
      type: String,
      default: 'General'
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    comments: [
      {
        author: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        },
        message: String,
        createdAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    aiSuggestion: {
      type: String,
      default: ''
    },
    imageUrl: {
      type: String,
      default: ''
    },
    resolutionNote: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

const Complaint = mongoose.model('Complaint', complaintSchema);

export default Complaint;
