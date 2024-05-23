import Data from "./Data";

// Function to check if the user is logged in
// Helps to redirect users
export function isLoggedIn() {
  return authInfo() !== null;
}

// If the user is logged in, return a username; if not, return null
export function authInfo() {
  return getCookie("username");
}

export function authLogout() {
  setCookie("username", "", 0);
}

// Tries to log in with given credentials
// Returns username or null
export async function authLogin({ login = null, password = null }) {
  let foundUsername = null;
  try {
    await Data.get("Users").then((response) => {
      console.log("response", response);
      const foundUser = response.find(
        (user) =>
          user.password === password &&
          (user.email === login || user.username === login)
      );
      if (foundUser) {
        foundUsername = foundUser.username;
        setCookie("username", foundUsername, 1);
      }
    });
  } catch {}
  return foundUsername;
}

// Tries to register with given credentials
// Returns an object: {username: "name", errMessage: "message"}
export async function authRegister({
  username = null,
  email = null,
  password = null,
}) {
  // Forceful "registration"
  const userData = {
    username: username,
    password: password,
    email: email,
  };
  let newUsername = null;
  let errMessage = null;
  try {
    await Data.set("Users", userData).then((response) => {
      if (response) {
        console.log("response", response);
        newUsername = response?.data?.username;
        console.log("newUsername", newUsername);
        if (newUsername) setCookie("username", newUsername, 1);
        // Error handling
        else {
          newUsername = null;
          errMessage = response.data;
        }
      }
    });
  } catch {}
  return {
    username: newUsername,
    errMessage: errMessage,
  };
}

// Parsing cookie
function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return null;
}

function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
