const mongoose = require("mongoose");

const topicSchema = new mongoose.Schema(
  {
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "subject",
      unique: true,
      required: true
    },
    totalWeightage: {
      type: Number,
      default: 0
    },
    units: [
      {
        unitNo: { type: String, required: true },
        chapterName: { type: String, required: true },
        weightage: { type: Number, default: 0 }, 
        topics: [
          {
            name: { type: String, required: true }
          }
        ]
      }
    ]
  },
  { timestamps: true }
);

const topicModel = mongoose.model("Topic", topicSchema);

module.exports = topicModel