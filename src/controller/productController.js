const xlsx = require("xlsx");
//getting the models
const models = require("../dataBase/models");
//Getting schema collection
const productsSchema = models.products;

const productsBulkUpload = async (req, res) => {
  try {
    //read file from its path
    const file = xlsx.readFile(req.body.filePath);

    //extract the data in sheet
    const sheet = file.Sheets[file.SheetNames[0]];

    //convert sheet into json
    const file_to_json = xlsx.utils.sheet_to_json(sheet);

    // check file is exist and also not empty
    if (!Boolean(file_to_json) || file_to_json.length == 0) {
      return res.status(201).send({
        status: 201,
        data: "No data found in the file!",
      });
    }

    let convertedDataToSchemaKeys = [];
    const dbData = await productsSchema.find();
    file_to_json.map((item) => {
      let obj = new Object();
      obj.no = item["S.No"];
      obj.productName = item["Product Name"];
      obj.productCode = item["Product Code"];
      obj.strength = item["Strength"];
      obj.dosageForm = item["Dosage Form"];
      obj.packingForm = item["Packing Form"];
      obj.packingDetails = item["Packing Details"];
      obj.packingSize = item["Packing Size"];
      obj.weight = item["Weight"];
      obj.care_Yes_No = item["Care (Yes/No)"];
      obj.salt = item["Salt"];
      obj.saltGroup = item["Salt Group"];
      obj.speciality = item["Speciality"];
      obj.condition = item["Condition"];
      obj.manufacturer = item["Manufacturer"];
      obj.mrp = item["MRP"];
      obj.MRMEDPrice = item["MRMED Price"];
      obj.tax_percent = item["Tax %"];
      obj.prescription_Yes_No = item["Prescription (Yes/No)"];
      obj.PAP_Yes_No = item["PAP (Yes/No)"];
      obj.PAPOffer = item["PAP Offer"];
      obj.countryOrigin = item["Country Origin"];
      obj.imageURL = item["Image URL"];
      obj.ABCD = item["ABCD"];
      obj.HSN = item["HSN"];
      obj.stock = item["Stock"];
      obj.coupon_Yes_No = item["Coupon (Yes/No)"];
      obj.cash_Yes_No = item["Cash (Yes/No)"];
      obj.hidden_Yes_No = item["Hidden (Yes/No)"];

      const isPresent =
        dbData.filter((dbItem) => dbItem.productCode !== obj.productCode)
          .length > 0;
      !isPresent && convertedDataToSchemaKeys.push(obj);
    });

    //check for duplicate data
    if (convertedDataToSchemaKeys.length == 0) {
      return res.status(201).send({
        status: 201,
        data: "Datas in this file is already added !",
      });
    }

    // upload datas to DataBase
    await productsSchema
      .insertMany(convertedDataToSchemaKeys)
      .then((response) => {
        if (response.length > 0) {
          return res.status(200).send({
            status: 200,
            message: `${response.length} items added successfully!`,
          });
        }
      });
  } catch (error) {
    res.status(400).send({
      status: 400,
      data: error.message,
    });
  }
};

module.exports = {
  productsBulkUpload,
};
