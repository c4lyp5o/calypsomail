const express = require('express');
const router = express.Router();
const ourController = require('./controller');

router.get('/', ourController.thisIsHome);
router.post('/', ourController.welcomeHome);
router.get('/test', ourController.getMail);
router.get('/test/:id', ourController.get1Mail);
router.get('/test2', ourController.saveData);
router.get('/test3', ourController.useRedis);
router.get('/test4', ourController.anotherGo);
router.get('/test5', ourController.nodeCx);
router.get('/test6', ourController.fromnodeCx);

module.exports = router;