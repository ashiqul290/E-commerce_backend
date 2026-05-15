const { orderAddController, orderCodController } = require("../../controllers/order.controller");

const cart = require("express").Router();

cart.post("/addcart", orderAddController);
cart.post("/orderCod", orderCodController);

module.exports = cart;