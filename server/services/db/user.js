// services required are

// createUserService
// userLoginService

const User = require('../models/user');
const bcrypt = require('bcrypt');


const createUserService = async (params) => {
 try {
  const user = new User({
   name: params.name,
   username: params.username,
   password: params.password,
  });
  const newUser = await user.save();
  return {
   created: true,
   message: "user created",
   user: newUser,
  };
 } catch (err) {
  return {
   created: false,
   message: err.message,
  };
 }
}

const userLoginService = async (params) => {
 // first check if user exists
 try {
  const user = await User.findOne({ username: params.username });
  if (!user) {
   return {
    login: false,
    message: "user not found",
   };
  }

  // hash the password

  const hashed_password = await bcrypt.hash(params.password, 10);

  // if user exists, check if password matches
  const isMatch = await bcrypt.compare(params.password, hashed_password);
  if (!isMatch) {
   return {
    login: false,
    message: "password does not match",
   };
  }
  return {
   login: true,
   message: "login successful",
   user: user,
  };
 } catch (err) {
  return {
   login: false,
   message: err.message,
  };
 }
}

module.exports = {
 createUserService,
 userLoginService,
}