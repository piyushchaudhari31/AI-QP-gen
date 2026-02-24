const express = require('express');
const { createSubject, getSubjects, getSubjectBySem, uploadPdf, updateSubjectById, deleteSubjectById, getAllSemester } = require('../controllers/subject.controller');
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");


const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); 
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage });


router.post('/create', createSubject);
router.get('/getAllBook', getSubjects);
router.get('/getSubjectBySem/:id', getSubjectBySem);

router.post("/upload-pdf", upload.single("pdf"), uploadPdf);
router.put("/update-subject/:subjectId", updateSubjectById);

router.delete("/delete-subject/:subjectId", deleteSubjectById);

router.get('/getAllSemester',getAllSemester)

module.exports = router;