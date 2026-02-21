import mongoose from "mongoose";
import bcrypt from 'bcryptjs';

// schema definition
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be atleast 3 characters'],
    maxlength: [20, 'Username cannot exceed 20 characters'],
  },
  email: {
    type: String,
    required: [true, 'email is required'],
    unique: true,
    trim: true,
    lowercase: true,      // always stores as lowercase
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please enter a valid email'
    ],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be atleast 8 characters'],
    select: false         // never return password in queries by default
  },
  avatar: {
    type: String,
    default: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`    // sender avatar for frontend
  }
},{
  timestamps: true         // automatically adds 2 fileds: createdAt & updateAt to every document
});

// mongoose middleware: hash password
// use regular function 
userSchema.pre("save", async function () {
  // only hash if the password was modified
  if(!this.isModified("password")) {
    return;
  }

  // generate salt: random data added to password
  const salt = await bcrypt.genSalt(10);

  // hash password
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// creates model from schema
const User = mongoose.model('User', userSchema);  //MongoDB will create a collection called 'users'

export default User;