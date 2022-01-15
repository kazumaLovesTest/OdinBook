const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new mongoose.Schema({
  name:{
    type:string,
    require:true,
    unique:true
  },
  username:{
    type:string,
    require:true,
    unique:true,
  },
  passwordHash:{
    type:string,
    require:true,
    unique:true
  }
})

userSchema.plugin(uniqueValidator)

userSchema.set('toJSON',{
  transform:(document,returnedObject) =>{
    returnedObject.id = returnedObject._id.toString()
    
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash
  }
})

module.exports = mongoose.model('User',userSchema)
