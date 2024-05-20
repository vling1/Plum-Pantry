// Function to check if the user is logged in
// Helps to redirect users
export function isLoggedIn() {
  return authInfo() !== null;
}

// If the user is logged in, return a username; if not, return null
export function authInfo() {
  return getCookie("username");
}

export function authLogin(username) {
  setCookie("username", username, 1);
}

export function authLogout() {
  setCookie("username", "", 0);
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
