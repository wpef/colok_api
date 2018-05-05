var express = require('express');
var router = express.Router();

//Load controllers
var colokControl = require('../controllers/colok');

//Create Routes
//Create routes method
router
  .route('/')
  .get(colokControl.list_all)
  .post(colokControl.add);

router
  .route('/:colok_id')
  .get(colokControl.getBy_id)
  .patch(colokControl.update)
  .delete(colokControl.delete);

module.exports = router;
