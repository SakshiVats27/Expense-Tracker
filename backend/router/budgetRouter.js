const { getBudget, updateBudget, resetBudget } = require('../controller/budgetController');
const router = require('express').Router();
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.get('/getBudget', getBudget);
router.post('/updateBudget', updateBudget);
router.post('/resetBudget', resetBudget);

module.exports = router;