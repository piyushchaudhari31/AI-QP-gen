const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true,
  },
  marks: Number,
  unit: String,
  questionType: {
    type: String,
    enum: ["MCQ", "SHORT", "MID_SHORT", "MID_LONG", "LONG"],
  },
  options: [String], // MCQ only
});
 
const questionPaperSchema = new mongoose.Schema(
  { 
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "subject",
      required: true,
    },
    facultyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "admin",
      required: true,
    },
    semester: String,
    examType: String,
    totalMarks: Number,
    isUploaded: {
      type: Boolean,
      default: false  
    },
    questions: [questionSchema],
  },
  { timestamps: true }
);

const questionPaper = mongoose.model("questionPaper", questionPaperSchema);

module.exports = questionPaper