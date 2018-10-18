import database from '../db/database'
import express from 'express'
let router = express.Router();
let app = express();

app.use(express.json());

router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

router.post('/', function(req, res, next){
    var db = new database();
    db.createUser(req.body, res);
});

module.exports = router;