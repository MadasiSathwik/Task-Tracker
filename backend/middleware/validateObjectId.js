const mongoose = require('mongoose');

const validateObjectId = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    const error = new Error('Invalid task ID format');
    error.statusCode = 400;
    return next(error);
  }

  next();
};

module.exports = validateObjectId;
