const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/SkellyServices', {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
var User
db.once('open', function() {
  // we're connected!
  const userSchema = new mongoose.Schema({
    githubId: String,
    discordId: String,
    googleId: String,
    twitterId: String,
    primaryEmail: String,
    githubEmail: String,
    discordEmail: String,
    googleEmail: String,
    twitterEmail: String,
    VCP: Boolean,
    Patron: Boolean,
    Salad: Boolean,
    LinkedAccounts: Array,
    tokens: Object,
    username: String
  });
  User = mongoose.model('User', userSchema);
});


function findOrCreate(service, profile, callback) {
    switch (service) {
        case "google":
            User.countDocuments({googleId:profile.id},function(err, res){
                if (res) {
                    return User.find({googleId:profile.id}, function(err, user) {
                        if(!err) callback(user)
                        if(err) console.log(err)
                    })
                } else {
                    let user = new User({
                        googleId:profile.id,
                        googleEmail:profile.emails[0].value,
                        primaryEmail:profile.emails[0].value,
                        LinkedAccounts: ["google"],
                        username:profile.emails[0].value
                    })
                    user.save(function (err, user) {
                        if (err) return console.error(err);
                        callback(user)
                      });
                }
            })
        break;
        case "twitter":
            User.countDocuments({twitterId:profile.id},function(err, res){
                if (res) {
                    return User.find({twitterId:profile.id}, function(err, user) {
                        if(!err) callback(user)
                        if(err) console.log(err)
                    })
                } else {
                    let user = new User({
                        twitterId:profile.id,
                        twitterEmail:profile.emails[0].value,
                        primaryEmail:profile.emails[0].value,
                        LinkedAccounts: ["twitter"],
                        username:profile.emails[0].value
                    })
                    user.save(function (err, user) {
                        if (err) return console.error(err);
                        callback(user)
                      });
                }
            })
        break;
        case "github":
            User.countDocuments({githubId:profile.id},function(err, res){
                if (res) {
                    return User.find({githubId:profile.id}, function(err, user) {
                        if(!err) callback(user)
                        if(err) console.log(err)
                    })
                } else {
                    let user = new User({
                        githubId:profile.id,
                        githubEmail:profile.email,
                        primaryEmail:profile.email,
                        LinkedAccounts: ["github"],
                        username:profile.email
                    })
                    user.save(function (err, user) {
                        if (err) return console.error(err);
                        callback(user)
                      });
                }
            })
        break;
        case "discord":
            User.countDocuments({discordId:profile.id},function(err, res){
                if (res) {
                    User.findOne({discordId:profile.id}, function (err, doc) {
                        if(err) throw err;
                        doc.VCP = profile.VCP;
                        doc.save().then(savedDoc => {
                            return callback(savedDoc)
                          });
                    })
                } else {
                    let user = new User({
                        discordId:profile.id,
                        discordEmail:profile.email,
                        primaryEmail:profile.email,
                        LinkedAccounts: ["discord"],
                        username:profile.email,
                        VCP: profile.VCP
                    })
                    user.save(function (err, user) {
                        if (err) return console.error(err);
                        callback(user)
                      });
                }
            })
    }
}

function changeUsername(user, newUsername) {
    if (user._id) {
    User.findById({_id: user._id}, function (err, doc) {
        if(err) throw err;
        doc.username = newUsername
        doc.save()
    })
} else {
    User.findById({_id: user[0]._id}, function (err, doc) {
        if(err) throw err;
        doc.username = newUsername
        doc.save()
    })
}
}

function addVCP(user) {

}

function addSalad(user) {

}

module.exports = {
    findOrCreate: findOrCreate,
    changeUsername: changeUsername,
    addVCP: addVCP,
    addSalad: addSalad
}