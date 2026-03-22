import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:[true,"Username must be required"],
        unique:[true,"Username must be unique"]
    },
    email:{
        type:String,
        required:[true,"Email must be required"],
        unique:[true,"Email must be unique"]
    },
    password:{
        type:String,
        required:[true,"Password must be required"]
    },
    verified:{
        type:Boolean,
        default:false
    }
})

const userModel=mongoose.model("user",userSchema)

export default userModel