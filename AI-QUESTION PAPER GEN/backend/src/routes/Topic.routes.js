const express = require('express')
const { createTopic, getAllUnit, getUnitByTopic, addUnitWeightage, updateUnitWeightage, deleteTopicById, getsubjectTopics, updateTopicById, updateUnitById } = require('../controllers/Topic.controller')

const router = express.Router()

router.post("/create/:subjectId",createTopic)
router.get('/getUnitTopic/:id',getUnitByTopic)
router.post('/add-weightage/:subjectId',addUnitWeightage)

router.put("/update-weightage/:unitId", updateUnitWeightage);

router.delete("/delete-topic/:topicId", deleteTopicById);
router.get("/subject-topics/:subjectId",getsubjectTopics)

router.put("/update-topic/:topicId", updateTopicById);

router.put('/update/Unit',updateUnitById)



module.exports = router