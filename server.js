import express from "express";
import session from "express-session"
import authRouter from "./routes/auth.js"
import fileRouter from "./routes/file.js"
import compileRouter from "./routes/compiler.js"
import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';
//lets you use PUT/DELETE in forms
import methodOverride from 'method-override'
import expressLayouts from "express-ejs-layouts";
import cookieParser from 'cookie-parser';
import MongoStore from 'connect-mongo';
import attachUser from "./middleware/attachUser.js";
import connectDB from "./db/db.js";
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express()

//use ejs templates
app.use(expressLayouts)
app.set('layout', './layouts/main')
app.set('view engine', 'ejs')

//cookie parser
app.use(cookieParser());

app.use(methodOverride('_method'))

//serve any file inside the 'public' folder publicly
app.use(express.static(path.join(__dirname, 'public')));

const secret = process.env.SECRET
//to be able to grab body from api ajax
app.use(express.json())
//to be able to grab body from form
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: secret,
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI
  }),
  //cookie: { maxAge: new Date ( Date.now() + (3600000) ) } 
}));
//get current user globaly
app.use(attachUser);

// Enable CORS for your specific Vue frontend origin
app.use(cors({
    origin: 'http://localhost:5173', // Your Vue dev server URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

//connect to db
// connectDB()

const PORT = 5001

app.use('/', fileRouter)
app.use('/', authRouter)
app.use('/api', compileRouter)

// import Book from "./db/models/Book.js"
// async function updateUser(){
//   await Book.updateMany(
//   { is_available: { $exists: false } },
//   { $set: { is_available: true } }
// );
// }
// updateUser()

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})