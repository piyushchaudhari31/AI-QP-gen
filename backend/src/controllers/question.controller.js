const adminModel = require("../model/admin.model");
const questionPaperModel = require("../model/QPModel");
const QuestionBankModel = require("../model/QuestionBank");
const subjectModel = require("../model/Subject.model");
const topicModel = require("../model/Topic.model");
const { model, buildPrompt } = require("../services/AI.service");
const generateQuestionPaperWord = require("../services/wordGenerator.service");
const mongoose = require("mongoose");

async function createOrUpdatePaper(req, res) {
  try {
    const { subjectId } = req.params;
    const { facultyName, examType, totalMarks, questions } = req.body;

    if (
      !subjectId ||
      !facultyName ||
      !examType ||
      !totalMarks ||
      !questions?.length
    ) {
      return res.status(400).json({ message: "All fields required" });
    }

    const faculty = await adminModel.findOne({
      fullname: facultyName,
      role: "faculty",
    });

    if (!faculty) {
      return res.status(404).json({ message: "Faculty not found" });
    }

    const subject = await subjectModel.findOne(
      { "subjects._id": subjectId },
      { semester: 1, "subjects.$": 1 },
    );

    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    let total = 0;
    for (let q of questions) {
      total += q.marks;
    }

    if (total !== totalMarks) {
      return res.status(400).json({
        message: `remaining marks ${totalMarks - total}`,
      });
    }

    const paper = await questionPaperModel.create({
      subjectId,
      facultyId: faculty._id,
      facultyName,
      examType,
      semester: subject.semester,
      totalMarks,
      questions,
    });

    res.status(201).json({
      message: "New Question Paper created",
      data: paper,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

function formatQuestionPaper(paper) {
  const sections = {};

  paper.questions.forEach((q) => {
    const marksKey = `Marks_${q.marks}`;

    if (!sections[marksKey]) {
      sections[marksKey] = {};
    }

    // SHORT / LONG / MCQ
    if (!sections[marksKey][q.questionType]) {
      sections[marksKey][q.questionType] = {};
    }

    // Unit grouping
    if (!sections[marksKey][q.questionType][`Unit_${q.unit}`]) {
      sections[marksKey][q.questionType][`Unit_${q.unit}`] = [];
    }

    sections[marksKey][q.questionType][`Unit_${q.unit}`].push(q.questionText);
  });

  return {
    subjectId: paper.subjectId,
    facultyName: paper.facultyName,
    examType: paper.examType,
    totalMarks: paper.totalMarks,
    semester: paper.semester,
    sections,
  };
}

async function getFormattedPaper(req, res) {
  try {
    const { paperId } = req.params;

    const paper = await questionPaperModel.findById(paperId);

    if (!paper) {
      return res.status(404).json({
        message: "Question paper not found",
      });
    }

    const formatted = formatQuestionPaper(paper);

    res.status(200).json({
      message: "Formatted Question Paper",
      data: formatted,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

function safeJsonParse(text) {
  try {
    if (!text) return null;

    // remove markdown blocks
    const cleaned = text
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    // extract JSON array only
    const match = cleaned.match(/\[[\s\S]*\]/);
    if (!match) return null;

    return JSON.parse(match[0]);
  } catch (err) {
    return null;
  }
}

async function generateAIPaper(req, res) {
  try {
    const { subjectId } = req.params;
    const { examType, totalMarks, pattern } = req.body;

    const facultyId = req.user.id;

    const marksMap = {
      MCQ: 1,
      SHORT: 2,
      MID_SHORT: 3,
      MID_LONG: 5,
      LONG: 6,
    };

    // ================= VALIDATE PATTERN MARKS =================
    let calculatedMarks = 0;

    for (const type in pattern) {
      if (!marksMap[type]) {
        return res.status(400).json({ message: `Invalid question type: ${type}` });
      }
      calculatedMarks += pattern[type] * marksMap[type];
    }

    if (calculatedMarks !== totalMarks) {
      return res.status(400).json({
        message: `Pattern total (${calculatedMarks}) does not match totalMarks (${totalMarks})`,
      });
    }

    // ================= GET SUBJECT =================
    const subject = await subjectModel.findOne(
      { "subjects._id": new mongoose.Types.ObjectId(subjectId) },
      { semester: 1, "subjects.$": 1 }
    );

    if (!subject || !subject.subjects?.length) {
      return res.status(404).json({ message: "Subject not found" });
    }

    // ================= GET TOPICS =================
    const topicDoc = await topicModel.findOne({
      subjectId: new mongoose.Types.ObjectId(subjectId),
    });

    let topics = [];

    if (topicDoc?.units?.length) {
      topics = topicDoc.units.flatMap(u =>
        u.topics.map(t => ({
          unit: u.unitNo,
          name: t.name,
        }))
      );
    }

    if (!topics.length) {
      topics.push({
        unit: 1,
        name: subject.subjects[0].name,
      });
    }

    let questions = [];
    let topicIndex = 0;

    // ================= STRICT PATTERN AI GENERATION =================
    for (const type in pattern) {

  const requiredCount = pattern[type];
  const marksPerQuestion = marksMap[type];

  let generatedCount = 0;
  let attempts = 0;
  const maxAttempts = requiredCount * 5; // safety limit

  while (generatedCount < requiredCount && attempts < maxAttempts) {

    attempts++;

    const topic = topics[topicIndex % topics.length];
    topicIndex++;

    const prompt = buildPrompt({
      subjectName: subject.subjects[0].name,
      topic: topic.name,
      type,
      count: 1,
    });

    const result = await model.generateContent(prompt);
    const aiQs = safeJsonParse(result.response.text());

    if (!aiQs || !Array.isArray(aiQs) || aiQs.length === 0) continue;

    const q = aiQs[0];

    if (!q.questionText) continue;

    // Duplicate check
    const alreadyExists = questions.some(
      existing =>
        existing.questionText.toLowerCase().trim() ===
        q.questionText.toLowerCase().trim()
    );

    if (alreadyExists) continue;

    questions.push({
      questionText: q.questionText.trim(),
      questionType: type,
      marks: marksPerQuestion,
      unit: topic.unit,
      options: q.options || [],
    });

    generatedCount++;
  }

  // If still not generated enough → throw error
  if (generatedCount < requiredCount) {
    return res.status(500).json({
      message: `Could not generate enough ${type} questions. Try again.`,
    });
  }
} 

    // ================= SAVE PAPER =================
    const paper = await questionPaperModel.create({
      _id: new mongoose.Types.ObjectId(),
      subjectId,
      facultyId,
      semester: subject.semester,
      examType,
      totalMarks,
      isUploaded: false,
      questions,
    });

    res.status(201).json({
      message: "Paper Generated Successfully",
      totalQuestions: questions.length,
      totalMarks,
      data: paper,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}



async function downloadWordPaper(req, res) {
  try {
    const { paperId } = req.params;

    const paper = await questionPaperModel.findById(paperId);
    if (!paper) {
      return res.status(404).json({ message: "Question paper not found" });
    }

    const filePath = await generateQuestionPaperWord(paper);

    res.download(filePath, "Question_Paper.docx");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function getQuestionPaper(req, res) {
  try {
    const facultyId = req.user.id;

    const papers = await questionPaperModel.aggregate([
      {
        $match: {
          facultyId: new mongoose.Types.ObjectId(facultyId),
        },
      },

      {
        $lookup: {
          from: "subjects",
          localField: "subjectId",
          foreignField: "subjects._id",
          as: "subjectData",
        },
      },

      { $unwind: "$subjectData" },

      {
        $addFields: {
          subjectName: {
            $arrayElemAt: [
              {
                $map: {
                  input: {
                    $filter: {
                      input: "$subjectData.subjects",
                      as: "sub",
                      cond: { $eq: ["$$sub._id", "$subjectId"] },
                    },
                  },
                  as: "s",
                  in: "$$s.name",
                },
              },
              0,
            ],
          },
        },
      },

      // ⭐ SUBJECTDATA REMOVE
      {
        $project: {
          subjectData: 0,
        },
      },

      { $sort: { createdAt: -1 } },
    ]);

    res.status(200).json({
      totalPapers: papers.length,
      papers,
    });

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
}


// GET raw paper for edit
async function getPaperForEdit(req, res) {
  try {
    const { paperId } = req.params;

    const paper = await questionPaperModel.findById(paperId);

    if (!paper) {
      return res.status(404).json({ message: "Paper not found" });
    }

    res.status(200).json({
      message: "Paper for edit",
      paper, // 👈 RAW DB paper
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

const recentQuestionPapers = async (req, res) => {
  try {
    const papers = await questionPaperModel.aggregate([
      { $sort: { createdAt: -1 } },
      { $limit: 5 },

      // 🧮 TOTAL MARKS CALCULATION
      {
        $addFields: {
          totalMarks: {
            $sum: "$questions.marks"
          }
        }
      },

      // 🔗 SUBJECT JOIN
      {
        $lookup: {
          from: "subjects",
          localField: "subjectId",
          foreignField: "subjects._id",
          as: "subjectDoc"
        }
      },
      { $unwind: "$subjectDoc" },

      {
        $addFields: {
          subject: {
            $first: {
              $filter: {
                input: "$subjectDoc.subjects",
                as: "s",
                cond: { $eq: ["$$s._id", "$subjectId"] }
              }
            }
          }
        }
      },

      // 🔗 FACULTY
      {
        $lookup: {
          from: "admins",
          localField: "facultyId",
          foreignField: "_id",
          as: "faculty"
        }
      },
      { $unwind: "$faculty" },

      // 📤 RESPONSE
      {
        $project: {
          subjectName: "$subject.name",
          subjectCode: "$subject.subjectCode",
          totalMarks: 1,
          "faculty.fullname": 1,
          createdAt: 1
        }
      }
    ]);

    res.status(200).json(papers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
async function AllQuestionPaper (req, res) {
  try {
    const papers = await questionPaperModel.aggregate([
      // faculty join
      {
        $lookup: {
          from: "admins",
          localField: "facultyId",
          foreignField: "_id",
          as: "faculty"
        }
      },
      { $unwind: "$faculty" },

      // subject join (subjects array ke andar)
      {
        $lookup: {
          from: "subjects",
          let: { subjectId: "$subjectId" },
          pipeline: [
            { $unwind: "$subjects" },
            {
              $match: {
                $expr: { $eq: ["$subjects._id", "$$subjectId"] }
              }
            }
          ],
          as: "subject"
        }
      },
      { $unwind: "$subject" },

      // final shape
      {
        $project: {
          subjectName: "$subject.subjects.name",
          facultyName: "$faculty.fullname",
          createdAt: 1,
          totalMarks: 1,
          questionsCount: { $size: "$questions" }
        }
      },

      { $sort: { createdAt: -1 } }
    ]);

    res.status(200).json(papers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


async function uploadGeneratedPaper(req, res) {
  try {

    const { paperId } = req.params;
    const facultyId = req.user.id;

    const paper = await questionPaperModel.findOneAndUpdate(
      {
        _id: paperId,
        facultyId   // 👈 SECURITY
      },
      {
        isUploaded: true
      },
      {
        new: true
      }
    );

    if (!paper) {
      return res.status(404).json({
        success: false,
        message: "Paper not found"
      });
    }

    res.json({
      success: true,
      message: "Paper Uploaded Successfully",
      data: paper
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
}

async function IsUploadGetQuestionPaper(req, res) {
  try {
    const data = await questionPaperModel.aggregate([
      { $match: { isUploaded: true } },

      {
        $lookup: {
          from: "subjects",
          let: { subId: { $toObjectId: "$subjectId" } },
          pipeline: [
            { $unwind: "$subjects" },
            {
              $match: {
                $expr: { $eq: ["$subjects._id", "$$subId"] }
              }
            },
            {
              $project: {
                _id: 0,
                subjectName: "$subjects.name"
              }
            }
          ],
          as: "subjectInfo"
        }
      },

      {
        $addFields: {
          subjectName: { $arrayElemAt: ["$subjectInfo.subjectName", 0] }
        }
      },

      {
        $project: {
          subjectInfo: 0
        }
      }
    ]);

    res.status(200).json({
      questionPaper: data || null
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}


 

module.exports = {
  createOrUpdatePaper,
  getFormattedPaper,
  generateAIPaper,
  downloadWordPaper,
  getQuestionPaper,
  getPaperForEdit,
  AllQuestionPaper,
  IsUploadGetQuestionPaper,
  recentQuestionPapers,
  uploadGeneratedPaper
};
