const router = require('express-promise-router')();

const {
    index,
    getAll,
    newUser,
    restore,
    getUser,
    replaceUser,
    updateUser,
    deleteUser,
    notFound
} = require('../controllers/woman');

router.get('/', index);
router.get('/api/women', getAll);
router.post('/api/woman', newUser);
//router.post('/restore', restore);
router.put('/api/woman', restore);
router.get('/api/woman/:id', getUser);
router.put('/api/woman/:id', replaceUser);
router.patch('/api/woman/:id',updateUser)
router.delete('/api/woman/:id', deleteUser);
router.get(notFound);

module.exports = router;