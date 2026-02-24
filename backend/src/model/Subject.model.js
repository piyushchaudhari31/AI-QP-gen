const mongoose = require("mongoose");

const subjectSchema =new mongoose.Schema(
  {
    semester: { type: String, unique: true },
    subjects: [
      {
        name: { type: String, required: true },
        subjectCode: { type: String, required: true },

        faculty: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "admin",
          required: true
        }
      }
    ]
  },
  { timestamps: true }
);
const subjectModel = mongoose.model("subject", subjectSchema);
module.exports = subjectModel