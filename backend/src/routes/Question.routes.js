const express = require('express');
const { createOrUpdatePaper, getFormattedPaper, generateAIPaper,AllQuestionPaper, downloadWordPaper, getQuestionPaper, getPaperForEdit, recentQuestionPapers, uploadGeneratedPaper, IsUploadGetQuestionPaper } = require('../controllers/question.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/paper/:subjectId',createOrUpdatePaper)

router.get('/paper/:paperId',getFormattedPaper)

router.post('/paper/ai/:subjectId',authMiddleware,generateAIPaper);

router.get("/paper/:paperId/download-word", downloadWordPaper);


router.get('/getQuestionPaper',authMiddleware,getQuestionPaper)


router.get('/paper/edit/:paperId',authMiddleware,getPaperForEdit)


router.get("/recent-papers", recentQuestionPapers);

router.get('/allQuestionPaper',AllQuestionPaper)


router.patch("/upload-paper/:paperId",authMiddleware,uploadGeneratedPaper);

router.get('/questionPaper/isupaloaded',IsUploadGetQuestionPaper)




module.exports = router; 