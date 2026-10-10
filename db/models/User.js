import mongoose from "mongoose";


const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique:true
  },
  password: {
    type: String,
    required: true
  },
  is_admin: { 
    type: Boolean, 
    default: false // New users won't be admins by default
  },

});

export default mongoose.model('User', UserSchema);