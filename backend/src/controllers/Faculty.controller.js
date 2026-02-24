const adminModel = require("../model/admin.model");
const questionPaper = require("../model/QPModel");
const QuestionBankModel = require("../model/QuestionBank");
const subjectModel = require("../model/Subject.model");
const topicModel = require("../model/Topic.model");
const mongoose = require("mongoose");

async function getFacultyName(req, res) {
  try {
    const faculties = await adminModel.find(
      { role: "faculty" },
      { fullname: 1, email: 1 },
    );

    if (faculties.length === 0) {
      return res.status(404).json({
        message: "No faculty found",
      });
    }

    const result = await Promise.all(
      faculties.map(async (faculty) => {
        const subjects = await subjectModel.find(
          { "subjects.faculty": faculty._id },
          { semester: 1, subjects: 1 },
        );

        const filteredSubjects = subjects.flatMap((doc) =>
          doc.subjects
            .filter(
              (sub) =>
                sub.faculty &&
                sub.faculty.toString() === faculty._id.toString(),
            )
            .map((sub) => ({
              subjectName: sub.name,
              subjectCode: sub.subjectCode,
              semester: doc.semester,
            })),
        );

        return {
          facultyId: faculty._id,
          facultyName: faculty.fullname,
          email: faculty.email,
          subjects: filteredSubjects,
        };
      }),
    );

    res.status(200).json({
      message: "Faculty with subjects fetched successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

async function createQuestionBank(req, res) {
  try {
    const { subjectId } = req.params;
    let { semester, unitNo, questions } = req.body;

    const facultyId = req.user.id;

    if (!unitNo || !questions?.length) {
      return res.status(400).json({
        message: "Unit number and questions required",
      });
    }

    unitNo = String(unitNo).trim();

    /* ===== FIND SUBJECT FROM SUBJECT MODEL ===== */
    const subjectDoc = await subjectModel.findOne({
      "subjects._id": subjectId,
    });

    if (!subjectDoc) {
      return res.status(404).json({
        message: "Subject not found",
      });
    }

    const subject = subjectDoc.subjects.find(
      (s) => s._id.toString() === subjectId,
    );

    /* ===== FORMAT QUESTIONS ===== */
    const formattedQuestions = questions.map((q) => ({
      text: q,
    }));

    /* ===== FIND QUESTION BANK ===== */
    let questionBank = await QuestionBankModel.findOne({
      facultyId,
      semester,
      subjectId,
    });

    /* ===== CREATE NEW DOCUMENT IF NOT EXIST ===== */
    if (!questionBank) {
      questionBank = await QuestionBankModel.create({
        facultyId,
        semester,
        subjectId,
        subjectName: subject.name,
        units: [],
      });
    }

    /* ===== FIND UNIT ===== */
    const unit = questionBank.units.find((u) => u.unitNo === unitNo);

    if (unit) {
      // 👉 add questions to existing unit
      unit.questions.push(...formattedQuestions);
    } else {
      // 👉 create new unit
      questionBank.units.push({
        unitNo,
        questions: formattedQuestions,
      });
    }

    await questionBank.save();

    res.status(200).json({
      message: "Questions added successfully",
      data: questionBank,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message,
    });
  }
}

async function getSubject(req, res) {
  try {
    const { semester } = req.params;

    const data = await QuestionBankModel.find({ semester }).populate(
      "facultyId",
      "fullname email",
    );

    if (!data || data.length === 0) {
      return res.status(404).json({
        message: "No data found for this semester",
      });
    }

    res.status(200).json({
      message: "Semester data fetched successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

async function getSubjectbyAdmin(req, res) {
  try {
    const { semester } = req.params;
    const facultyId = req.user._id;

    const data = await subjectModel.findOne(
      { semester },
      { semester: 1, subjects: 1 },
    );

    if (!data) {
      return res.status(404).json({
        message: "No subjects found for this semester",
      });
    }

    /* ✅ SUBJECT ID ADD HERE */
    const filteredSubjects = data.subjects
      .filter(
        (sub) => sub.faculty && sub.faculty.toString() === facultyId.toString(),
      )
      .map((sub) => ({
        subjectId: sub._id, // ⭐ IMPORTANT FIX
        name: sub.name,
        subjectCode: sub.subjectCode,
      }));

    res.status(200).json({
      semester: data.semester,
      subjects: filteredSubjects,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

async function getAllQuestion(req, res) {
  const questions = await QuestionBankModel.find();

  res.status(200).json({
    questions,
  });
}

async function getUnits(req, res) {
  const { subjectId } = req.params;

  const units = await topicModel.findOne({ subjectId });

  res.status(200).json({
    units,
  });
}

async function deleteQuestion(req, res) {
  try {
    const { id } = req.params;

    const questionId = new mongoose.Types.ObjectId(id);

    const result = await QuestionBankModel.updateMany(
      {},
      {
        $pull: {
          "units.$[].questions": { _id: questionId },
        },
      },
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({
        message: "Question not found",
      });
    }

    res.status(200).json({
      message: "Question deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
    });
  }
}

async function getAllCountingDetail(req, res) {
  try {
    const facultyId = req.user._id;

    /* ========= QUESTION COUNT ========= */
    const questionData = await QuestionBankModel.find({ facultyId });

    let totalQuestions = 0;

    questionData.forEach((doc) => {
      doc.units.forEach((unit) => {
        totalQuestions += unit.questions.length;
      });
    });

    const totalQuestionPapers = await questionPaper.countDocuments({
      facultyId: facultyId,
    });

    /* ========= SUBJECT COUNT ========= */
    const subjectDocs = await subjectModel.find({
      "subjects.faculty": facultyId,
    });

    let totalSubjects = 0;

    subjectDocs.forEach((doc) => {
      doc.subjects.forEach((sub) => {
        if (String(sub.faculty) === String(facultyId)) {
          totalSubjects++;
        }
      });
    });

    /* ========= RESPONSE ========= */
    res.status(200).json({
      totalQuestions,
      totalSubjects,
      totalQuestionPapers
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

async function facultySubject(req, res) {
  try {
    const facultyId = req.user.id; // auth middleware se

    const subjects = await subjectModel.find(
      {
        "subjects.faculty": new mongoose.Types.ObjectId(facultyId),
      },
      {
        semester: 1,
        "subjects.$": 1,
      },
    );

    res.status(200).json({
      success: true,
      data: subjects,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
}

module.exports = {
  getFacultyName,
  createQuestionBank,
  getSubject,
  getSubjectbyAdmin,
  getAllQuestion,
  getUnits,
  deleteQuestion,
  getAllCountingDetail,
  facultySubject,
};
