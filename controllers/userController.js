import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import vaildator from 'validator';
import userModel from "../models/userModel.js";

// for login of user
const createToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET);
}

const loginUser = async (req,res) => {
    const {email, password} = req.body;
    try{
        const user = await userModel.findOne({email})

        if(!user){
            return res.json({success:false,message: "User does not exist"})
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch){
            return res.json({success:false,message: "Invalid credentials"})
        }

        const token = createToken(user._id)
        res.json({success:true,token})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }

} 




// for registration of user

const registerUser = async (req,res) =>{
    const {name,email,password} = req.body;
    try {
        const exists = await userModel.findOne({email});
        if (exists) {
           return res.json({success:false,message:"user already exits"})
        }

        // checking email format and strong password
        if (!vaildator.isEmail(email)) {
            return res.json({success:false,message:"please enter valid email"})
        }
        if(password.length<8){
            return res.json({success:false,message:"please enter strong paswword<8 "})
    
        }
        // incrypting pasword 
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        const newUser = new userModel({
            name:name,
            email:email,
            password:hashedPassword
        })

       const user = await newUser.save();
       const token =createToken(user._id);
       res.json({success:true,token})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"error"})
    }
}

export { loginUser, registerUser };