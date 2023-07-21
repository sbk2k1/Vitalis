// services required are

// createUserService
// userLoginService

const User = require('../models/user');


const createUserService = async (params) => {
 try {
  const user = new User({
   name: params.name,
   username: params.username,
   password: params.password,
  });
  const newUser = await user.save();
  return newUser;
 } catch (err) {
  return err;
 }
}

const userLoginService = async (params) => {
 // first check if user exists
 try {
  const user = await User.findOne({ username: params.username });
  if (!user) {
   return "user not found";
  }
  // if user exists, check if password matches
  const isMatch = await bcrypt.compare(params.password, user.password);
  if (!isMatch) {
   return "wrong password";
  }
  return user;
 } catch (err) {
  return err;
 }
}

module.exports = {
 createUserService,
 userLoginService,
}