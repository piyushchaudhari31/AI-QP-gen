const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const adminModel = require("../model/admin.model");
const subjectModel = require("../model/Subject.model");
const questionPaperModel = require("../model/QPModel");
const uploadImage = require("../services/Imagekit.service");

async function registerAdmin(req, res) {
  try {
    const { email, password, fullname ,role="student"} = req.body;

    const isAlreadyExist = await adminModel.findOne({ email });
    if (isAlreadyExist) {
      return res.status(404).json({
        message: "User is Already Exist",
      });
    }

    const user = await adminModel.create({
      email,
      password: await bcrypt.hash(password, 10),
      fullname,
      role
    });

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        fullName: user.fullname,
        
      },
      process.env.JWT_SECRET
    );

    res.cookie("token", token);

    res.status(200).json({
      message: "User Created Successfully",
      user,
    });
  } catch (error) {
    return res.json({
      message: error.message,
    });
  }
}
async function loginAdmin(req, res) {
  try {
    const { email, password } = req.body;

    const isEmail = await adminModel.findOne({ email });
    if (!isEmail) {
      return res.status(400).json({
        message: "Invalid Email",
      });
    }

    const isPassword = await bcrypt.compare(password, isEmail.password);

    if (!isPassword) {
      return res.status(400).json({
        message: "Invalid Password",
      });
    }

    const token = jwt.sign({ id: isEmail._id }, process.env.JWT_SECRET);
    res.cookie("token", token);

    res.status(200).json({
      message: "Login Successfully",
      token,
      user: {
        _id: isEmail._id,
        image: isEmail.image,
        fullname: isEmail.fullname,
        email: isEmail.email,
        role: isEmail.role,
        password: isEmail.password,
      },
    });
  } catch (error) {
    console.log(error.message);
  }
}


async function logOutAdmin(req, res) {
  res.clearCookie("token");

  res.status(200).json({
    message: "Log Out Successfully",
  });
}

async function allteacherDetail(req,res) {

  try {

    const user = await adminModel.find({role:"faculty"})
    res.status(200).json({
      message:"All User Details Fetched Successfully",
      user
    })    
  } catch (error) {
    res.status(500).json({
      message:error.message
    })
  }
  
}

async function allstudentDetail(req,res) {

  try { 
    const user = await adminModel.find({role:"student"})
    res.status(200).json({
      message:"All User Details Fetched Successfully",
      user
    })    
  } catch (error) {
    res.status(500).json({
      message:error.message
    })
  }   
}


async function upadateUserRole(req,res) {

  try {
    const {id} = req.params;

    const user = await adminModel.findById(id);

    if(!user){
      return res.status(404).json({
        message:"User Not Found"
      })
    }

    user.role = "faculty";
    await user.save();

    res.status(200).json({
      message:"Created Teacher Successfully",
      user
    })    
  } catch (error) {
    res.status(500).json({
      message:error.message
    })
  }

}    

async function deleteUser(req,res) {

  try {
    const {id} = req.params;
    const user = await adminModel.findByIdAndDelete(id);

    if(!user){
      return res.status(404).json({
        message:"User Not Found"
      })
    }
    res.status(200).json({
      message:"User Deleted Successfully",
    })    
  } catch (error) {
    res.status(500).json({
      message:error.message
    })
  }
}

async function allDetail(req,res) {

  try {

    const student = await adminModel.find({role:"student"});
    const teacher = await adminModel.find({role:"faculty"});
    const result = await subjectModel.aggregate([
      { $unwind: "$subjects" },
      { $count: "totalSubjects" }
    ]);
    const subjects = result.length > 0 ? result[0].totalSubjects : 0;

    const paper = await questionPaperModel.find();

    let papercount = paper.length;
    let facultycount = teacher.length;
    let studentcount = student.length;
    let subjectcount = subjects; 

    res.status(200).json({  
      papercount,
      facultycount,
      studentcount,
      subjectcount
    })
        
  }
  catch (error) {
    res.status(500).json({
      message:error.message 
    })
  }


}

async function AllUsers(req,res) {

  const users = await adminModel.find();

  res.status(200).json({
    message:"All Users Fetched Successfully",
    users
  })

}

async function updateUser(req, res) {
  try {
    const { id } = req.params;
    const { fullname, email } = req.body;

    const user = await adminModel.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }

    const updateData = {};

    if (fullname) updateData.fullname = fullname;
    if (email) updateData.email = email;
    

    if (req.file) {
      const imageBuffer = req.file.buffer.toString("base64");

      const uploadResponse = await uploadImage(
        imageBuffer,
        `profile_${user._id}`
      );

      updateData.image = uploadResponse.url;
    }

    const updatedUser = await adminModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );

    res.status(200).json({
      message: "Profile Updated Successfully",
      updatedUser,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}

async function addSemester(req,res){

  try {
    
    const {semester} = req.body

    const existSem = await subjectModel.findOne({semester})
    if(existSem){
      return res.status(400).json({
        message:"Already Exist"
      })
    }

    const newSem = await subjectModel.create({
      semester
    })

    res.status(201).json({
      message:"Semester is created"
    })


  } catch (error) {
    console.log(error.message);
    
    
  }

}



module.exports = {
  logOutAdmin,
  loginAdmin,
  registerAdmin,
  addSemester,
  allteacherDetail,
  allstudentDetail,
  upadateUserRole,
  deleteUser,
  allDetail,
  AllUsers,
  updateUser
  
};
