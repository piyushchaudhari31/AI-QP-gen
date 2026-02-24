const mongoose = require('mongoose')

const adminSchema = new mongoose.Schema({
    fullname:{type:String},
    email:{type:String,unique:true},
    password:{type:String},
    role:{type:String,enum:['student','faculty','admin'] , default:'student'},
    image:{type:String,default:''}
},{timestamps:true})

const adminModel = mongoose.model("admin",adminSchema)

module.exports = adminModel