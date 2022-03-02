const { default : mongoose } = require("mongoose")

const isIDValid = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

module.exports = isIDValid;
