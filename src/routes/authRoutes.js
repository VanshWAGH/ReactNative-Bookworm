import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

const router = express.Router();

const generateToken = (userId) =>{
    return jwt.sign({userId}, process.env.JWT_SECRET, { expiresIn: "15d" })
}


router.post("/register", async (req, res) => {
    try{
        const {email, username, password} = req.body
        if(!username || !email || !password){
            return res.status(400).json({message: "All fields are required"});

        }
        if(password.length < 6){
            return res.status(400).json({message: "Password should be atleast 6 character long"});
        }

        if(username.length < 3){
            return res.status(400).json({message: "Username should be atleast 3 character long"});
    
        }
        //check user alresady exist
        // const existingUser = await User.findOne({$or: [{emai}, {username}]});
        // if(existingUser){
        //     return res.status(400).json({message: "User already exists."});
        // }

        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message: "Email already exists"});
        }

        const existingUsername = await User.findOne({username});
        if(existingUsername){
            return res.status(400).json({message: "Username already exists"});
        }

        const profileImage = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;

        const user = new User({
            email,
            username,
            password,
            profileImage,
        })

        await user.save();

        const token = generateToken(user._id);

        res.status(201).json({
            token,
            user:{
                id: user._id,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage
            },
        });
    }catch(error){
        console.log("Error in register route", error);
        res.status(500).json({message: "Interval sever error"});
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // ✅ Now this code will execute only if both email and password are provided
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Check if password matches (assuming you have comparePassword method in User model)
        const isPasswordCorrect = await user.comparePassword(password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = generateToken(user._id);

        res.status(200).json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage
            }
        });

    } catch (error) {
        console.log("Error in login route", error);
        res.status(500).json({ message: "Internal server error" });
    }
});



export default router;