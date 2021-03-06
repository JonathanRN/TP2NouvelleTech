import Database from '../db/database'
import express from 'express'
let router = express.Router();
let app = express();
let db = new Database();

app.use(express.json());

router.get('/', function(req, res, next) {
    res.send('Home Page');
});

//Users
router.get('/users', function(req, res, next) {
    db.getUsers(function(){}, res);
});

router.post('/users/create', function(req, res, next){
    db.createUser(req.body, res, function(){});
});

router.post('/users/delete', function(req, res, next) {
    db.deleteUser(req.body.name, res);
});

router.post('/users/login', function(req, res, next) {
    db.userLogin(req.body, res, function(){});
});
////

//Leaderboard
router.get('/leaderboard', function(req, res, next) {
    db.getLeaderboard(res);
});

router.post('/leaderboard/add-score', function(req, res, next){
    db.addScoreToLeaderboard(req.body,function(){});
});
////

module.exports = router;