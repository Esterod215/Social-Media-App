import axios from "axios";

export const CLEAR_ERRORS = "CLEAR_ERRORS";
export const SET_ERRORS = "SET_ERRORS";
export const SET_AUTHENTICATED = "SET_AUTHENTICATED";
export const SET_UNAUTHENTICATED = "SET_UNAUTHENTICATED";
export const SET_USER = "SET_USER";
export const LOADING_USERS = "LOADING_USERS";
export const LOADING_UI = "LOADING_UI";

export const loginUser = (userData, history) => dispatch => {
  dispatch({ type: LOADING_UI });
  axios
    .post(
      "https://us-central1-socialapp-2a20a.cloudfunctions.net/api/login",
      userData
    )
    .then(res => {
      const FBToken = `Bearer ${res.data.token}`;
      localStorage.setItem("FBToken", `Bearer ${res.data.token}`);
      axios.defaults.headers.common["Authorization"] = FBToken;
      dispatch(getUserData());
      dispatch({ type: CLEAR_ERRORS });
      history.push("/");
    })
    .catch(err => {
      console.log("error", err.response.data);
      dispatch({ type: SET_ERRORS, payload: err.response.data });
    });
};

export const signupUser = (newUserData, history) => dispatch => {
  dispatch({ type: LOADING_UI });
  axios
    .post(
      "https://us-central1-socialapp-2a20a.cloudfunctions.net/api/signup",
      newUserData
    )
    .then(res => {
      const FBToken = `Bearer ${res.data.token}`;
      localStorage.setItem("FBToken", FBToken);
      axios.defaults.headers.common["Authorization"] = FBToken;
      dispatch(getUserData());
      dispatch({ type: CLEAR_ERRORS });
      history.push("/");
    })
    .catch(err => {
      dispatch({ type: SET_ERRORS, payload: err.response.data });
    });
};

export const logoutUser = () => dispatch => {
  localStorage.removeItem("FBToken");
  delete axios.defaults.headers.common["Authorization"];
  dispatch({ type: SET_UNAUTHENTICATED });
};

export const getUserData = () => dispatch => {
  axios
    .get("https://us-central1-socialapp-2a20a.cloudfunctions.net/api/user")
    .then(res => {
      console.log("user data", res);
      dispatch({ type: SET_USER, payload: res.data });
    })
    .catch(err => {
      console.log(err);
    });
};
