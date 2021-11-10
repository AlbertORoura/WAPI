const router = require('express-promise-router')();
const userExtractor = require('../middleware/userExtractor')

const {
    index,
    login,
    getAll,
    getAllUsers,
    newWoman,
    restore,
    getWoman,
    replaceWoman,
    updateWoman,
    deleteWoman,
    newUser,
    notFound
} = require('../controllers/woman');

router.get('/', index);
router.post('/api/login', login);
router.get('/api/women', userExtractor, getAll);
router.get('/api/users', getAllUsers);
router.post('/api/woman', userExtractor, newWoman);
router.post('/api/user', newUser);
//router.post('/restore', restore);
router.put('/api/woman', userExtractor, restore);
router.get('/api/woman/:id', userExtractor, getWoman);
router.put('/api/woman/:id', userExtractor, replaceWoman);
router.patch('/api/woman/:id', userExtractor, updateWoman)
router.delete('/api/woman/:id', userExtractor, deleteWoman);
router.get(notFound);

module.exports = router;