const router = require('express-promise-router')();

const {
    index,
    getAll,
    newUser,
    restore,
    getUser,
    replaceUser,
    deleteUser,
    notFound
} = require('../controllers/user');

router.get('/', index);
router.get('/api/women', getAll);
router.post('/api/woman', newUser);
//router.post('/restore', restore);
router.put('/api/woman', restore);
router.get('/api/woman/:id', getUser);
router.put('/api/woman/:id', replaceUser);
router.delete('/api/woman/:id', deleteUser);

module.exports = router;