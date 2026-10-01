const User = require("../models/userSchema.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerUser = async(req , res , next) => {
    try{
        const{name , email , password} = req.body;

        const existingUser = await User.findOne({ email });

        if(existingUser){
            return res.status(400).json({
                message : "User with this email already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password , 10);

        const user = await User.create({
            name ,
            email ,
            password : hashedPassword
        });


        res.status(201).json({
            message : "User registered successfully" ,
            user : {
                userId : user._id ,
                name : user.name ,
                email : user.email
            }
        });
    }

    catch(error){
        next(error);
    }
}

const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }

        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordCorrect) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            { userId : user._id } ,
            process.env.JWT_SECRET ,
            { expiresIn : "7d"}
        );

        res.status(200).json({
            message: "Login successful" ,
            token ,
            user: {
                userId: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {registerUser , loginUser};