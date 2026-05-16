const { orderCodController, addtoController, getAllOrdersController } = require("../../controllers/order.controller");

const cart = require("express").Router();

cart.post("/addcart", addtoController);
cart.post("/ordercod", orderCodController);

cart.get("/allorders",getAllOrdersController)

module.exports = cart;