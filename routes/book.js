import express from "express"
import { index, show, create, store, edit, update, destroy, borrow, returnBook } from '../controllers/bookController.js'
import authCheck from "../middleware/authCheck.js"
import { adminCheck } from "../middleware/adminCheck.js"
const router = express.Router()


router.get('/', index)
router.get('/books/create', authCheck, adminCheck, create)
router.post('/books/create', authCheck, adminCheck, store)
router.get('/books/edit/:id', edit)
router.post('/books/edit/:id', update)
router.delete('/books/delete/:id', destroy)
router.post('/books/borrow/:id',  authCheck, borrow)
router.post('/books/return/:id',  authCheck, returnBook)
router.get('/books/:id', show)


export default router
