const isIDValid = require("./isIDValid");
const doesDocExist = require("./doesDocExist");

const validateParameter = async (id, Model) => {
  let errMsg = "";
  let isValid = false;
  let status = 200;
  const idIsValid = isIDValid(id);
  if (!idIsValid) {
    errMsg = `${id} is not a valid ID`;
    status = 400;
  } else {
    const docExists = await doesDocExist(id, Model);
    if (!docExists) {
      errMsg = `${id} does not exist`;
      status = 404;
    } else {
      isValid = true;
    }
  }

  console.log("reached", { isValid, errMsg, status });
  return {
    isValid,
    errMsg,
    status,
  };
};

module.exports = validateParameter;
