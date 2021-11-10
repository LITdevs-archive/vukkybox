const mongoose = require('mongoose');
require("dotenv").config();
const boxJson = require("./public/boxes.json")
function nocache(module) {require("fs").watchFile(require("path").resolve(module), () => {delete require.cache[require.resolve(module)]})}
nocache("./public/vukkies.json")
const vukkyJson = require("./public/vukkies.json")
mongoose.connect(process.env.MONGODB_HOST, {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
var User
var Code
db.once('open', function() {
  const userSchema = new mongoose.Schema({
	githubId: String,
	discordId: String,
	mediawikiId: String,
	googleId: String,
	twitterId: String,
	primaryEmail: String,
	githubEmail: String,
	discordEmail: String,
	googleEmail: String,
	LinkedAccounts: Array,
	twitterEmail: String,
	mediawikiEmail: String,
	username: String,
	balance: Number,
	gallery: Array
  });
  User = mongoose.model('User', userSchema);
  const codeSchema = new mongoose.Schema({
	code: String,
	amount: Number,
	redeemedBy: String,
	used: Boolean
  });
  Code = mongoose.model('Code', codeSchema);
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
						balance: 100,
						username:profile.emails[0].value
					})
					user.save(function (err, user) {
						if (err) return console.error(err);
						callback(user)
					  });
				}
			})
		break;
		case "mediawiki":
			User.countDocuments({mediawikiId:profile.id},function(err, res){
				if (res) {
					return User.find({mediawikiId:profile.id}, function(err, user) {
						if(!err) callback(user)
						if(err) console.log(err)
					})
				} else {
					let user = new User({
						mediawikiId:profile.id,
						mediawikiEmail:profile._json.email,
						primaryEmail:profile._json.email,
						LinkedAccounts: ["mediawiki"],
						balance: 100,
						username:profile.displayName
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
						balance: 100,
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
						balance: 100,
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
						balance: 100,
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

function addToGallery(user, id) {

}

function getBalance(user, callback) {

}

function setBalance(user, callback) {

}

function redeemCode(user, code, callback) { // callback with a boolean representing if the code was used successfully
	Code.findOne({code:code}, function (err, code) {
		if(err) {
			callback(false)
			return console.log(err)
		};
		if(code) {
		if(!code.used) {
			code.used = true;
			if(user._id) {
				code.redeemedBy = user._id;
			} else {
				code.redeemedBy = user[0]._id;
			}
			code.save().then(savedCode => {
				if (user._id) {
					User.findById({_id: user._id}, function (err, doc) {
						if(err) {
							callback(false, null)
							console.log(err)
						};
						doc.balance += savedCode.amount;
						doc.save()
						callback(true, savedCode.amount)
					})
				} else {
					User.findById({_id: user[0]._id}, function (err, doc) {
						if(err) {
							callback(false, null)
							console.log(err)
						};
						doc.balance += savedCode.amount;
						doc.save()
						callback(true, savedCode.amount)
					})
				}
			});
		} else {
			callback(false, null)
		}
		} else {
			callback(false,null)
		}
	});
}

function validCode(code, callback) { // callback with a boolean representing if the code is valid or not. (used codes are not valid)
	Code.findOne({code: code}, function (err, code) {
		if(!code) return callback("invalid")
		if(code.used) return callback("used")
		if(!code.used) return callback("valid") 
	});
}

function buyBox(user, box, callback) {
	let boxData = boxJson[box]
	if (user._id) {
		User.findById({_id: user._id}, function (err, doc) {
			if(err) {
				callback({"box":"error"}, null, null, null)
				console.log(err)
			};
			if(doc.balance >= boxData.price) {
				doc.balance -= boxData.price;
				openBox(box, res => {
					let dupe = false;
					if(!doc.gallery.includes(res.vukkyId)) {
						doc.gallery.push(res.vukkyId)
					} else {
						dupe = true;
						doc.balance += 0.1 * boxData.price;
					}
					doc.save()
					callback({"box":res, "error": null}, doc.balance, doc.gallery, dupe)
				})
			} else {
				callback({"box":null, "error":"not enough funds"}, doc.balance, null, null)
			}
		})
	} else {
		User.findById({_id: user[0]._id}, function (err, doc) {
			if(err) {
				callback({"box":"error"}, null, null, null)
				console.log(err)
			};
			if(doc.balance >= boxData.price) {
				doc.balance -= boxData.price;
				openBox(box, res => {
					let dupe = false;
					if(!doc.gallery.includes(res.vukkyId)) {
						doc.gallery.push(res.vukkyId)
					} else {
						dupe = true
					}
					doc.save()
					callback({"box":res, "error": null}, doc.balance, doc.gallery, dupe)
				})
			} else {
				callback({"box":null, "error":"not enough funds"}, doc.balance, null, null)
			}
		})
	}
}

function openBox(boxname, callback) {
	let boxData = boxJson[boxname]
	const probabilities = boxData.levels  
	const level = () => {
		const random = Math.random();
		let threshold = 1;
		
		for (let [level, percentage] of Object.entries(probabilities)) {
		  threshold = threshold - (percentage / 100);
		  
		  if (random >= threshold) {
			return level;
		  }
		}
	}
	const vukkyLevel = level()
	let vukkyData = vukkyJson.rarity[vukkyLevel.toString()]
	let vukkyKeys = Object.keys(vukkyData)
	const vukky = () => {
		if (vukkyLevel != 7) {
			return vukkyData[vukkyKeys[vukkyKeys.length * Math.random() << 0]]
		} else {
			return vukkyData[boxData.uniques[Math.floor(Math.random() * boxData.uniques.length)].toString()]
		}
	}
	let theVukky = vukky()
	callback({vukky: theVukky, level: vukkyJson.levels[vukkyLevel.toString()], vukkyId: getKeyByValue(vukkyData, theVukky)})

}

function getKeyByValue(object, value) {
	return Object.keys(object).find(key => object[key] === value);
  }

function createCode(code, amount, callback) {
	if(code.length < 1 || amount.length < 1) return callback(null, "invalid arguments")
	let newCode = new Code({
		code: code,
		amount: amount,
		used: false
	})
	newCode.save()
	return callback({code: code, amount: amount}, null)
}

function getUser(userId, callback) {
	User.findById({_id: userId}, function (err, doc) {
		if(err) {
			callback(null, err)
			console.log(err)
		};
		callback(doc, null)
	})
}

module.exports = {
	findOrCreate: findOrCreate,
	changeUsername: changeUsername,
	addToGallery: addToGallery,
	getBalance: getBalance,
	setBalance: setBalance,
	redeemCode: redeemCode,
	createCode: createCode,
	validCode: validCode,
	buyBox: buyBox,
	getUser: getUser
}