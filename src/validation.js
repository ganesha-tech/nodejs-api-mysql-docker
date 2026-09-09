function validateUserInput(name, email) {
  if (typeof name !== 'string' || name.trim() === '') {
    return 'Name is required';
  }

  if (typeof email !== 'string' || email.trim() === '') {
    return 'Email is required';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email.trim())) {
    return 'Invalid email address';
  }

  return null;
}

module.exports = {
  validateUserInput,
};
