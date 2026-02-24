const mongoose = require('mongoose')

function connectToDb(){
    mongoose.connect(process.env.MONGO_URI).then(()=>{console.log("✅ Connected Successfully")}).catch(()=>{console.log("❌ error")})
}

module.exports = connectToDb
