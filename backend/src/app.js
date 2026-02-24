const express = require('express')
const cookieParser = require('cookie-parser')
const adminRoutes = require('./routes/admin.routes')
const subjectRoutes = require('./routes/subject.routes')
const topicRoutes = require('./routes/Topic.routes')
const facultyRoutes = require('./routes/faculty.routes')
const questionRoutes = require('./routes/Question.routes')  
const StudentRoutes = require('./routes/Student.routes')
const cors = require('cors')

const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin:["http://localhost:5173"],
    credentials:true
}))

app.use('/api/admin',adminRoutes)
app.use('/api/subject',subjectRoutes)
app.use('/api/topic',topicRoutes)
app.use('/api/faculty',facultyRoutes)
app.use('/api/question',questionRoutes)
app.use('/api/student',StudentRoutes)

module.exports = app