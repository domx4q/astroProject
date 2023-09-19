import axios from "axios";

function isAdmin() {
  getIP().then((ip) => {
    console.log(ip.data.ip)
    return false;
  });
}

function getIP() {
  return axios.get("https://api.ipify.org?format=json")
}


export default isAdmin;
