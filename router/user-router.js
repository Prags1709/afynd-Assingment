const express = require("express");
const {UserModel} = require("../model/user-model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const userRoute = express.Router();
require('dotenv').config()

//User register route
userRoute.post("/register", async (req, res)=>{
    let {name, email, phoneNumber, password, confirmPassword} = req.body
    try {
        if(password === confirmPassword){
            //hash the password and confirm password
            bcrypt.hash(password, 4, async (err, securePassword)=>{
                if(err){
                    res.send({"message": "Internal server error something went wrong. Please try again"})
                }else{
                    bcrypt.hash(confirmPassword, 4, async (err, secureConfirmPassword)=>{
                        if(err){
                            res.send({"message": "Internal server error something went wrong. Please try again"})
                        }else{
                            let user = new UserModel({name, email, phoneNumber, password: securePassword, confirmPassword: secureConfirmPassword});
                            await user.save();
                            res.send({"message": "User registered successfully"})
                        }
                    })
                }
            })
        }else{
            res.send({"message": "please check you password and confirm password"})
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({"message":"Internal server error", "error": error});
    }
})

//User login
userRoute.post("/login", async (req, res) => {
    let {email, password, confirmPassword} = req.body
    try {
        const isUserExist = await UserModel.findOne({email})
        const hashPassword = isUserExist.password;
        const hashConfirmPassword = isUserExist.confirmPassword;
        if(!isUserExist){
            res.status(401).send({"message": "please check your email and password, if you are new user please register first."})
        }else{
            if(password === confirmPassword){
                bcrypt.compare(password, hashPassword, async (err, result)=>{
                    if(result){
                        bcrypt.compare(confirmPassword, hashConfirmPassword, async (err, result)=>{
                            if(result){
                                const token = jwt.sign({userId: isUserExist._id}, process.env.JWT_KEY, {expiresIn: "3h"});
                                res.send({"message": "Login successful", "token": token})
                            }else{
                                res.send({"message": `Internal server error ${err}. Please check your email and password again`})
                            }
                        })
                    }else{
                        res.send({"message": `Internal server error ${err}. Please check your email and password again`})
                    }
                })
            }else{
                res.send({"message": "Please check your password and confirm password, Try again"})
            }
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({"message":"Internal server error", "error": error});
    }
})

module.exports = {userRoute}