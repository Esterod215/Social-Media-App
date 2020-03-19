const isEmpty = string => {
  if (string.trim() === "") {
    return true;
  } else {
    return false;
  }
};
const isEmail = email => {
  const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (email.match(emailRegEx)) {
    return true;
  } else {
    return false;
  }
};

exports.validateSignUp = data => {
  const errors = {};
  if (isEmpty(data.email)) {
    errors.email = "must not be empty";
  } else if (!isEmail(data.email)) {
    errors.email = "must be a valid email address";
  }
  if (isEmpty(data.password)) {
    errors.password = "Must not be empty";
  }
  if (data.password !== data.confirmPassword) {
    errors.confirmPassword = "passwords must match";
  }
  if (isEmpty(data.handle)) {
    errors.handle = "Must not be empty";
  }

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false
  };
};

exports.validateLogin = data => {
  const errors = {};
  if (isEmpty(data.email)) {
    errors.email = "must not be empty";
  }
  if (isEmpty(data.password)) {
    errors.password = "must not be empty";
  }
  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false
  };
};
