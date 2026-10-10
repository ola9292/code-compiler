import express from "express"
import { checkLogin, register, showRegister, login, logout } from "../controllers/authController.js"
const router = express.Router()

router.get('/register', showRegister)
router.post('/register', register)
router.get('/login', login)
router.post('/login', checkLogin)
router.post('/logout', logout)


export default router