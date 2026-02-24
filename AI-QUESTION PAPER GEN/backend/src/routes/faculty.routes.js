const express = require('express')
const { getFacultyName, createQuestionBank, getSubject,deleteQuestion, getAllCountingDetail,getSubjectbyAdmin, getUnits ,getAllQuestion, facultySubject } = require('../controllers/Faculty.controller')
const authMiddleware = require('../middleware/auth.middleware')

const router = express.Router()

router.get('/getDetail',getFacultyName)

router.get('/getSubject/:semester',getSubject)
router.get('/getsubjectbyAdmin/:semester',authMiddleware,getSubjectbyAdmin)

router.post('/QuestionBank/:subjectId',authMiddleware, createQuestionBank)

router.get('/questionBank/question',getAllQuestion)

router.get('/getunits/:subjectId',authMiddleware,getUnits)
router.delete('/deleteQuestion/:id',deleteQuestion)


router.get('/getAllCount',authMiddleware,getAllCountingDetail)

router.get('/facultySubject',authMiddleware,facultySubject)

module.exports = router