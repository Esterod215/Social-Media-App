import { combineReducers } from "redux";

import userReducer from "./UserReducer";
import UiReducer from "./UiReducer";

const rootReducer = combineReducers({
  userReducer,
  UiReducer
});

export default rootReducer;
