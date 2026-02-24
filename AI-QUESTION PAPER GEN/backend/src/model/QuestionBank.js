const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
  },
  { _id: true }
);

const unitSchema = new mongoose.Schema({
  unitNo: {
    type: String,
    required: true,
    trim: true,
  },
  questions: [questionSchema],
});

const questionBankSchema = new mongoose.Schema(
  {
    facultyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "admin",
      required: true,
    },

    semester: {
      type: Number,
      required: true,
    },

    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref:"subject",
      required: true,
    },

    subjectName: {
      type: String,
      required: true,
    },

    units: [unitSchema],
  },
  { timestamps: true }
);

/* ⭐ UNIQUE INDEX */
questionBankSchema.index(
  { facultyId: 1, semester: 1, subjectId: 1 },
  { unique: true }
);

const QuestionBankModel = mongoose.model("QuestionBank", questionBankSchema);

module.exports = QuestionBankModel