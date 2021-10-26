const router = require('express-promise-router')();

const {
    index,
    newUser,
    restore,
    getUser,
    replaceUser,
    deleteUser
} = require('../controllers/user');

router.get('/', index)
router.post('/', newUser)
//router.post('/restore', restore)
router.put('/', restore)
router.get('/:id', getUser)
router.put('/:id', replaceUser)
router.delete('/:id', deleteUser)

module.exports = router;