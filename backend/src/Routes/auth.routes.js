import express from 'express'
import * as authController from '../controllers/auth.controller.js'

const route=express.Router()


route.post("/register",authController.registerController)
route.get("/get-me",authController.getMeController)
route.get("/refresh-token",authController.refreshToken)



export default route