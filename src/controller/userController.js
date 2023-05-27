//getting the models
const models = require("../dataBase/models");
//Getting schema collection
const userSchema = models.user;

const initialPage = async (req, res) => {
  res.send("Basic Curd Operation in Nodejs");
};

const getAllUsers = async (req, res) => {
  try {
    const response = await userSchema.find();
    res.status(200).send({
      status: 200,
      message: "Datas Listed succesfully",
      data: response,
    });
  } catch (err) {
    res.status(404).send({
      status: 404,
      message: "Error",
      data: err,
    });
  }
};

const getUserById = async (req, res) => {
  try {
    //finding particular data in db using id
    const item = await userSchema.findById(req.query.id);
    if (!item?.name)
      return res.status(404).send({
        status: 404,
        message: "User with given ID is not fuond!",
      });
    return res
      .status(200)
      .send({ status: 200, message: "Data fetched succesfully", data: item });
  } catch (err) {
    res.status(404).send({
      status: 404,
      message: "User with given ID is not fuond!",
      data: err,
    });
  }
};

const addNewUser = async (req, res) => {
  const newUser = new userSchema({
    name: req.body.name,
    mobileNumber: req.body.mobileNumber,
    dob: req.body.mobileNumber,
    emailId: req.body.emailId,
  });

  try {
    const dbData = await userSchema.find();

    let filteredItem = dbData.find((item) => {
      if (
        parseInt(item.mobileNumber) === parseInt(req.body.mobileNumber) ||
        item.emailId === req.body.emailId
      ) {
        return item;
      }
    });
    if (Boolean(filteredItem))
      return res.status(201).send({
        status: 201,
        message: "User already exist!",
      });
    const addedUser = await newUser.save();
    res.status(200).send({
      status: 200,
      message: "User added succesfully",
      data: addedUser,
    });
  } catch (err) {
    res.status(400).send({
      status: 400,
      message: "Bad Request",
      data: err.message,
    });
  }
};

const updateUser = async (req, res) => {
  try {
    // look for the item if its not retuen 404 object not fount
    const item = await userSchema.findById(req.params.id);
    if (!item)
      return res.status(404).send({
        status: 404,
        message: "User with given ID is not fuond!",
      });

    // update item
    userSchema
      .findByIdAndUpdate(req.params.id, req.body)
      .then((response) => {
        res.status(200).send({
          status: 200,
          message: "User updated succesfully",
        });
      })
      .catch((err) => {
        if (err) {
          res.status(400).send({
            message: "error",
            data: err,
          });
        }
      });
  } catch (err) {
    res.status(400).send({
      message: "error",
      data: err.message,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    // look for the item if its not retuen 404 object not fount
    const item = await userSchema.findById(req.params.id);
    if (!item)
      return res.status(404).send({
        status: 404,
        message: "User with given ID is not fuond!",
      });

    //delete item
    userSchema
      .findByIdAndDelete(req.params.id)
      .then((response) => {
        res.status(200).send({
          status: 200,
          message: "User deleted succesfully",
        });
      })
      .catch((err) => {
        if (err) {
          res.status(400).send({
            message: "error",
            data: err,
          });
        }
      });
  } catch (err) {
    res.status(400).send({
      message: "error",
      data: err.message,
    });
  }
};

module.exports = {
  initialPage,
  getAllUsers,
  getUserById,
  addNewUser,
  updateUser,
  deleteUser,
};
