// import sqlite3 from 'sqlite3'
// import { open } from 'sqlite'
// import path from 'node:path'

// export async function getDBConnection() {

// const dbPath = path.join('database.db')

//  return open({
//    filename: dbPath,
//    driver: sqlite3.Database
//  }) 
// } 

import mongoose from "mongoose";

const connectDB = async () => {
  
  try {
    mongoose.set('strictQuery', false);
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`Database Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
  }

}

export default connectDB;