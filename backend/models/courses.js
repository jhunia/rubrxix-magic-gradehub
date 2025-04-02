const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema(
  {
    courseNumber: {
      type: String,
      required: true,
      trim: true,
      uppercase: true, // Store as uppercase (e.g., "CS501")
      match: [/^[A-Z0-9]{2,10}$/, 'Please enter a valid course code'] // Example: "CS501", "MATH202"
    },
    courseName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500
    },
    term: {
      type: String,
      required: true,
      enum: ["Spring", "Summer", "Fall", "Winter"],
      default: "Spring"
    },
    year: {
      type: Number,
      required: true,
      min: 2000,
      max: 2100
    },
    school: {
      name: {
        type: String,
        default: "Kwame Nkrumah University of Science and Technology (KNUST)"
      },
      code: {
        type: String,
        default: "KNUST"
      }
    },
    department: {
      type: String,
      required: true,
      enum: [
        "Computer Science", "Mathematics", "Economics", 
        "Engineering", "Physics", "Chemistry",
        "Business", "Arts", "Medicine"
      ]
    },
    entryCode: {
      type: String,
      unique: true,
      uppercase: true,
      minlength: 6,
      maxlength: 8
    },
    instructor: {
      type: String,
      ref: "User",
      required: true
    },
    students: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }],
    assignments: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment"
    }],
    credits: {
      type: Number,
      required: true,
      min: 1,
      max: 6,
      default: 3
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true,
      validate: {
        validator: function(value) {
          return value > this.startDate; // End date must be after start date
        },
        message: 'End date must be after start date'
      }
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true } 
  }
);

// Generate entry code automatically if not provided
CourseSchema.pre('save', function(next) {
  if (!this.entryCode) {
    this.entryCode = generateEntryCode(); // Implement your code generator
  }
  next();
});

// Indexes for better query performance
CourseSchema.index({ instructor: 1 });
CourseSchema.index({ department: 1 });
CourseSchema.index({ 'school.code': 1 });
CourseSchema.index({ isActive: 1 });

// Virtual for course duration in weeks
CourseSchema.virtual('durationWeeks').get(function() {
  const diffInMs = this.endDate - this.startDate;
  return Math.ceil(diffInMs / (1000 * 60 * 60 * 24 * 7));
});

// Helper function to generate entry code
function generateEntryCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Exclude confusing characters
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

module.exports = mongoose.model("Course", CourseSchema);