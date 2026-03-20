import userModel from "../models/auth.model.js"
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import config from "../config/config.js"

export async function registerController(req, res) {
    try {
        const { username, email, password } = req.body
        const isUserAlreadyExist = await userModel.findOne({
            $or: [
                { username },
                { email }
            ]
        })

        if (isUserAlreadyExist) {
            return res.status(409).json({
                message: "User already esists"
            })
        }

        const hashedPassword = crypto.createHash("sha256").update(password).digest("hex")

        const newUser = await userModel.create({
            username,
            email,
            password: hashedPassword
        })

        const refreshToken = jwt.sign({
            id: newUser._id
        }, config.JWT_SECRET, {
            expiresIn: "7d"
        })

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        const accessToken = jwt.sign({
            id: newUser._id
        }, config.JWT_SECRET, {
            expiresIn: "15m"
        })

        res.status(200).json({
            message: "User created successfully!",
            user: {
                username: newUser.username,
                email: newUser.email
            },
            token: accessToken
        })

    } catch (error) {
        res.status(500).json({
            message: error
        })
    }

}


export async function getMeController(req, res) {
    try {
        const token = req.headers.authorization?.split(" ")[1]
        if (!token) {
            return res.status(401).json({
                message: "Token not found"
            })
        }
        const decoded = jwt.verify(token, config.JWT_SECRET)

        const user = await userModel.findOne({ _id: decoded.id })

        if (!user) {
            return res.status(401).json({
                message: "User not found!"
            })
        }
        res.status(200).json({
            message: "User fetched successfully!",
            user: {
                username: user.username,
                email: user.email
            }
        })


    } catch (error) {
        res.status(500).json({
            message: "Token not provided"
        })
    }
}

export async function refreshToken(req, res) {
    try {
        const token = req.cookies.refreshToken
        if (!token) {
            return res.status(401).json({
                message: "Refresh token not provided!"
            })
        }
        const decoded = jwt.verify(token, config.JWT_SECRET)


        const newRefreshedToken = jwt.sign({
            id: decoded.id
        }, config.JWT_SECRET, {
            expiresIn: "7d"
        })

        res.cookie("refreshToken", newRefreshedToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        const accessToken = jwt.sign({
            id: decoded.id
        }, config.JWT_SECRET, {
            expiresIn: "15m"
        })
        res.status(200).json({
            message: "Access token refreshed!",
            token: accessToken
        })
    } catch (error) {
        res.status(401).json({
            message: "Refresh token is not provided!"
        })
    }
}