const { default: mongoose } = require("mongoose");
const topicModel = require("../model/Topic.model");


async function createTopic(req, res) {
  try {
    const { unit, chapterName, topics } = req.body;
    const { subjectId } = req.params;

    if (!subjectId || !unit || !chapterName || !topics || !topics.length) {
      return res.status(400).json({ message: "All fields required" });
    }

    let data = await topicModel.findOneAndUpdate(
      { subjectId, "units.unitNo": unit },
      {
        $push: {
          "units.$.topics": { $each: topics }
        }
      },
      { new: true }
    );

    if (!data) {
      data = await topicModel.findOneAndUpdate(
        { subjectId },
        {
          $push: {
            units: {
              unitNo: unit,
              chapterName,
              topics
            }
          }
        },
        { new: true, upsert: true }
      );
    }

    res.status(200).json({
      message: "Topics added successfully",
      data
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getUnitByTopic(req,res){

  const {id} = req.params
  
  
  const data = await topicModel.findOne(
    { "units._id": id },
    { "units.$": 1 } 
    );

    if (!data) {
      return res.status(404).json({ message: "Unit not found" });
    }

  res.status(200).json({
    message:"Fetch SUccessfully",
    unit: data.units[0]

  })
}

async function addUnitWeightage(req, res) {
  try {
    const { unitNo, weightage } = req.body;
    const { subjectId } = req.params;

    if (!subjectId || !unitNo || weightage == null) {
      return res.status(400).json({ message: "All fields required" });
    }

    const data = await topicModel.findOne({ subjectId });

    if (!data) {
      return res.status(404).json({ message: "Subject topics not found" });
    }

    const unitIndex = data.units.findIndex(u => u.unitNo === unitNo);

    if (unitIndex === -1) {
      return res.status(404).json({ message: "Unit not found" });
    }

    // 🔁 overwrite allowed but unit ek hi baar
    const oldWeightage = data.units[unitIndex].weightage || 0;

    data.units[unitIndex].weightage = weightage;

    // 🔥 totalWeightage auto update
    data.totalWeightage =
      data.totalWeightage - oldWeightage + weightage;

    await data.save();

    res.status(200).json({
      message: "Unit weightage added successfully",
      data
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function updateUnitWeightage(req, res) {
  try {
    const { unitId } = req.params;
    const { weightage } = req.body;

    if (!unitId || weightage == null) {
      return res.status(400).json({ message: "All fields required" });
    }

    const data = await topicModel.findOneAndUpdate(
      { "units._id": unitId },
      {
        $set: { "units.$.weightage": weightage }
      },
      { new: true }
    );

    if (!data) {
      return res.status(404).json({ message: "Unit not found" });
    }

    data.totalWeightage = data.units.reduce(
      (sum, u) => sum + (u.weightage || 0),
      0
    );

    await data.save();

    res.status(200).json({
      message: "Unit weightage updated successfully",
      data
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function deleteTopicById(req, res) {
  try {
    const { topicId } = req.params;

    if (!topicId) {
      return res.status(400).json({ message: "Topic ID required" });
    }

    const data = await topicModel.findOneAndUpdate(
      { "units.topics._id": topicId },
      {
        $pull: {
          "units.$[].topics": { _id: topicId }
        }
      },
      { new: true }
    );

    if (!data) {
      return res.status(404).json({ message: "Topic not found" });
    }

    res.status(200).json({
      message: "Topic deleted successfully",
      data
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getsubjectTopics(req,res){
  try {
    const {subjectId} = req.params; 
    if(!subjectId){
      return res.status(400).json({message:"Subject ID required"})
    }
    const data = await topicModel.findOne({subjectId});
    // 👇 404 MAT bhejo — empty data bhejo
    if (!data) {
      return res.status(200).json({
        message: "No topics yet",
        data: {
          subjectId,
          units: [],
          totalWeightage: 0
        }
      });
    }
    res.status(200).json({
      message:"Topics fetched successfully",
      data
    })
  }
  catch (error) {
    res.status(500).json({message:error.message})
  }
}

async function updateTopicById(req, res) {
  try {
    const { topicId } = req.params;
    const { chapterName, topicName } = req.body;

    if (!mongoose.Types.ObjectId.isValid(topicId)) {
      return res.status(400).json({ message: "Invalid Topic ID" });
    }

    const updated = await topicModel.updateOne(
  { "units.topics._id": topicId },
  {
    $set: {
      "units.$[].topics.$[topic].name": topicName,
      updatedAt: new Date()
    }
  },
  {
    arrayFilters: [
      { "topic._id": new mongoose.Types.ObjectId(topicId) }
    ]
  }
);

    if (updated.modifiedCount === 0) {
      return res.status(404).json({ message: "Topic not found" });
    }

    res.status(200).json({
      message: "Chapter & Topic updated successfully",
      updated
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
}

async function updateUnitById(req, res) {
  try {

    const { unitId, unitNo, chapterName, topics } = req.body;

    const doc = await topicModel.findOne({
      "units._id": unitId
    });

    if (!doc) {
      return res.status(404).json({ message: "Unit not found" });
    }

    const unit = doc.units.id(unitId);

    // ✅ update unit number
    if (unitNo) unit.unitNo = unitNo;

    // ✅ update chapter name
    if (chapterName) unit.chapterName = chapterName;

    // ✅ update topics
    if (topics && Array.isArray(topics)) {

      topics.forEach((t) => {

        // 🔁 existing topic update
        if (t._id) {
          const existingTopic = unit.topics.id(t._id);
          if (existingTopic) {
            existingTopic.name = t.name;
          }
        }

        // ➕ new topic add
        else {
          unit.topics.push({
            name: t.name
          });
        }

      });

    }

    await doc.save();

    res.status(200).json({
      success: true,
      message: "Unit Updated Successfully",
      data: doc
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error"
    });

  }
}

module.exports = {updateUnitById,createTopic,getUnitByTopic ,addUnitWeightage ,updateUnitWeightage,deleteTopicById,getsubjectTopics,updateTopicById}