const mongoose = require('mongoose');

const UserModel = new mongoose.model({
  name:{
    type:String,
    required:true,
    trim:true,
    minlength:[3,"Name must be at least 3 characters"],
    maxlength:[20,"Name must be at most 20 characters"],
  },
  email:{
    type:String,
    required:true,
    unique:true,
    trim:true,
    lowercase:true,
  },
  password:{
    type:String,
    required:true,
    trim:true,
    minlength:[6,"Password must be at least 6 characters"],
    maxlength:[20,"Password must be at most 20 characters"],
  },
  role:{
    type:String,
    enum:["admin", "player"],
    default:"player"
  },
  avatar: {
    type: String,
    default:"",
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt:{
    type:Date,
    default:Date.now
  },
  updatedAt:{
    type:Date,
    default:Date.now
  },
},{
  timestamps:true,
  versionKey:false
})

const User = mongoose.model('User', UserModel)

module.exports = User