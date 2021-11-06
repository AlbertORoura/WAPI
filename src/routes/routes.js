const router = require('express-promise-router')();

const {
    index,
    getAll,
    newWoman,
    restore,
    getWoman,
    replaceWoman,
    updateWoman,
    deleteWoman,
    newUser,
    notFound
} = require('../controllers/woman');

// const {
//     getAllUsers,
//     newUser,
//     getUser,
//     deleteUser,
//     UserNotFound
// } = require('../controllers/user');

router.get('/', index);
router.get('/api/women', getAll);
router.post('/api/woman', newWoman);
router.post('/api/user', newUser);
//router.post('/restore', restore);
router.put('/api/woman', restore);
router.get('/api/woman/:id', getWoman);
router.put('/api/woman/:id', replaceWoman);
router.patch('/api/woman/:id',updateWoman)
router.delete('/api/woman/:id', deleteWoman);
router.get(notFound);

module.exports = router;