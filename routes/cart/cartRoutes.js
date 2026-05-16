const { orderCodController, addtoController, getAllOrdersController, orderOnlineController } = require("../../controllers/order.controller");

const cart = require("express").Router();

cart.post("/addcart", addtoController);
cart.post("/ordercod", orderCodController);

cart.get("/allorders",getAllOrdersController)

cart.post("/orderonline", orderOnlineController);

module.exports = cart;