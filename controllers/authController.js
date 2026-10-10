import User from '../db/models/User.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import 'dotenv/config';

const jwtSecret = process.env.JWT_SECRET

export async function showRegister(req, res){
    res.render('auth/register')
}

export async function register(req, res){
   try {
    const { username, password } = req.body;
    const errors = {};

    // 1. Manual validation checks
    if (!username || username.trim() === '') {
        errors.username = 'Username is required.';
    }
    if (!password || password.length < 6) {
        errors.password = 'Password must be at least 6 characters long.';
    }

    // If validation fails, re-render form with errors and old input
    if (Object.keys(errors).length > 0) {
        return res.render('auth/register', { errors, oldInput: req.body });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const user = await User.create({ username, password:hashedPassword });
    //   res.status(201).json({ message: 'User Created', user });
        res.redirect('/login')
    } catch (error) {
      if(error.code === 11000) {
        res.status(409).json({ message: 'User already in use'});
      }
      res.status(500).json({ message: 'Internal server error'})
    }

  } catch (error) {
    console.log(error);
  }
}

export async function login(req, res){

    return res.render('auth/login')
}

export async function checkLogin(req, res){
    try {
        const { username, password } = req.body;
        const errors = {};

        // 1. Manual validation checks
        if (!username || username.trim() === '') {
            errors.username = 'Username is required.';
        }
        if (!password) {
            errors.password = 'Password is required.';
        }

        if (Object.keys(errors).length > 0) {
            return res.render('auth/login', { errors, oldInput: req.body });
        }
        const user = await User.findOne( { username } );

        if(!user) {
        return res.status(401).json( { message: 'Invalid credentials' } );
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid) {
          return res.status(401).json( { message: 'Invalid credentials' } );
        }

        const token = jwt.sign({ userId: user._id, is_admin: user.is_admin, username: user.username}, jwtSecret );
        res.cookie('token', token, { httpOnly: true });
        return res.redirect('/');
  } catch (error) {
        console.log(error);
  }
 
}

export function logout(req, res){
    res.clearCookie('token');
    //res.json({ message: 'Logout successful.'});
    res.redirect('/login');
}