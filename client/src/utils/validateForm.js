export const isValidEmail = (email = "") => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());
};

export const isValidPassword = (password = "") => {
  return String(password).length >= 6;
};

export const isRequired = (value = "") => {
  return String(value || "").trim().length > 0;
};

export const isValidPhone = (phone = "") => {
  return /^[6-9]\d{9}$/.test(String(phone).trim());
};

export const validateLoginForm = ({ email, password }) => {
  if (!isRequired(email)) {
    return "Email is required.";
  }

  if (!isValidEmail(email)) {
    return "Please enter a valid email address.";
  }

  if (!isRequired(password)) {
    return "Password is required.";
  }

  return "";
};

export const validateRegisterForm = ({ name, email, password, terms }) => {
  if (!isRequired(name)) {
    return "Full name is required.";
  }

  if (!isRequired(email)) {
    return "Email is required.";
  }

  if (!isValidEmail(email)) {
    return "Please enter a valid email address.";
  }

  if (!isRequired(password)) {
    return "Password is required.";
  }

  if (!isValidPassword(password)) {
    return "Password must be at least 6 characters.";
  }

  if (!terms) {
    return "Please accept the Terms & Conditions.";
  }

  return "";
};

export const validateCheckoutForm = ({
  fullName,
  email,
  phone,
  address,
  city,
  state,
  pincode,
}) => {
  if (!isRequired(fullName)) {
    return "Full name is required.";
  }

  if (!isValidEmail(email)) {
    return "Please enter a valid email address.";
  }

  if (!isValidPhone(phone)) {
    return "Please enter a valid 10-digit phone number.";
  }

  if (!isRequired(address)) {
    return "Address is required.";
  }

  if (!isRequired(city)) {
    return "City is required.";
  }

  if (!isRequired(state)) {
    return "State is required.";
  }

  if (!isRequired(pincode)) {
    return "Pincode is required.";
  }

  return "";
};

export const validateProductForm = ({ name, brand, category, price, stock }) => {
  if (!isRequired(name)) {
    return "Product name is required.";
  }

  if (!isRequired(brand)) {
    return "Product brand is required.";
  }

  if (!isRequired(category)) {
    return "Product category is required.";
  }

  if (Number(price) < 0) {
    return "Product price cannot be negative.";
  }

  if (Number(stock) < 0) {
    return "Product stock cannot be negative.";
  }

  return "";
};