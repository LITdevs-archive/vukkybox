const mongoose = require('mongoose');
require("dotenv").config();
const boxJson = require("./public/boxes.json")
function nocache(module) {require("fs").watchFile(require("path").resolve(module), () => {delete require.cache[require.resolve(module)]})}
nocache("./public/vukkies.json")
const vukkyJson = require("./public/vukkies.json")
mongoose.connect(process.env.MONGODB_HOST);
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
	googleId: String,
	twitterId: String,
	primaryEmail: String,
	githubEmail: String,
	discordEmail: String,
	googleEmail: String,
	LinkedAccounts: Array,
	twitterEmail: String,
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
	duplicates: Object,
	beta: Boolean
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
						popupAccepted: true,
						beta: false

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
						popupAccepted: true,
						beta: false
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
						popupAccepted: true,
						beta: false
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
	let userId = user._id ? user._id : user[0]._id;
	let boxData = boxJson[box]
	User.findById({_id: userId}, function (err, user) {
		if(err) {
			callback({"box":"error", "error": err}, null, null, null)
			console.log(err)
		};
		if(user.balance >= boxData.price) {
			user.balance = parseFloat(user.balance - boxData.price).toFixed(1);
			user.boxesOpened++;
			openBox(box, res => { //res: {level, vukkyId, vukky}
				const isDuplicate = user.gallery.includes(res.vukkyId)
				let duplicateCount
				if (isDuplicate) {
					if (!user.duplicates) user.duplicates = {};
					if (!user.duplicates[res.vukkyId]) user.duplicates[res.vukkyId] = 0
					user.duplicates[res.vukkyId] = parseInt(user.duplicates[res.vukkyId]) + 1
					user.markModified('duplicates')
					duplicateCount = user.duplicates[res.vukkyId];
					if (!boxData.noRefund) user.balance = parseFloat(user.balance + 0.1 * boxData.price).toFixed(1);
				} else {
					user.uniqueVukkiesGot++;
					user.gallery.push(res.vukkyId)
				}
				user.save()
				callback({"box": res}, user.balance, user.gallery, duplicateCount);
			})
		} else {
			callback({"box":"poor"}, null, null, null)
		}
	})
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
	User.updateMany({}, {$set: {popupAccepted: false}}, function (err, docs) {
		if (err) return console.log(err)
		console.log("Updated Docs : ", docs);
	})
}

function resetBeta() {
	User.updateMany({}, {$set: {beta: false}}, function (err, docs) {
		if (err) return console.log(err)
		console.log("Updated Docs : ", docs);
	})
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

function setBalance(userId, newBalance) {
	User.findOne({_id: userId}, (err, user) => {
		if (err) console.log(err);
		if (err) return 500;
		user.balance = newBalance
		user.save()
	})
}

function setBeta(userId, newBeta, callback) { // callback(response, error, user)
	User.findOne({_id: userId}, (err, user) => {
		if (err) return callback(500, err, null)
		if (typeof newBeta == "boolean") {
			user.beta = newBeta;
			user.save()
			callback(200, null, user)
		} else {
			callback(400, "Invalid beta value", null)
		}
	})
}

function leaderboard(req, user, callback) { // req: {board: board, limit: 10/50/100}
	/*
		Callback object:
		{
			userRank: the user's rank on the board
			leaderboard: sorted array containing the top 10/50/100 users
		}
	*/
	let userId = user._id ? user._id : user[0]._id;
	console.log(req)
	User.find({}, null, {
		sort: {
			uniqueVukkiesGot: -1
		}},
	function(err, allUsers){
		console.log(allUsers.length)
		let finalList = []
		let userRank
		for (let i = 0; i < allUsers.length; i++) {
			if(i < req.limit) {
				/*
				Final list will consist of objects that use the following format:
				{
					username: The user's username.. duh. If it is their email, hide it.
					data: The requested property
				}
				*/
				finalList.push({username: allUsers[i].username.includes("@") ? "Username Hidden for Privacy" : allUsers[i].username, data: allUsers[i].uniqueVukkiesGot})
			}
			if (allUsers[i]._id == userId) {
				userRank = i + 1;
				if (i + 1 >= req.limit) return callback({userRank: userRank, leaderboard: finalList}); // I know I could probably get away with i > req.limit but this makes it easier for my brain to comprehend
			}
			if(userRank && i + 1 >= req.limit) {
				return callback({userRank: userRank, leaderboard: finalList});
			}
			if (i == allUsers.length) {		
				if(userRank) callback({userRank: userRank, leaderboard: finalList});
				return callback("Something went wrong ELECTRIC BOOGALOO!!");
			}
		}
	})
}

module.exports = {
	findOrCreate,
	changeUsername,
	redeemCode,
	setBalance,
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
	resetBeta,
	checkPopup,
	acceptPopup,
	setBeta,
	leaderboard
}
