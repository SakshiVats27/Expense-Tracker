const { getBudget, updateBudget } = require('../controller/budgetController');
const router = require('express').Router();
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.get('/getBudget', getBudget);
router.post('/updateBudget', updateBudget);

module.exports = router;