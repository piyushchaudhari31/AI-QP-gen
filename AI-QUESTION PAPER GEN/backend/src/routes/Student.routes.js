const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const { generateSubjectBasedTest, getaAllQuestionBank, getTestById, submitExam, studentCount } = require("../controllers/student.controller");

router.post("/generate-mcq", authMiddleware, generateSubjectBasedTest);

router.get('/getAllQuestionBank/:semester',getaAllQuestionBank)

router.get("/test/:id", authMiddleware,getTestById);

router.post('/submit/:id',authMiddleware,submitExam)

router.get('/studentCount',authMiddleware,studentCount)


module.exports = router;
