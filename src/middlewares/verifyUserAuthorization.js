const AppError = require('../utils/AppError');

function verifyUserAuthorization(roleToVerify) {
  return (request, response, next) => {
    const { role } = request.user;

    console.log(request.user, role);

    if (role !== roleToVerify) {
      throw new AppError('Unauthorized', 401);
    }

    return next();
  };
}

module.exports = verifyUserAuthorization;
