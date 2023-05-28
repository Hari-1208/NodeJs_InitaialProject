const initializeRoutes = (app) => {
  app.use("/user", require("./userRoutes"));
  app.use("/products", require("./productsRoutes"));
  app.use("/order", require("./orderRoutes"));
};

module.exports = initializeRoutes;
