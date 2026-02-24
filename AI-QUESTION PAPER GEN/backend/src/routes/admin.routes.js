const express = require('express')
const { loginAdmin, registerAdmin,logOutAdmin, allstudentDetail,AllUsers ,allteacherDetail, upadateUserRole, deleteUser, allDetail, updateUser, addSemester} = require('../controllers/admin.controller')

const multer = require('multer')
const router = express.Router()

const upload = multer({storage:multer.memoryStorage()})



router.post('/login',loginAdmin)
router.post('/register',registerAdmin)
router.post('/logOut',logOutAdmin)

router.get('/allstudent',allstudentDetail)
router.get('/allteachers',allteacherDetail)

router.get('/allUsers',AllUsers)

router.put('/:id',upadateUserRole)

router.delete('/:id',deleteUser)

router.get('/allDetail',allDetail)

router.put('/updateUser/:id',upload.single('image'),updateUser)

router.post('/addSem',addSemester)



module.exports = router 