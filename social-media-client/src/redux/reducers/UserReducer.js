import {
  SET_AUTHENTICATED,
  SET_UNAUTHENTICATED,
  SET_USER,
  LOADING_USERS
} from "../actions/UserActions";

const initialState = {
  authenticated: false,
  credentials: {},
  likes: [],
  notifications: [],
  loadingUser: false
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_AUTHENTICATED:
      return {
        ...state,
        authenticated: true
      };
    case SET_UNAUTHENTICATED:
      return initialState;
    case SET_USER:
      return {
        ...state,
        authenticated: true,
        credentials: action.payload.credentials,
        likes: action.payload.likes,
        notifications: action.payload.notifications,
        loadingUser: false
      };
    case LOADING_USERS:
      return {
        ...state,
        loadingUser: true
      };
    default:
      return state;
  }
};

export default userReducer;
