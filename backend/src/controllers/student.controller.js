
const QuestionBankModel = require("../model/QuestionBank");
const AItest = require("../model/Student.model");
const subjectModel = require("../model/Subject.model");
const topicModel = require("../model/Topic.model");
const { model, buildPrompt } = require("../services/AI.service");

const generateSubjectBasedTest = async (req, res) => {

  try { 

    const studentId = req.user._id;
    const { subjectName, count } = req.body;

    const prompt = buildPrompt({
      subjectName,
      type: "MCQ",
      count: count + 5   // 🔥 Extra generate karwao
    });

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    let cleanData = response
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let aiQuestions = JSON.parse(cleanData);

    // 🔥 REMOVE DUPLICATES
    const uniqueMap = new Map();

    aiQuestions.forEach(q => {
      const key = q.questionText.trim().toLowerCase();

      if (!uniqueMap.has(key)) {
        uniqueMap.set(key, q);
      }
    });

    const uniqueQuestions = Array.from(uniqueMap.values())
      .slice(0, count);  // only required count

    if (uniqueQuestions.length < count) {
      return res.status(400).json({
        success:false,
        message:"AI generated duplicate questions. Try again!"
      });
    }

    const savedTest = await AItest.create({
      studentId,
      subjectName,
      testTitle: subjectName + " AI Test",
      questions: uniqueQuestions,
      totalMarks: uniqueQuestions.length
    });

    res.json({
      success:true,
      testId:savedTest._id,
      questions:savedTest.questions
    });

  } catch (err) {

    res.status(500).json({
      success:false,
      error:err.message
    });
  }
};

async function getaAllQuestionBank(req, res) {
  try {

    const semester = req.params.semester;

    let filter = {};

    if (semester && semester !== "0") {
      filter.semester = Number(semester);
    }

    let questionBanks = await QuestionBankModel.find(filter).lean();

    for (let qb of questionBanks) {

      const topicData = await topicModel.findOne({
        subjectId: qb.subjectId
      }).lean();

      if (topicData) {
        qb.units = qb.units.map(u => {

          const foundUnit = topicData.units.find(
            t => t.unitNo === u.unitNo
          );

          return {
            ...u,
            unitName: foundUnit?.chapterName || `Unit ${u.unitNo}`
          };
        });
      }

    }

    res.json({
      success: true,
      total: questionBanks.length,
      data: questionBanks
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false });
  }
}

async function getTestById(req, res){
  try {

    const test = await AItest.findById(req.params.id);

    if (!test) {
      return res.status(404).json({ success:false });
    }

     if (test.attempted) {
      return res.status(403).json({
        success: false,
        message: "Already attempted"
      });
    }

    if (test.studentId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false });
    }


    res.json({
      success:true,
      data:test
    });

  } catch (err) {
    res.status(500).json({ success:false });
  }
};

async function submitExam(req,res){
  try{

   const test = await AItest.findById(req.params.id);

   if(!test || test.attempted){
     return res.status(400).json({ message:"Already submitted" });
   }

   let score = 0;

   test.questions.forEach(q=>{
     if(req.body.answers[q._id] === q.correctAnswer){
       score += q.marks;
     }
   });

   test.score = score;
   test.attempted = true;
   test.submittedAt = new Date();

   await test.save();

   res.json({
     success:true,
     score,
     total:test.totalMarks
   });

 }catch(err){
   res.status(500).json({error:err.message});
 }

};

async function studentCount(req,res){
  try{

    const studentId = req.user._id;

    const data = await AItest.aggregate([

      {
        $match:{
          studentId:studentId,
          attempted:true
        }
      },

      {
        $group:{
          _id:null,
          totalAttempted:{$sum:1},
          highestScore:{$max:"$score"},
          totalMarks:{$max:"$totalMarks"}
        }
      }

    ]);

    res.json({
      success:true,
      totalAttempted:data[0]?.totalAttempted || 0,
      highestScore:data[0]?.highestScore || 0,
      totalMarks:data[0]?.totalMarks || 0
    });

  }catch(err){
    res.status(500).json({error:err.message});
  }


}





module.exports = {getTestById, generateSubjectBasedTest,studentCount ,submitExam, getaAllQuestionBank};


