import express from "express"
import { index, upload, download, showDownload } from '../controllers/fileController.js'
import multer from "multer"
const fileUpload = multer({ dest: 'uploads/' })

const router = express.Router()

router.get('/', index)
router.post('/upload', fileUpload.single('avatar'), upload)
router.post('/download', fileUpload.none(), download)
router.get('/download/:id', showDownload)


export default router