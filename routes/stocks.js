var express = require('express');
var router = express.Router();

// Controller
var stockController = require('../controllers/stockController');

router.get('/', stockController.index);

router.get('/getStock', stockController.getStock);

router.post('/searchStock', stockController.searchStock)


module.exports = router;