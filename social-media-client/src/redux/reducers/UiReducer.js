export const SET_ERRORS = "SET_ERRORS";
export const CLEAR_ERRORS = "CLEAR_ERRORS";
export const LOADING_UI = "LOADING_UI";

const initialState = {
  loading: false,
  errors: { email: "", general: "", password: "" }
};

const UiReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ERRORS:
      return {
        ...state,
        loading: false,
        errors: action.payload
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        loading: false,
        errors: initialState.errors
      };
    case LOADING_UI:
      return {
        ...state,
        loading: true
      };

    default:
      return state;
  }
};

export default UiReducer;
