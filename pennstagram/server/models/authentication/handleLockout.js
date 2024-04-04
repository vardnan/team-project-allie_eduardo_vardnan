async function handleLockout(collection, user, password, currentTime) {
  // Check if account is locked
  if (user.lockUntil && currentTime < user.lockUntil) {
    return {
      status: 'locked',
      message: 'Account is locked temporarily, try again in a few minutes',
    };
  // eslint-disable-next-line
  } else {
    // Reset lockout if time has passed
    if (user.lockUntil && currentTime >= user.lockUntil) {
      // eslint-disable-next-line
      user.loginAttempts = 0;
      // eslint-disable-next-line
      user.lockUntil = null;
    }

    // Check password
    if (user.password !== password) {
      // Incorrect password, increment login attempts
      // eslint-disable-next-line
      user.loginAttempts++;
      // eslint-disable-next-line
      user.lastLoginAttemptTime = currentTime;

      // Update lockUntil if attempts exceed limit
      if (user.loginAttempts >= 3) {
        // eslint-disable-next-line
        // user.lockUntil = new Date(currentTime.getTime() + 10 * 60000); // 10 minutes lock
        // eslint-disable-next-line
        user.lockUntil = new Date(currentTime.getTime() + (30000)); // Testing: 30 sec lock
      }

      await collection.updateOne({ username: user.username }, { $set: user });

      // Warning message for second failed attempt
      if (user.loginAttempts === 2) {
        return {
          status: 'warning',
          message:
            'You have 2 failed login attempts. A third failed attempt will temporarily lock the account for 10 minutes for security purposes',
        };
      }

      if (user.loginAttempts === 3) {
        return {
          status: 'warning',
          message:
            'You have 3 failed login attempts. The account is temporarily locked for 10 minutes for security purposes',
        };
      }

      return {
        status: 'incorrect_password',
        message: 'Incorrect username or password',
      };
    // eslint-disable-next-line
    } else {
      // Correct password
      // eslint-disable-next-line
      user.loginAttempts = 0;
      // eslint-disable-next-line
      user.lastLoginAttemptTime = null;
      // eslint-disable-next-line
      user.lockUntil = null;
      await collection.updateOne({ username: user.username }, { $set: user });

      return { status: 'success' };
    }
  }
}

module.exports = handleLockout;
