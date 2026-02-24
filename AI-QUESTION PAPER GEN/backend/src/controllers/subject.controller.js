const subjectModel = require("../model/Subject.model");

const fs = require("fs");

const pdfParse = require("pdf-parse");
const adminModel = require("../model/admin.model");

async function createSubject(req, res) {
  try {
    const { name, subjectCode, semester, facultyId } = req.body;

    if (!name || !subjectCode || !semester || !facultyId) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const faculty = await adminModel.findById(facultyId);

    if (!faculty || faculty.role !== "faculty") {
      return res.status(404).json({
        message: "Faculty not found",
      });
    }

    const subjectDoc = await subjectModel.findByIdAndUpdate(
      semester, // semester document _id
      {
        $push: {
          subjects: {
            name,
            subjectCode,
            faculty: faculty._id,
          },
        },
      },
      { new: true }
    );

    if (!subjectDoc) {
      return res.status(404).json({
        message: "Semester not found",
      });
    }

    res.status(200).json({
      message: "Subject added successfully",
      subjectDoc,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

async function getSubjects(req, res) {
  const subject = await subjectModel
    .find()
    .populate("subjects.faculty", "fullname email");
  res.status(200).json({
    subject
  });
}

async function getSubjectBySem(req, res) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: "Subject ID is required",
      });
    }

    const subject = await subjectModel
      .findById(id)
      .populate("subjects.faculty", "fullname email role");

    if (!subject) {
      return res.status(404).json({
        message: "Subject not found",
      });
    }

    res.status(200).json({
      message: "Subject fetched successfully",
      data: subject,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

async function updateSubjectById(req, res) {
  try {
    const { subjectId } = req.params;
    const { name, subjectCode, facultyId } = req.body;

    if (!subjectId) {
      return res.status(400).json({
        message: "Subject ID required",
      });
    }

    const updateQuery = {};

    if (name) updateQuery["subjects.$.name"] = name;
    if (subjectCode)
      updateQuery["subjects.$.subjectCode"] = subjectCode;

    if (facultyId) {
      const faculty = await adminModel.findById(facultyId);

      if (!faculty || faculty.role !== "faculty") {
        return res.status(404).json({
          message: "Faculty not found",
        });
      }

      updateQuery["subjects.$.faculty"] = faculty._id;
    }

    if (Object.keys(updateQuery).length === 0) {
      return res.status(400).json({
        message: "Nothing to update",
      });
    }

    const updated = await subjectModel
      .findOneAndUpdate(
        { "subjects._id": subjectId },
        { $set: updateQuery },
        { new: true }
      )
      .populate("subjects.faculty", "fullname email");

    if (!updated) {
      return res.status(404).json({
        message: "Subject not found",
      });
    }

    res.status(200).json({
      message: "Subject updated successfully",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}    


async function uploadPdf(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded." });
    }

    const pdfBuffer = fs.readFileSync(req.file.path);

    const data = await pdfParse(pdfBuffer);

    console.log("📄 PDF TEXT EXTRACTED");

    res.status(200).json({
      message: "PDF uploaded & parsed successfully",
      text: data.text,
    });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({
      // Improved error reporting
      message: `Error processing PDF: ${error.message}`,
    });
  }
}

async function deleteSubjectById(req, res) {
  try {
    const { subjectId } = req.params;

    if (!subjectId) {
      return res.status(400).json({
        message: "Subject ID required",
      });
    }

    const updated = await subjectModel.findOneAndUpdate(
      { "subjects._id": subjectId },
      {
        $pull: {
          subjects: { _id: subjectId },
        },
      },
      { new: true },
    );

    if (!updated) {
      return res.status(404).json({
        message: "Subject not found",
      });
    }

    res.status(200).json({
      message: "Subject deleted successfully",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

async function getAllSemester(req,res){
  const sem = await subjectModel.distinct("semester")

  res.status(200).json({
    sem
  })
} 
 
module.exports = {
  createSubject,
  uploadPdf,
  getSubjects,
  updateSubjectById,
  deleteSubjectById,
  getSubjectBySem,
  getAllSemester
};
