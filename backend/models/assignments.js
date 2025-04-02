const mongoose = require("mongoose");

const AssignmentSchema = new mongoose.Schema(
  {
    // Core assignment details
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true
    },
    instructorId: {
      type: String,
      ref: "User",
      required: true
    },

    // Dates and scheduling
    dueDate: {
      type: Date,
      required: true
    },
    published: {
      type: Boolean,
      default: false
    },
    publishDate: {
      type: Date,
      default: null // Set when published
    },

    // Submission settings
    submissionType: {
      type: String,
      enum: ["text", "file", "both"],
      default: "file"
    },
    allowedFileTypes: [{
      type: String,
      enum: ["pdf", "doc", "docx", "ppt", "pptx", "xls", "xlsx", "jpg", "png", "zip"]
    }],
    maxFileSizeMB: {
      type: Number,
      default: 10
    },

    // Grading settings
    totalPoints: {
      type: Number,
      required: true,
      min: 1
    },
    enableAiGrading: {
      type: Boolean,
      default: true
    },
    enablePlagiarismCheck: {
      type: Boolean,
      default: true
    },

    // Questions and content
    questions: [{
      question: { type: String, required: true }, 
      points: {
        type: Number,
        required: true,
        min: 0
      },
      modelAnswer: String,
      attachments: [String] // URLs to files
    }],

    // Rubric
    rubric: [{
      title: {
        type: String,
        required: true
      },
      description: String,
      points: {
        type: Number,
        required: true,
        min: 0
      },
      criteria: [{
        description: {
          type: String,
          required: true
        },
        points: {
          type: Number,
          required: true,
          min: 0
        }
      }]
    }],

    // Files and attachments
    attachments: [{
      originalName: String,
      storagePath: String, // Firebase Storage path
      downloadUrl: String,
      size: Number, // in bytes
      uploadedAt: {
        type: Date,
        default: Date.now
      }
    }],

    // Student submissions tracking
    submissions: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Submission"
    }],
    submissionCount: {
      type: Number,
      default: 0
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for due date status
AssignmentSchema.virtual("status").get(function() {
  if (!this.published) return "draft";
  if (new Date() < this.dueDate) return "active";
  return "closed";
});

// Indexes for faster queries
AssignmentSchema.index({ courseId: 1 });
AssignmentSchema.index({ instructorId: 1 });
AssignmentSchema.index({ dueDate: 1 });
AssignmentSchema.index({ status: 1 });

module.exports = mongoose.model("Assignment", AssignmentSchema);