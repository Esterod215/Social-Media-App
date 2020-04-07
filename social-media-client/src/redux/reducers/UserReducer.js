import {
  SET_AUTHENTICATED,
  SET_UNAUTHENTICATED,
  SET_USER,
  LOADING_USERS,
  LOADING_UI
} from "../actions/UserActions";

const initialState = {
  authenticated: false,
  credentials: {},
  likes: [],
  notifications: []
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
        notifications: action.payload.notifications
      };
    default:
      return state;
  }
};

export default userReducer;
