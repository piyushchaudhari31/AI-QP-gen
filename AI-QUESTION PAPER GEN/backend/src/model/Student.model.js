const mongoose = require("mongoose");

const aiQuestionSchema = new mongoose.Schema({

  questionText: String,

  options: [String],

  correctAnswer: String,

  marks: {
    type: Number,
    default: 1
  }

}, { _id: true });


const aiTestSchema = new mongoose.Schema({

  facultyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "admin"
  },

  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "admin"
  },

  subjectName: String,
  topic: String,
  testTitle: String,

  questions: [aiQuestionSchema],

  totalMarks: Number,

  attempted: {
    type: Boolean,
    default: false
  },

  score: {                 
    type: Number,
    default: 0
  },

  submittedAt: {          // 🔥 ADD
    type: Date
  }

}, { timestamps: true });

module.exports = mongoose.model("AITest", aiTestSchema);
