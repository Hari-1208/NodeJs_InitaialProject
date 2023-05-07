const express = require("express");
const validation = require("./src/validation");

const app = express();

app.use(express.json());

const datasArr = [];

app.get("/", (req, res) => {
  res.send("Basic Curd Operation in Nodejs");
});

app.get("/api/getData", (req, res) => {
  res
    .status(200)
    .send({ status: 200, message: "Datas Listed succesfully", data: datasArr });
});

//get item by id
app.get("/api/getData/:id", (req, res) => {
  const item = datasArr.find((item) => item.id === req.params.id);
  if (!item)
    return res.status(404).send({
      status: 404,
      message: "Item with given ID is not fuond!",
    });
  res
    .status(200)
    .send({ status: 200, message: "Data fetched succesfully", data: item });
});

//post method for add a new item
app.post("/api/addData", (req, res) => {
  // input joi validation
  const validate = validation("POST_DATA_VALIDATE", req.body);
  const { error } = validate;
  //bad request
  if (error)
    return res.status(400).send({
      status: 400,
      message: error.details[0].message,
    });

  //add the item
  const newItem = {
    id: `id_${Date.now()}`,
    name: req.body.name,
  };
  datasArr.push(newItem);
  res.status(200).send({
    status: 200,
    message: "Data added succesfully",
    data: datasArr,
  });
});

//PUT method to update a existing item
app.put("/api/updateData/:id", (req, res) => {
  // look for the item if its not retuen 404 object not fount
  const item = datasArr.find((item) => item.id === req.params.id);
  if (!item)
    return res.status(404).send({
      status: 404,
      message: "Item with given ID is not fuond!",
    });

  // input joi validation
  const validate = validation("UPDATE_DATA_VALIDATE", req.body);
  const { error } = validate;
  //bad request
  if (error)
    return res.status(400).send({
      status: 400,
      message: error.details[0].message,
    });

  //upadate the item
  item.name = req.body.name;
  res.status(200).send({
    status: 200,
    message: "Data updated succesfully",
    data: datasArr,
  });
});

// delete method to delete item by id
app.delete("/api/deleteData/:id", (req, res) => {
  // look for the item if its not retuen 404 object not fount
  const item = datasArr.find((item) => item.id === req.params.id);
  if (!item)
    return res.status(404).send({
      status: 404,
      message: "Item with given ID is not fuond!",
    });

  //delete item
  const itemIndex = datasArr.indexOf(item);
  datasArr.splice(itemIndex, 1);
  res.status(200).send({
    status: 200,
    message: "Data deleted succesfully",
    data: datasArr,
  });
});

// PORT
const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Listening on port ${port}...`));
