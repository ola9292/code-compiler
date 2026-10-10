import express from "express"
import { compile } from "../controllers/compileController.js"
const router = express.Router()

router.post('/run', compile)

export default router