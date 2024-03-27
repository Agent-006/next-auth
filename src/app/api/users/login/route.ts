import { connectDB } from "@/dbConfig/dbConfig";
import User from '@/models/user.model';
import {NextRequest, NextResponse} from 'next/server';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

connectDB()

export async function POST(request : NextRequest){
    try {
        const reqBody = await request.json();
        const {email, password} = reqBody;
        console.log(reqBody);

        const user = await User.findOne({email})

        if(!user){
            return NextResponse.json({error: "User doesn't exists"}, {status: 400})
        }
        console.log("User exists")

        const validPassword = await bcryptjs.compare(password, user.password)

        if(!validPassword){
            return NextResponse.json({error: "Check your credentials"}, {status: 400})
        }
        
        const tokenPayload = {
            // the more data you give more it take bandwidth(recommended only to pass id)
            id: user._id,
            username: user.username,
            email: user.email,
        }

        const token = jwt.sign(tokenPayload, process.env.TOKEN_SECRET!, {expiresIn: '1d'})
        
        const response = NextResponse.json({
            message: "Logged In Successfully", 
            success: true
        })

        response.cookies.set("token", token,
        {
            httpOnly: true
        })

        return response
        
    } catch (error:any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}