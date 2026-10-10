// import validator from 'validator';
// import { getDBConnection } from "../db/db.js"
// import bcrypt from 'bcryptjs';

// export async function register(req, res){
//     let { name, email, password } = req.body
//     if(!name || !email || !password){
//         return res.json({msg: "all fields are required"})
//     }
//     name = name.trim()
//     email = email.trim()
//     password = await bcrypt.hash(password, 10)

//     console.log(req.session)

//     if (!validator.isEmail(email)) {

//         return res.status(400).json({ error: 'Invalid email format' })

//     }
//   try{
    
//     let query = 'SELECT exists(SELECT 1 FROM users WHERE email = ?) AS row_exists'

//     const db = await getDBConnection()
//     const emailExists = await db.get(query,[email])  
//     console.log(emailExists.row_exists)
//     if(emailExists.row_exists){
//         return res.status(400).json({msg: "user exists, please login"})
//     }

//     const userRecord = await db.run(
//         'INSERT INTO users(name, email, password) VALUES(?, ?, ?)', 
//         [name, email, password]
//     )
//     req.session.userId = userRecord.lastID
//     console.log("SESSION DATA:", req.session);
//     console.log("USER ID IN SESSION:", req.session.userId);
//     return res.status(201).send({msg: "user created successfully"})
//   }catch(err){
//     console.error('Registration error:', err.message);
//     res.status(500).json({ error: 'Registration failed. Please try again.' })
//   }
// }

// export async function loginUser(req, res){
//    let { email, password } = req.body
//     if(!email || !password){
//         return res.json({msg: "all fields are required"})
//     }
//     email = email.trim()

//     try{
//        const db = await getDBConnection()
//       let user = await db.get('SELECT * FROM users WHERE email = ?', [email])

//       if(!user){
//         return res.json({error: "invalid email"})
//       }
//       const isPasswordValid = await bcrypt.compare(password, user.password)
//       if(!isPasswordValid){
//         return res.status(401).json({ error: 'Invalid password' })
//       }
     
//       req.session.userId = user.id
//       console.log("SESSION DATA:", req.session);
//       console.log("USER ID IN SESSION:", req.session.userId);
//       res.status(200).json({ message: 'Logged in' })

//     }catch(err){
//       console.error('Registration error:', err.message);
//       res.status(500).json({ error: 'Registration failed. Please try again.' })
//     }
// }

// export async function logoutUser(req, res){
//   req.session.destroy((err) => {
//         if (err) {
//             return res.status(500).json({ error: 'Could not log out, please try again' })
//         }
//         res.clearCookie('connect.sid')

//         return res.status(200).json({ msg: 'Logged out successfully' })
//     })
// }