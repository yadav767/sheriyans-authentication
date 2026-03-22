import userModel from "../models/auth.model.js"
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import config from "../config/config.js"
import sessionModel from "../models/sessional.model.js"
import { getOtpHtml, generateOtp } from "../utils/utils.js"
import sendEmail  from '../services/email.service.js'
import otpModel from '../models/otp.model.js'
// export async function registerController(req, res) {
//     try {
//         const { username, email, password } = req.body
//         const isUserAlreadyExist = await userModel.findOne({
//             $or: [
//                 { username },
//                 { email }
//             ]
//         })

//         if (isUserAlreadyExist) {
//             return res.status(409).json({
//                 message: "User already esists"
//             })
//         }

//         const hashedPassword = crypto.createHash("sha256").update(password).digest("hex")

//         const newUser = await userModel.create({
//             username,
//             email,
//             password: hashedPassword
//         })

//         const refreshToken = jwt.sign({
//             id: newUser._id
//         }, config.JWT_SECRET, {
//             expiresIn: "7d"
//         })

//         const refreshTokenHashed = crypto.createHash("sha256").update(refreshToken).digest("hex")

//         const session = await sessionModel.create({
//             user: newUser._id,
//             refreshTokenHashed,
//             ip: req.ip,
//             userAgent: req.headers["user-agent"]
//         })

//         res.cookie("refreshToken", refreshToken, {
//             httpOnly: true,
//             secure: true,
//             sameSite: "strict",
//             maxAge: 7 * 24 * 60 * 60 * 1000
//         })

//         const accessToken = jwt.sign({
//             id: newUser._id,
//             sessionId: session._id
//         }, config.JWT_SECRET, {
//             expiresIn: "15m"
//         })

//         res.status(200).json({
//             message: "User created successfully!",
//             user: {
//                 username: newUser.username,
//                 email: newUser.email
//             },
//             token: accessToken
//         })

//     } catch (error) {
//         res.status(500).json({
//             message: error
//         })
//     }

// }


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

        const otp = generateOtp()
        const html = getOtpHtml(otp)
        const otpHash = crypto.createHash("sha256").update(otp).digest("hex")

        await otpModel.create({
            email: newUser.email,
            user: newUser._id,
            otpHash
        })

        await sendEmail(email, "OTP Verification", `Your otp code is ${otp}`, html)

        res.status(200).json({
            message: "User registered successfully",
            user: {
                username: newUser.email,
                email: newUser.email,
                verified: newUser.verified
            }
        })

    } catch (error) {
        res.status(401).json({
            message: "Refresh token not found "
        })
    }
}

export async function loginController(req, res) {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(500).json({
            message: "Email and password required"
        })
    }
    const userExist = await userModel.findOne({ email })
    if (!userExist) {
        return res.status(401).json({
            message: "Invalid username or password !"
        })
    }

    if (!userExist.verified) {
        return res.status(401), json({
            message: "User is not verified"
        })
    }

    const hashPassword = crypto.createHash("sha256").update(password).digest("hex")

    const isPasswordCorrect = hashPassword == userExist.password
    if (!isPasswordCorrect) {
        return res.status(401).json({
            message: "Invalid credentials!"
        })
    }
    const refreshToken = jwt.sign({ id: userExist._id }, config.JWT_SECRET, { expiresIn: "7d" })
    const refreshTokenHashed = crypto.createHash("sha256").update(refreshToken).digest("hex")

    const session = await sessionModel.create({
        user: userExist._id,
        refreshTokenHashed,
        ip: req.ip,
        userAgent: req.headers["user-agent"],
        revoked: false
    })

    const accessToken = jwt.sign({
        id: userExist._id,
        sessionId: session._id
    }, config.JWT_SECRET, { expiresIn: "15m" })

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    })

    res.status(200).json({
        message: "Login successfully !",
        user: {
            username: userExist.username,
            email: userExist.email
        },
        accessToken
    })
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

        const refreshTokenHashed = crypto.createHash("sha256").update(token).digest("hex")

        const session = await sessionModel.findOne({
            refreshTokenHashed,
            revoked: false
        })

        if (!session) {
            return res.status(401).json({
                message: "Invalid refresh Token!"
            })
        }


        const newRefreshedToken = jwt.sign({
            id: decoded.id
        }, config.JWT_SECRET, {
            expiresIn: "7d"
        })

        const newRefreshTokenHashed = crypto.createHash("sha256").update(newRefreshedToken).digest("hex")

        session.refreshTokenHashed = newRefreshTokenHashed
        await session.save()

        res.cookie("refreshToken", newRefreshedToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        const accessToken = jwt.sign({
            id: decoded.id,
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

export async function logout(req, res) {
    const refreshToken = req.cookies.refreshToken
    console.log(refreshToken);
    if (!refreshToken) {
        return res.status(400).json({
            message: "Refresh Token is not provided!"
        })
    }
    const refreshTokenHashed = crypto.createHash("sha256").update(refreshToken).digest("hex")

    const session = await sessionModel.findOne({
        refreshTokenHashed,
        revoked: false
    })
    if (!session) {
        return res.status(400).json({
            message: "Invalid refresh token"
        })
    }
    session.revoked = true
    await session.save()
    res.clearCookie("refreshToken")
    res.status(200).json({
        message: "Logout successfully !"
    })
}

export async function logoutAll(req, res) {
    console.log("object");
    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) {
        return res.status(401).json({
            message: "Refresh token is not provided !"
        })
    }


    const decoded = jwt.verify(refreshToken, config.JWT_SECRET)

    await sessionModel.updateMany({
        user: decoded.id,
        revoked: false
    }, { revoked: true })

    res.clearCookie("refreshToken")

    res.status(200).json({
        message: "Logout from all the devices !"
    })
}

export async function verifyOtp(req, res) {
    const { otp, email } = req.body
    const otpHash = crypto.createHash("sha256").update(otp).digest("hex")

    const otpDoc = await otpModel.findOne({
        otpHash,
        email
    })

    if (!otpDoc) {
        return res.status(401).json({
            message: "Invalid OTP"
        })
    }
    const user = await userModel.findByIdAndUpdate(otpDoc.user, {
        verified: true
    })

    await otpModel.deleteMany({
        user: otpHash.user
    })
    res.status(200).json({
        message: "User verified successfully "
    })
}
