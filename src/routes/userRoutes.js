const express = require("express");
const userRoutes = express.Router();
const validation = require("../validation");

//getting the models
const models = require("../dataBase/models");
const { user } = require("../dataBase/schemas");
//Getting schema collection
const userSchema = models.user;

const datasArr = [];
// send sample msg when entered
userRoutes.get("/", async (req, res) => {
  res.send("Basic Curd Operation in Nodejs");
});

//get all user data
userRoutes.get("/api/getData", async (req, res) => {
  try {
    const response = await userSchema.find();
    res.status(200).send({
      status: 200,
      message: "Datas Listed succesfully",
      data: response,
    });
  } catch (err) {
    res.send({
      status: 404,
      message: "Error",
      data: err,
    });
  }
});

//get item by id
userRoutes.get("/api/getDataById", async (req, res) => {
  try {
    //finding particular data in db using id
    const item = await userSchema.findById(req.query.id);
    res
      .status(200)
      .send({ status: 200, message: "Data fetched succesfully", data: item });
  } catch (err) {
    res.send({
      status: 404,
      message: "Item with given ID is not fuond!",
      data: err,
    });
  }
});

//post method for add a new item
userRoutes.post("/api/addData", async (req, res) => {
  const newUser = new userSchema({
    name: req.body.name,
    mobileNumber: req.body.mobileNumber,
  });

  try {
    const dbData = await userSchema.find();

    let filteredItem = dbData.find((item) => {
      return (
        parseInt(item.mobileNumber) === parseInt(req.body.mobileNumber) && item
      );
    });
    if (Boolean(filteredItem))
      return res.status(400).send({
        status: 400,
        message: "Mobile number already exist!",
      });
    const addedUser = await newUser.save();
    res.status(200).send({
      status: 200,
      message: "Data added succesfully",
      data: addedUser,
    });
  } catch (err) {
    res.send({
      status: 400,
      message: "Bad Request",
      data: err.message,
    });
  }
});

//PUT method to update a existing item
userRoutes.put("/api/updateData/:id", async (req, res) => {
  try {
    // look for the item if its not retuen 404 object not fount
    const item = await userSchema.findById(req.params.id);
    if (!item)
      return res.status(404).send({
        status: 404,
        message: "Item with given ID is not fuond!",
      });

    // update item
    userSchema
      .findByIdAndUpdate(req.params.id, req.body)
      .then((response) => {
        res.status(200).send({
          status: 200,
          message: "Data updated succesfully",
        });
      })
      .catch((err) => {
        if (err) {
          res.send({
            message: "error",
            data: err,
          });
        }
      });
  } catch (err) {
    res.send({
      message: "error",
      data: err.message,
    });
  }
});

// delete method to delete item by id
userRoutes.delete("/api/deleteData/:id", async (req, res) => {
  try {
    // look for the item if its not retuen 404 object not fount
    const item = await userSchema.findById(req.params.id);
    if (!item)
      return res.status(404).send({
        status: 404,
        message: "Item with given ID is not fuond!",
      });

    //delete item
    userSchema
      .findByIdAndDelete(req.params.id)
      .then((response) => {
        res.status(200).send({
          status: 200,
          message: "Data deleted succesfully",
        });
      })
      .catch((err) => {
        if (err) {
          res.send({
            message: "error",
            data: err,
          });
        }
      });
  } catch (err) {
    res.send({
      message: "error",
      data: err.message,
    });
  }
});

module.exports = userRoutes;
