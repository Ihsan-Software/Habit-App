const express = require('express');
const focusController = require('../controllers/focusController')
const authController = require('../controllers/authController')

const router = express.Router();

router.use(authController.protect_)

router.route('/getMyFocus/').get(focusController.getMyFocus);
router.route('/createFocus').post(focusController.createFocus);
router.route('/getAllFocus/userID').get(focusController.getFocuss);
router.route('/deleteMyFocus/:userID').delete(focusController.deleteFocus);


router.use(authController.restrictTo('admin'))

router.route('/getAllFocus').get(focusController.getFocuss);
router.route('/getFocus/:id').get(focusController.getFocus)
router.route('/deleteFocus/:id').delete(focusController.deleteFocus);
router.route('/updateFocus/:id').patch(focusController.updateFocus);



module.exports = router;