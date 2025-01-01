import axios from "axios";
import { useEffect, useState } from "react";

export const useLoginStatus = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  useEffect(() => {
    console.log("use effect running", { token });
    if (token) {
      setIsLoggedIn(true);
      axios.defaults.headers["Authorization"] = token;
      localStorage.setItem("token", token);
    }
  }, [token]);

  return { isLoggedIn, setToken };
};
