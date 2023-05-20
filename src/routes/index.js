const initializeRoutes = (app) => {
  app.use("/user", require("./userRoutes"));
  app.use("/products", require("./productsRoutes"));
};

module.exports = initializeRoutes;
