const doesDocExist = async (_id, Model) => {
  return await Model.exists({ _id });
};

module.exports = doesDocExist;
