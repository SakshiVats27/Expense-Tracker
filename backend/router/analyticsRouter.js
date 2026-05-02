const { getAdvancedAnalytics } = require('../controller/analyticsController');
const router = require('express').Router();
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.get('/advanced', getAdvancedAnalytics);

module.exports = router;