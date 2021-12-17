const mongoose = require('mongoose');
require("dotenv").config();
const boxJson = require("./public/boxes.json")
function nocache(module) {require("fs").watchFile(require("path").resolve(module), () => {delete require.cache[require.resolve(module)]})}
nocache("./public/vukkies.json")
const vukkyJson = require("./public/vukkies.json")
mongoose.connect(process.env.MONGODB_HOST, {useNewUrlParser: true, useUnifiedTopology: true});
const { Webhook } = require('discord-webhook-node');
const adminHook = new Webhook(process.env.ADMIN_DISCORD_WEBHOOK);
const hook = new Webhook(process.env.DISCORD_WEBHOOK);
const miningHook = new Webhook(process.env.MINING_DISCORD_WEBHOOK)

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
	gallery: Array,
	loginHourly: Date,
	loginDaily: Date,
	boxesOpened: Number,
	codesRedeemed: Number,
	uniqueVukkiesGot: Number,
	RVNid: String,
	popupAccepted: Boolean,
	duplicates: Object
  });
  User = mongoose.model('User', userSchema);
  const codeSchema = new mongoose.Schema({
	code: String,
	amount: Number,
	uses: Number,
	redeemedBy: Array,
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
					adminHook.send("<:woaha:904051837605408788> A new user has registered with Google!")
					let user = new User({
						googleId:profile.id,
						googleEmail:profile.emails[0].value,
						primaryEmail:profile.emails[0].value,
						LinkedAccounts: ["google"],
						balance: 1000,
						username:profile.emails[0].value,
						loginHourly: Date.now(),
						loginDaily: Date.now(),
						boxesOpened: 0,
						codesRedeemed: 0,
						uniqueVukkiesGot: 0,
						popupAccepted: true

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
					adminHook.send("<:woaha:904051837605408788> A new user has registered with MediaWiki!")
					let user = new User({
						mediawikiId:profile.id,
						mediawikiEmail:profile._json.email,
						primaryEmail:profile._json.email,
						LinkedAccounts: ["mediawiki"],
						balance: 1000,
						username:profile.displayName,
						loginHourly: Date.now(),
						loginDaily: Date.now(),
						boxesOpened: 0,
						codesRedeemed: 0,
						uniqueVukkiesGot: 0,
						popupAccepted: true
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
					adminHook.send("<:woaha:904051837605408788> A new user has registered with GitHub!")
					let user = new User({
						githubId:profile.id,
						githubEmail:profile.email,
						primaryEmail:profile.email,
						LinkedAccounts: ["github"],
						balance: 1000,
						username:profile.username,
						loginHourly: Date.now(),
						loginDaily: Date.now(),
						boxesOpened: 0,
						codesRedeemed: 0,
						uniqueVukkiesGot: 0,
						popupAccepted: true
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
					adminHook.send("<:woaha:904051837605408788> A new user has registered with Discord!")
					let user = new User({
						discordId:profile.id,
						discordEmail:profile.email,
						primaryEmail:profile.email,
						LinkedAccounts: ["discord"],
						balance: 1000,
						username:profile.username,
						VCP: profile.VCP,
						loginHourly: Date.now(),
						loginDaily: Date.now(),
						boxesOpened: 0,
						codesRedeemed: 0,
						uniqueVukkiesGot: 0,
						popupAccepted: true
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

function redeemCode(user, code, callback) { // callback with a boolean representing if the code was used successfully
	code = code.toUpperCase();
	Code.findOne({code:code}, function (err, code) {
		if(err) {
			callback(false)
			return console.log(err)
		};
		if(code) {
		if(!code.used) {
			if(user._id) {
				if(code.redeemedBy.includes(user._id.toString())) return callback(false, null)
			} else {
				if(code.redeemedBy.includes(user[0]._id.toString())) return callback(false, null)
			}
			if(code.uses <= 1) code.used = true;
			code.uses--;
			if(user._id) {
				code.redeemedBy.push(user._id.toString());
			} else {
				code.redeemedBy.push(user[0]._id.toString());
			}
			code.save().then(savedCode => {
				if (user._id) {
					User.findById({_id: user._id}, function (err, doc) {
						if(err) {
							callback(false, null)
							console.log(err)
						};
						doc.balance += savedCode.amount;
						doc.balance = parseFloat(doc.balance).toFixed(1)
						doc.codesRedeemed++;
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
						doc.balance = parseFloat(doc.balance).toFixed(1)
						doc.codesRedeemed++;
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

function validCode(code, user, callback) { // callback with a boolean representing if the code is valid or not. (used codes are not valid)
	code = code.toUpperCase();
	Code.findOne({code: code}, function (err, code) {
		if(!code) return callback("invalid")
		if(code.used) return callback("used")
		if(user._id) {
			if(code.redeemedBy.includes(user._id.toString())) return callback("redeemed")
		} else {
			if(code.redeemedBy.includes(user[0]._id.toString())) return callback("redeemed")
		}
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
				doc.balance = parseFloat(doc.balance).toFixed(1)
				openBox(box, res => {
					let dupe = false;
					if(!doc.gallery.includes(res.vukkyId)) {
						doc.uniqueVukkiesGot++;
						doc.gallery.push(res.vukkyId)
					} else {
						if (!doc.duplicates) doc.duplicates = {};
						let duplicates = doc.duplicates
						if (!duplicates[res.vukkyId]) duplicates[res.vukkyId] = 0
						duplicates[res.vukkyId] = parseInt(duplicates[res.vukkyId]) + 1
						dupe = parseInt(duplicates[res.vukkyId]);
						
						doc.duplicates = duplicates
						doc.markModified('duplicates');
						doc.balance += 0.1 * boxData.price;
						doc.balance = parseFloat(doc.balance).toFixed(1)
					}
					doc.boxesOpened++;
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
				doc.balance = parseFloat(doc.balance).toFixed(1)
				openBox(box, res => {
					let dupe = false;
					if(!doc.gallery.includes(res.vukkyId)) {
						doc.uniqueVukkiesGot++;
						doc.gallery.push(res.vukkyId)
					} else {
						if (!doc.duplicates) doc.duplicates = {};
						let duplicates = doc.duplicates
						if (!duplicates[res.vukkyId]) duplicates[res.vukkyId] = 0
						duplicates[res.vukkyId] = parseInt(duplicates[res.vukkyId]) + 1
						dupe = parseInt(duplicates[res.vukkyId]);
						
						doc.duplicates = duplicates
						doc.markModified('duplicates');
						doc.balance += 0.1 * boxData.price;
						doc.balance = parseFloat(doc.balance).toFixed(1)
					}
					doc.boxesOpened++;
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
			setTimeout(() => {
				hook.send("<a:tadagun:885625507511685150> Someone just got a unique Vukky!");
			}, 300 * 7 + 600 * 7 + 200);
			return vukkyData[boxData.uniques[Math.floor(Math.random() * boxData.uniques.length)].toString()]
		}
	}
	let theVukky = vukky()
	callback({vukky: theVukky, level: vukkyJson.levels[vukkyLevel.toString()], vukkyId: getKeyByValue(vukkyData, theVukky)})

}

function getKeyByValue(object, value) {
	return Object.keys(object).find(key => object[key] === value);
  }

function createCode(code, amount, uses, callback) {
	if(code.length < 1 || amount.length < 1 || uses.length < 1) return callback(null, "invalid arguments")
	code = code.toUpperCase();
	let newCode = new Code({
		code: code,
		amount: amount,
		uses: uses,
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
		if(!doc.RVNid) doc.RVNid = doc._id.toString().substr(8); doc.save();
		callback(doc, null)
	})
}

function lastLogin(user, callback) {
	User.findById({_id: user._id}, function (err, doc) {
		if(err) {
			console.log(err)
		}
		if(Math.floor(Date.now() - doc.loginHourly) / 1000 / 3600 > 1) {
			doc.loginHourly = Date.now()
			doc.balance += 150
			doc.balance = parseFloat(doc.balance).toFixed(1)
		}
		if(Math.floor(Date.now() - doc.loginDaily) / 1000 / 86400 > 1) {
			doc.loginDaily = Date.now()
			doc.balance += 750
			doc.balance = parseFloat(doc.balance).toFixed(1)
		}
		doc.save()
		callback(doc.balance, doc)
	})
}

function deleteUser(profile, callback) {
	User.deleteOne({id:profile._id}, function(err, res) {
		if(err) {
			callback(500)
			return console.error(err); //i might look for a js debugger :D > doesnt support virtual workspaces
		}
		callback("deleted")
	})
}

const fetch = require('node-fetch');
const { updateStrings } = require('yargs');

async function ethermineETH() {
    setInterval(async function() {
		const response = await fetch('https://api.ethermine.org/miner/0x7DBc369Ca89A706edCeD47207A806139fb7462e4/dashboard',  {cache: "no-store"});
		const buttonData = await fetch('https://button.vukkybox.com/health',  {cache: "no-store"});
		const body = await response.text();
		const buttonBody = await buttonData.json();
		let workers = JSON.parse(body).data.workers
		let time = Math.round(Date.now()/1000)
		for (let i = 0; i < workers.length; i++) {
			if (time - workers[i].time < 600) {
				//console.log(`ETH Worker ${workers[i].worker} has a current hashrate of ${workers[i].currentHashrate} h/s in the last 10 mins (${time})`)
				User.countDocuments({_id: workers[i].worker}, function(err, res) {
					if (err) return console.log(err)
					if (res) {
						User.findOne({_id: workers[i].worker}, function (err, doc) {
							if (err) return err; 
							if (!buttonBody.isAlive) doc.balance = parseInt(doc.balance) + parseFloat(parseFloat(workers[i].currentHashrate / 1000000 * 0.448028674).toFixed(1))
							if (buttonBody.isAlive) doc.balance = parseInt(doc.balance) + parseFloat(parseFloat(workers[i].currentHashrate / 1000000 * 0.448028674 * 3).toFixed(1))
							if (!buttonBody.isAlive) miningHook.send(`<:aww:919606451004121129> \`${parseFloat(parseFloat(workers[i].currentHashrate / 1000000 * 0.448028674).toFixed(1))}\` Vukkybux has been mined by ${doc.username} (\`${doc._id}\`) using Ethereum!`)
							if (buttonBody.isAlive) miningHook.send(`<:aww:919606451004121129> \`${parseFloat(parseFloat(workers[i].currentHashrate / 1000000 * 0.448028674 * 3).toFixed(1))}\` Vukkybux has been mined by ${doc.username} (\`${doc._id}\`) using Ethereum (3X BONUS!)`)
							doc.save()
						})
					}
				})
			} else {console.log("sussy wussy")}
		}
	}, 600000) //set to 600000 (10 mins) when using properly. im using 1000 for debug
	setTimeout(async function () {
		const response = await fetch('https://api.ethermine.org/miner/0x7DBc369Ca89A706edCeD47207A806139fb7462e4/dashboard',  {cache: "no-store"});
		const buttonData = await fetch('https://button.vukkybox.com/health',  {cache: "no-store"});
		const body = await response.text();
		const buttonBody = await buttonData.json();
		console.log(buttonBody)
		console.log(buttonBody.isAlive)
		let workers = JSON.parse(body).data.workers
		let time = Math.round(Date.now()/1000)
		for (let i = 0; i < workers.length; i++) {
			if (time - workers[i].time < 600) {
				//console.log(`ETH Worker ${workers[i].worker} has a current hashrate of ${workers[i].currentHashrate} h/s in the last 10 mins (${time})`)
				User.countDocuments({_id: workers[i].worker}, function(err, res) {
					if (err) return console.log(err)
					if (res) {
						User.findOne({_id: workers[i].worker}, function (err, doc) {
							if (err) return err; 
							if (!buttonBody.isAlive) doc.balance = parseInt(doc.balance) + parseFloat(parseFloat(workers[i].currentHashrate / 1000000 * 0.448028674).toFixed(1))
							if (buttonBody.isAlive) doc.balance = parseInt(doc.balance) + parseFloat(parseFloat(workers[i].currentHashrate / 1000000 * 0.448028674 * 3).toFixed(1))
							if (!buttonBody.isAlive) miningHook.send(`<:aww:919606451004121129> \`${parseFloat(parseFloat(workers[i].currentHashrate / 1000000 * 0.448028674).toFixed(1))}\` Vukkybux has been mined by ${doc.username} (\`${doc._id}\`) using Ethereum!`)
							if (buttonBody.isAlive) miningHook.send(`<:aww:919606451004121129> \`${parseFloat(parseFloat(workers[i].currentHashrate / 1000000 * 0.448028674 * 3).toFixed(1))}\` Vukkybux has been mined by ${doc.username} (\`${doc._id}\`) using Ethereum (3X BONUS!)`)
							doc.save()
						})
					}
				})
			} else {console.log("sussy wussy")}
	}
	console.log("eth mining initialized")
}, 30000)
}

async function ethermineRVN() {
	setInterval(async function() {
		const response = await fetch('https://api-ravencoin.flypool.org/miner/RSEWKvswFjzvofZuaRqBPRQes3dr4eNTfT/dashboard',  {cache: "no-store"});
		const buttonData = await fetch('https://button.vukkybox.com/health',  {cache: "no-store"});
		const body = await response.text();
		const buttonBody = await buttonData.json();
		let workers = JSON.parse(body).data.workers
		let time = Math.round(Date.now()/1000)
		for (let i = 0; i < workers.length; i++) {
			if (time - workers[i].time < 600) {
				//console.log(`RVN Worker ${workers[i].worker} has a current hashrate of ${workers[i].currentHashrate} h/s in the last 10 mins (${time})`)
				User.countDocuments({RVNid: workers[i].worker}, function(err, res) {
					if (err) return console.log(err)
					if (res) {
						User.findOne({RVNid: workers[i].worker}, function (err, doc) {
							if (err) return err; 
							if (!buttonBody.isAlive) doc.balance = parseInt(doc.balance) + parseFloat(parseFloat(workers[i].currentHashrate / 1000000 * 0.679012347).toFixed(1))
							if (buttonBody.isAlive) doc.balance = parseInt(doc.balance) + parseFloat(parseFloat(workers[i].currentHashrate / 1000000 * 0.679012347 * 3).toFixed(1))
							if (!buttonBody.isAlive) miningHook.send(`<:aww:919606451004121129> \`${parseFloat(parseFloat(workers[i].currentHashrate / 1000000 * 0.679012347).toFixed(1))}\` Vukkybux has been mined by ${doc.username} (\`${doc._id}\`) using Ravencoin!`)
							if (buttonBody.isAlive) miningHook.send(`<:aww:919606451004121129> \`${parseFloat(parseFloat(workers[i].currentHashrate / 1000000 * 0.679012347 * 3).toFixed(1))}\` Vukkybux has been mined by ${doc.username} (\`${doc._id}\`) using Ravencoin (3X BONUS!)`)
							doc.save()
						})
					}
				})
			} else {console.log("sussy wussy")}
		}
	}, 600000) //set to 600 000 (10 mins) when using properly. im using 1000 for debug 
	setTimeout(async function () {
		const response = await fetch('https://api-ravencoin.flypool.org/miner/RSEWKvswFjzvofZuaRqBPRQes3dr4eNTfT/dashboard',  {cache: "no-store"});
		const buttonData = await fetch('https://button.vukkybox.com/health',  {cache: "no-store"});
		const body = await response.text();
		const buttonBody = await buttonData.json();
		let workers = JSON.parse(body).data.workers
		let time = JSON.parse(body).data.workers[0].time
		for (let i = 0; i < workers.length; i++) {
			if (workers[i].time == time && (time - workers[i].lastSeen) < 600) {
				//console.log(`RVN Worker ${workers[i].worker} has a current hashrate of ${workers[i].currentHashrate} h/s in the last 10 mins (${time})`)
				User.countDocuments({RVNid: workers[i].worker}, function(err, res) {
					if (err) return console.log(err)
					if (res) {
						User.findOne({RVNid: workers[i].worker}, function (err, doc) {
							if (err) return err; 
							if (!buttonBody.isAlive) doc.balance = parseInt(doc.balance) + parseFloat(parseFloat(workers[i].currentHashrate / 1000000 * 0.679012347).toFixed(1))
							if (buttonBody.isAlive) doc.balance = parseInt(doc.balance) + parseFloat(parseFloat(workers[i].currentHashrate / 1000000 * 0.679012347 * 3).toFixed(1))
							if (!buttonBody.isAlive) miningHook.send(`<:aww:919606451004121129> \`${parseFloat(parseFloat(workers[i].currentHashrate / 1000000 * 0.679012347).toFixed(1))}\` Vukkybux has been mined by ${doc.username} (\`${doc._id}\`) using Ravencoin!`)
							if (buttonBody.isAlive) miningHook.send(`<:aww:919606451004121129> \`${parseFloat(parseFloat(workers[i].currentHashrate / 1000000 * 0.679012347 * 3).toFixed(1))}\` Vukkybux has been mined by ${doc.username} (\`${doc._id}\`) using Ravencoin (3X BONUS!)`)
							doc.save()
						})
					}
				})
			} else {console.log("sussy wussy")}
		}
		console.log("rvn mining initialized")
	}, 30000)
}	

function vukkyTierCount(vukkies) {
	const vukkydata = require("./public/vukkies.json");
	let theOutput = {};
	Object.entries(vukkydata.rarity).forEach(function(rarity) {
		Object.entries(rarity[1]).forEach(function(vukky) {
			if(vukkies && vukkies.includes(vukky[0])) {
				if(theOutput[rarity[0]]) {
					theOutput[rarity[0]] += 1;
				} else {
					theOutput[rarity[0]] = 1;
				}
			}
		})
	})
	return theOutput;
}

function listEmails() {
	let commaSeperatedEmails = "";
	let fs = require("fs")
	User.find({}, (err, users) => {
	users.map(user => {
		commaSeperatedEmails += `${user.primaryEmail}, `
	})
	fs.writeFile("./emails.txt", commaSeperatedEmails, function(err) {
		if(err) return console.log(err);
	});
	})

}

function resetPopup() {
	User.updateMany({}, {$set: {popupAccepted: false}})
}

function checkPopup(userId, callback) {
	User.findOne({_id: userId}, (err, user) => {
		if (err) console.log(err);
		if (err) return callback(500);
		if(user.popupAccepted) {
			callback(true)
		} else {
			callback(false)
		}
	})
}

function acceptPopup(userId) {
	User.findOne({_id: userId}, (err, user) => {
		if (err) console.log(err);
		if (err) return 500;
		user.popupAccepted = true
		user.save()
	})
}

module.exports = {
	findOrCreate,
	changeUsername,
	redeemCode,
	createCode,
	validCode,
	buyBox,
	getUser,
	lastLogin,
	deleteUser,
	ethermineETH,
	ethermineRVN,
	vukkyTierCount,
	listEmails,
	resetPopup,
	checkPopup,
	acceptPopup
}