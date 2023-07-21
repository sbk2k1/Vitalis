const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
require("dotenv/config");

exports.cryptoEncrypt = (data) => {
  return CryptoJS.AES.encrypt(
    JSON.stringify(data),
    process.env.ACCESS_TOKEN_SECRET,
  ).toString();
};

exports.cryptoDecrypt = (ciphertext) => {
  var bytes = CryptoJS.AES.decrypt(ciphertext, process.env.ACCESS_TOKEN_SECRET);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};

exports.createToken = (data) => {
  // jwt expires in 1 hour
  const time = "1h";

  const token = jwt.sign(data, process.env.JWT_SECRET, { expiresIn: time });
  return token;
};