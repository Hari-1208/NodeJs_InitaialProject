//getting the models
const models = require("../dataBase/models");
//Getting schema collection
const addressSchema = models.address;
const userSchema = models.user;

const getAddressById = async (req, res) => {
  try {
    //finding particular data in db using id
    const address = await addressSchema.findById(req.params.id);
    if (!address)
      return res.status(404).send({
        status: 404,
        message: "Address with given ID is not fuond!",
      });
    return res.status(200).send({
      status: 200,
      message: "Data fetched succesfully",
      data: address,
    });
  } catch (err) {
    res.status(404).send({
      status: 404,
      message: "Address with given ID is not fuond!",
      data: err,
    });
  }
};

const addNewAddress = async (req, res) => {
  try {
    const reqBody = req.body;

    //check user is in user Db
    const user = await userSchema.findById(reqBody.userId);
    if (!user)
      return res.status(404).send({
        status: 404,
        message: "user does not exist!",
      });

    const newAddress = {
      userId: reqBody.userId,
      address: reqBody.address,
    };

    const addedAddress = await addressSchema.create(newAddress);
    return res.status(200).send({
      status: 200,
      message: `Successfully address added for ${user.name}`,
      data: addedAddress,
    });
  } catch (err) {
    res.status(400).send({
      status: 400,
      message: "Bad Request",
      data: err.message,
    });
  }
};

const getAddressListByUserId = async (req, res) => {
  try {
    //check user is in user Db
    const user = await userSchema.findById(req.params.id);
    if (!user)
      return res.status(404).send({
        status: 404,
        message: "user does not exist!",
      });

    //finding address list for given userId in address db using id
    const addressList = await addressSchema.find({ userId: req.params.id });
    if (!Boolean(addressList) || addressList.length == 0)
      return res.status(404).send({
        status: 404,
        message: "Address List for given userID is not fuond!",
      });

    return res.status(200).send({
      status: 200,
      message: `Succesfully fetched Address List of ${user.name}`,
      data: addressList,
    });
  } catch (err) {
    res.status(404).send({
      status: 404,
      message: "Address List for given userID is not fuond!",
      data: err,
    });
  }
};

module.exports = {
  getAddressById,
  addNewAddress,
  getAddressListByUserId,
};
