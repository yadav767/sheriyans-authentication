import express from 'express'
import * as authController from '../controllers/auth.controller.js'

const route = express.Router()


route.post("/register", authController.registerController)
route.post("/login",authController.loginController)
route.get("/get-me", authController.getMeController)
route.get("/refresh-token", authController.refreshToken)
route.get("/logout", authController.logout)
route.get("/logout-all",authController.logoutAll)



export default route