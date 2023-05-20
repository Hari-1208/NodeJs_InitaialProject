const initializeRoutes = (app) => {
  app.use("/user", require("./userRoutes"));
};

module.exports = initializeRoutes;
