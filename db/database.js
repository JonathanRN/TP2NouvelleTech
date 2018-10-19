import mongoose from 'mongoose';
import User from './user';
import Score from './score';
import JsonValidator from './jsonValidator';
import EmailValidator from '../src/EmailValidator';

class Database {

    connectToDb()  {
        try {
            mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true });
            var db = mongoose.connection;
            db.on('error', console.error.bind(console, 'connection error:'));
            db.once('open', function() {
                console.log("Connected to DB!")
            });
        }
            catch (err) {
            console.log(err);
        }
    }

    connectToTestDb()  {
        try {
            mongoose.connect("mongodb://localhost:27017/tp2db_tests", { useNewUrlParser: true });
            var db = mongoose.connection;
            db.on('error', console.error.bind(console, 'connection error:'));
            db.once('open', function() {
                console.log("Connected to test DB!")
            });
        }
            catch (err) {
            console.log(err);
        }
    }

    createUser(userToAdd, callback) {
        let newUser = new User(userToAdd);
        let jsonValidator = new JsonValidator();
        let emailValidator = new EmailValidator();

        if (!jsonValidator.isUserValid(userToAdd)) {
            callback(false);
            return;
        }

        if (emailValidator.isEmailValid(userToAdd.email)) {
            User.findOne({ email: newUser.email }, function(err, result) {
                // result is true if the email exists.
                if (result) {
                        //routerRes.send(`The email ${newUser.email} already exists.`);
                        console.log(`The email ${newUser.email} already exists.`)
                        callback(false);
                } else {
                    newUser.save(function (err, newUser) {
                        if (err) return console.error(err);
                        //routerRes.send(`User: ${newUser.name} added!`);
                        console.log(`User: ${newUser.name} added!`)
                        callback(true);
                    });
                }
            });
        } else {
            console.log(`Invalid email ${userToAdd.email}, please verify again.`);
            callback(false);
        }
    }

    getUsers(routerRes){
        User.find(function(err, users){
            if(err) throw err;
            routerRes.json(users);
        })
    }

    deleteUser(name, routerRes){
        let query = {name: name};
        User.deleteOne(query, function(err, obj) {
            if (err) throw err;
            routerRes.send(obj);
          });
    }

    userLogin(body, callback){
        let query = {email: body.email};
        User.findOne(query, function(err, obj) {
            if (err) throw err;
            if(obj) {    
                if(obj.pwd == body.pwd) {
                    callback(true);
                } else {
                    //routerRes.send("Invalid Password");
                    console.log("Invalid Password");
                    callback(false);
                }
            } else {
                //routerRes.send("Invalid Email");
                console.log("Invalid Email");
                callback(false);
            }
          });
    }

    addScoreToLeaderboard(scoreToAdd, callback) {
        let jsonValidator = new JsonValidator();

        if (!jsonValidator.isScoreValid(scoreToAdd)){
            callback(false);
            return;
        }

        this.userLogin(scoreToAdd, (userExists) => {
            if (userExists && scoreToAdd.score >= 0) {
                User.findOne({email: scoreToAdd.email}, function(err, result) {
                    if (err) throw err; 
                    let newScore = new Score({name: result.name, score: scoreToAdd.score});
        
                    newScore.save(function (err, newScore) {
                        if (err) return console.error(err);
                        //routerRes.send(`Score ${newScore.score} of email ${scoreToAdd.email} added to leaderboard.`);
                        console.log(`Score ${newScore.score} of email ${scoreToAdd.email} added to leaderboard.`);
                        callback(true);
                    });
                });
            } else {
                callback(false);
            }
        });
    }

    getLeaderboard(routerRes) {
        Score.find(function(err, users){
            if(err) throw err;
            routerRes.json(users);
        })
    }
}

export default Database;