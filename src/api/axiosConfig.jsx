import axios from "axios";

export default axios.create({
  baseURL: "http://plum-pantry.us-east-2.elasticbeanstalk.com",
});
