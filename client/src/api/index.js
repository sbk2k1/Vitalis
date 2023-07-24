import axios from "axios";
import Cookies from "universal-cookie";
import CryptoJS from "crypto-js";
const cookies = new Cookies();
// ------------------ ENCRYPTION ------------------ //

// encrypt data
// encrypt data

const endpoint = "http://localhost:6969/";

export const cryptoEncrypt = (data) => {
  console.log(process.env.REACT_APP_ACCESS_TOKEN_SECRET);

  return CryptoJS.AES.encrypt(
    JSON.stringify(data),
    process.env.REACT_APP_ACCESS_TOKEN_SECRET,
  ).toString();
};

// decrypt data
export const cryptoDecrypt = (ciphertext) => {
  var bytes = CryptoJS.AES.decrypt(
    ciphertext,
    process.env.REACT_APP_ACCESS_TOKEN_SECRET,
  );
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};

// ------------------ API CALLING ------------------ //
export const onPostData = async (url, data) => {
  // get token from cookie named token and set in header

  if (!cookies.get("data")) {
    return await axios.post(endpoint + url, data, {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Methods": "POST",
      },
    });
  } else {
    const token = cryptoDecrypt(cookies.get("data")).token;

    // fire post request
    return await axios.post(endpoint + url, data, {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Methods": "POST",
        Authorization: "Bearer " + token,
      },
    });
  }
};

export const onDeleteData = async (url) => {
  // get token from cookie named token and set in header

  if (!cookies.get("data")) {
    return await axios.delete(endpoint + url, {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Methods": "DELETE",
      },
    });
  } else {
    const token = cryptoDecrypt(cookies.get("data")).token;
    // fire post request
    return await axios.delete(endpoint + url, {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Methods": "DELETE",
        Authorization: "Bearer " + token,
      },
    });
  }
};

export const onPostFormData = async (url, data) => {
  // get token from cookie named data and set in header

  if (!cookies.get("data")) {
    return await axios.post(endpoint + url, data, {
      headers: {
        "Content-Type": "multipart/form-data",
        "Access-Control-Allow-Methods": "POST",
      },
    });
  } else {
    const token = cryptoDecrypt(cookies.get("data")).token;

    // fire post request
    return await axios.post(endpoint + url, data, {
      headers: {
        "Content-Type": "multipart/form-data",
        "Access-Control-Allow-Methods": "POST",
        Authorization: "Bearer " + token,
      },
    });
  }
};

export const onGetData = async (url) => {
  // get token from cookie named token and set in header
  if (!cookies.get("data")) {
    return await axios.get(endpoint + url, {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
      },
    });
  } else {
    const token = cryptoDecrypt(cookies.get("data")).token;

    // fire get request
    return await axios.get(endpoint + url, {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
        Authorization: "Bearer " + token,
      },
    });
  }
};

// export const onGetData = async (url) => {
//   // get token from cookie named token and set in header
//   if (!cookies.get("data")) {
//     return await axios.get(endpoint + url, {
//       headers: {
//         "Content-Type": "application/json",
//         "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
//       },
//     });
//   } else {
//     const token = cryptoDecrypt(cookies.get("data")).token;

//     // fire get request
//     return await axios.get(endpoint + url, {
//       headers: {
//         "Content-Type": "application/json",
//         "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
//         Authorization: "Bearer " + token,
//       },
//     });
//   }
// };

// ------------------ AUTHENTICATION ------------------ //

// set encrypted data in cookie
export const setData = (data) => {
  cookies.set("data", cryptoEncrypt(data), { path: endpoint });
};

// remove data from cookie
export const removeData = () => {
  cookies.remove("data", { path: endpoint });
  window.location.reload();
};

// check if user is logged in
export const isUser = () => {
  if (cookies.get("data")) {
    const data = cryptoDecrypt(cookies.get("data"));
    if (data) {
      return data;
    } else {
      return false;
    }
  } else {
    return false;
  }
};
