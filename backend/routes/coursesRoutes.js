const express = require("express");
const Course = require("../models/courses");
const router = express.Router();

// ✅ Create a new course
router.post("/", async (req, res) => {
  try {
    const {
      courseNumber,
      courseName,
      description,
      term,
      year,
      department,
      instructor,
      credits,
      startDate,
      endDate
    } = req.body;

    const newCourse = new Course({
      courseNumber,
      courseName,
      description,
      term,
      year,
      school: {
        name: "Kwame Nkrumah University of Science and Technology (KNUST)",
        code: "KNUST"
      },
      department,
      instructor,
      credits,
      startDate,
      endDate
    });

    await newCourse.save();
    res.status(201).json(newCourse);
  } catch (error) {
    res.status(500).json({ 
      message: "Error creating course",
      error: error.message 
    });
  }
});

// ✅ Get all courses for an instructor
router.get("/instructor/:instructorId", async (req, res) => {
  try {
    const courses = await Course.find({ 
      instructor: req.params.instructorId 
    }).sort({ startDate: -1 }); // Newest first
    
    res.json(courses);
  } catch (error) {
    res.status(500).json({ 
      message: "Error fetching courses",
      error: error.message 
    });
  }
});

// ✅ Get a single course by ID
router.get("/:courseId", async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId)
      .populate('instructor', 'name email') // Include instructor details
      .populate('students', 'name email'); // Include student details
    
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    
    res.json(course);
  } catch (error) {
    res.status(500).json({ 
      message: "Error fetching course",
      error: error.message 
    });
  }
});

// Get courses with entry codes
router.get('/with-entry-codes', async (req, res) => {
  try {
    const courses = await Course.find({
      $or: [
        { entryCode: { $exists: true, $ne: null } },
        { isPublic: true }
      ]
    }).populate('instructor', 'name');
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Enroll with entry code
router.post('/:courseNumber/enroll', async (req, res) => {
  try {
    const { courseNumber } = req.params;
    const { studentId, entryCode } = req.body;
    
    const course = await Course.findById(courseNumber);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Check if entry code is required and matches
    if (course.entryCode && course.entryCode !== entryCode) {
      return res.status(400).json({ message: 'Invalid entry code' });
    }
    
    // Check if already enrolled
    if (course.students.includes(studentId)) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }
    
    // Add student to course
    course.students.push(studentId);
    await course.save();
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ Update a course
router.put("/:courseId", async (req, res) => {
  try {
    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.courseId,
      req.body,
      { new: true, runValidators: true } // Return updated doc and validate
    );
    
    if (!updatedCourse) {
      return res.status(404).json({ message: "Course not found" });
    }
    
    res.json(updatedCourse);
  } catch (error) {
    res.status(500).json({ 
      message: "Error updating course",
      error: error.message 
    });
  }
});

// ✅ Delete a course
router.delete("/:courseId", async (req, res) => {
  try {
    const deletedCourse = await Course.findByIdAndDelete(req.params.courseId);
    
    if (!deletedCourse) {
      return res.status(404).json({ message: "Course not found" });
    }
    
    res.json({ message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ 
      message: "Error deleting course",
      error: error.message 
    });
  }
});

// ✅ Get courses by department
router.get("/department/:department", async (req, res) => {
  try {
    const courses = await Course.find({ 
      department: req.params.department,
      isActive: true 
    }).sort({ courseNumber: 1 });
    
    res.json(courses);
  } catch (error) {
    res.status(500).json({ 
      message: "Error fetching courses by department",
      error: error.message 
    });
  }
});

module.exports = router;