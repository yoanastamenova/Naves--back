import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { User } from '../database/models/User';
import jwt from 'jsonwebtoken';

export const register = async (req:Request, res:Response) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        if(!email || !password){
            return res.json(400).json(
                {
                    success: false,
                    message: "Email and password are required!"
                }
            )
        }

        if(password.length < 8 || password.length > 12){
            return res.json(400).json(
                {
                    success: false,
                    message: "Password must be between 8 and 12 characters."
                }
            )
        }

        const hashedPassword = bcrypt.hashSync(password, 10);
        const newUser = await User.create(
            {
                email: email,
                password: hashedPassword
            }
        ).save()

        res.status(201).json(
            {
                success: true,
                message: "You registered successfully! Welcome!"
            }
        )
    } catch (error) {
        res.status(500).json
    }
}
