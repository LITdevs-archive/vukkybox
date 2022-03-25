var express  = require('express')
  , session  = require('express-session')
  , passport = require('passport')
  , DiscordStrategy = require('passport-discord').Strategy
  , app      = express();
const crypto = require("crypto");
const qrcode = require('qrcode');
const speakeasy = require('speakeasy');
require("dotenv").config();
var cookieParser = require('cookie-parser')
const csrf = require("csurf")
const MongoDBStore = require("connect-mongodb-session")(session);
var store = new MongoDBStore({
	uri: process.env.MONGODB_HOST,
	collection: 'sessions',
	clear_interval: 3600
});
let administrators = ["708333380525228082", "125644326037487616"]
const { Webhook } = require('discord-webhook-node');
const adminHook = new Webhook(process.env.ADMIN_DISCORD_WEBHOOK);
const hook = new Webhook(process.env.DISCORD_WEBHOOK);
const rateLimit = require("express-rate-limit");
const fileUpload = require("express-fileupload")
const webp = require('webp-converter');
webp.grant_permission();
var GitHubStrategy = require('passport-github').Strategy;
var GoogleStrategy = require('passport-google-oauth20').Strategy;
function nocache(module) {require("fs").watchFile(require("path").resolve(module), () => {delete require.cache[require.resolve(module)]})}
nocache("./public/vukkies.json")
const vukkyJson = require("./public/vukkies.json")
var db = require('./db')
var fetch = require("node-fetch")
passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

var scopes = ['identify', 'email'];
var prompt = 'none'
app.set("view egine", "ejs")
passport.use(new DiscordStrategy({
	clientID: process.env.CLIENT_ID,
	clientSecret: process.env.CLIENT_SECRET,
	callbackURL: 'https://vukkybox.com/callbackdiscord',
	scope: scopes,
	prompt: prompt
}, function(accessToken, refreshToken, profile, done) {
  db.findOrCreate(profile.provider, profile, function(user) {
		done(null, user)
	  })
  
}));
passport.use(new GitHubStrategy({
	clientID: process.env.GITHUB_CLIENT_ID,
	clientSecret: process.env.GITHUB_CLIENT_SECRET,
	callbackURL: "https://vukkybox.com/callbackgithub",
	scope: ["user:email"]
  },
  function(accessToken, refreshToken, profile, cb) {
	fetch("https://api.github.com/user/emails", {
						headers: {
			  Accept: "application/json",
							Authorization: `token ${accessToken}`,
						},
		}).then(res => res.json()).then(res => {
	  let filtered = res.reduce((a, o) => (o.primary && a.push(o.email), a), [])      
	  profile.email = filtered[0]
	}).then (h => {
	  db.findOrCreate(profile.provider, profile, function(user) {
		cb(null, user)
	  })
	})
	
  }
));
passport.use(new GoogleStrategy({
	clientID: process.env.GOOGLE_CLIENT_ID,
	clientSecret: process.env.GOOGLE_CLIENT_SECRET,
	callbackURL: "https://vukkybox.com/callbackgoogle",
	scope: ["profile", "email"]
  },
  function(token, tokenSecret, profile, cb) {
	
	db.findOrCreate(profile.provider, profile, function(user) {
	  cb(null, user)
	})
  }
));
app.use(session({
	secret: process.env.SESSION_SECRET,
	resave: true,
	saveUninitialized: true,
	store: store
}));
app.use(passport.initialize());
app.use(passport.session());
app.use("/resources", express.static('public/resources'))
app.use(express.urlencoded({extended:true}));
app.use(express.json())
app.use(fileUpload())
app.use(cookieParser())
app.use(csrf({cookie: true, sessionKey: process.env.SESSION_SECRET}))
app.use(function (err, req, res, next) {
	if (err.code !== 'EBADCSRFTOKEN') return next(err)
	let csrfWhitelist = ["/leaderboard"]
	if(!csrfWhitelist.includes(req.url)) res.send("Couldn't verify Cross Site Request Forgery prevention")
	if(csrfWhitelist.includes(req.url)) return next()
})
app.set('trust proxy', 1);

db.ethermineRVN() //worker ids got shortened to 20 characters only for some reason.. pissy!!
db.ethermineETH() 

function popupMid(req, res, next) {
	if (/MSIE|Trident/.test(req.headers['user-agent'])) return res.render(`${__dirname}/public/error.ejs`, { stacktrace: null, friendlyError: "Your browser is no longer supported by Vukkybox. Please <a href='https://browser-update.org/update-browser.html'>update your browser</a>." });
	if (req.headers['user-agent'].indexOf('Safari') != -1 && req.headers['user-agent'].indexOf('Macintosh') == -1 && req.headers['user-agent'].indexOf('OPR') == -1 && req.headers['user-agent'].indexOf('Edge') == -1 && req.headers['user-agent'].indexOf('Chrome') == -1) return res.render(`${__dirname}/public/error.ejs`, { stacktrace: null, friendlyError: "Sorry, but iPhones and iPads are not currently supported by Vukkybox, because Safari is terrible, and all web browsers there are Safari in a trench coat.<br>Please buy a good device, such as an Android phone, or even better... a computer!<br><br><img src='https://dokodemo.neocities.org/images/buttons/phonechump.gif'>" });
	if (!req.isAuthenticated()) {
		return next()
	}
	let user = req.user._id ? req.user : req.user[0]
	db.checkPopup(user._id, function (accepted) {
		if (accepted == 500) return res.send("500: Internal Server Error");
		if (!accepted) {
			return res.redirect("/popup")
		} else {
			db.checkNews(user._id, accepted => {
				if (!accepted) req.session.news = true;
				if (accepted) req.session.news = false;
				req.session.save();
				return next()
			})
		}
	})
}

const grl = rateLimit({
	windowMs: 1000,
	max: 3,
	handler: function(req, res) {
		res.status(429).send("Hang on, you're going too fast for us to violently stuff Vukkies in boxes!<br>Please give us a second or five...<script>setTimeout(function() { window.location.reload() },2500)</script>")
	},
	keyGenerator: function (req /*, res*/) {
		return req.headers["cf-connecting-ip"];
	}
});

app.get('/login', grl, function(req, res) {
	let user = req.isAuthenticated() ? req.user._id ? req.user : req.user[0] : null
	res.render(__dirname + '/public/login.ejs', {user: user, gravatarHash: user ? crypto.createHash("md5").update(user.primaryEmail.toLowerCase()).digest("hex") : null, redirect: req.session.redirectTo != undefined && req.session.redirectTo.length > 1 ? true : false});
});

app.get("/profile", grl, checkAuth, popupMid, function (req, res) {
	let user = req.isAuthenticated() ? req.user._id ? req.user : req.user[0] : null
	res.render(__dirname + '/public/profile.ejs', {user: user, gravatarHash: user ? crypto.createHash("md5").update(user.primaryEmail.toLowerCase()).digest("hex") : null});
});

app.get("/editProfile", grl, checkAuth, popupMid, function (req, res) { 
	let user = req.isAuthenticated() ? req.user._id ? req.user : req.user[0] : null
	res.render(__dirname + '/public/editProfile.ejs', {user: user, gravatarHash: user ? crypto.createHash("md5").update(user.primaryEmail.toLowerCase()).digest("hex") : null, csrfToken: req.csrfToken()});
})

app.post("/editProfile", grl ,checkAuth, function(req, res) {
	if(req.body.username != "") {
	  db.changeUsername(req.user, req.body.username)
	  req.session.passport.user.username = req.body.username
	}
	res.redirect("/profile")
})


const boxLimiter = rateLimit({
	windowMs: 1000,
	max: 2,
	keyGenerator: function (req /*, res*/) {
		return req.headers["cf-connecting-ip"];
	},
	handler: function(req, res) {
		if(req.rateLimit.current > 10) {
			adminHook.send(`<:woaha:904051837605408788> Warning! Sussy burgers are coming at rapid rates from the user with the ID of: ${req.user._id ? req.user._id.toString() : req.user[0]._id.toString()}`)
			res.status(429).send("Hang on, you're going too fast for us to violently stuff Vukkies in boxes! Here's something funny...<br><img src='https://i.imgur.com/twm4zX8.png'><br>This incident has been reported<script>setTimeout(function() { window.location.reload() },5000)</script>")
		} else {
			res.status(429).send("Hang on, you're going too fast for us to violently stuff Vukkies in boxes!<br>Please give us a second or five...<script>setTimeout(function() { window.location.reload() },2500)</script>")
		}
	}
});

// this is here because someone wanted to login on their apple watch
app.get('/watchLogin/:data', (req, res) => {
	res.cookie('connect.sid',req.params.data, { maxAge: 900000 });
	res.send("<a href='/' style='font-size:5000px'>cookie set</a>")
})
app.get('/getSession', (req, res) => {
	res.send(req.cookies)
})
// end of apple watch stupidity

app.get('/buyBox/:data', boxLimiter, checkAuthtime, popupMid, (req, res) => {
		const vukkies = require("./public/vukkies.json");
		const boxes = require("./public/boxes.json");
		let validBoxes = []
		Object.keys(boxes).forEach(box => {
			validBoxes.push(box)
		});
		if(validBoxes.includes(req.params.data)) {
			db.buyBox(req.user, req.params.data, function(prize, newBalance, newGallery, dupe) {
				if(prize.box == "error") {
					return res.status(500).render(__dirname + "error.ejs", {stacktrace: false, error: prize.error});
				}
				if(prize.box == "poor") {
					return res.redirect("https://vukkybox.com/balance?poor=true");
				}
				if(prize.box) {
					let fullUnlock = false;
					let ownedInTier = db.vukkyTierCount(newGallery)[prize.box.level.level] ? db.vukkyTierCount(newGallery)[prize.box.level.level] : 0
					if(!dupe && vukkies.rarity[prize.box.level.level] != undefined && ownedInTier == Object.entries(vukkies.rarity[prize.box.level.level]).length) fullUnlock = true;
				
						let vukkyId = prize.box.vukkyId
						let vukkyRarity = parseInt(prize.box.level.level) == 8 ? "pukky" : prize.box.level.level
						let jsonVukky = vukkies.rarity[vukkyRarity][vukkyId];
						let jsonLevel = vukkyJson.levels[vukkyRarity];
						let vukky = {
							name: jsonVukky.name,
							creator: jsonVukky.creator,
							id: vukkyId,
							url: jsonVukky.url,
							description: jsonVukky.description,
							audio: jsonVukky.audio,
							rarity: {
								level: vukkyRarity,
								name: jsonLevel.name,
								color: jsonLevel.color
							}
						}
						let box = {
							type: req.params.data,
							dupe: dupe,
							fullUnlock: fullUnlock,
						}
						res.render(__dirname + '/public/vukky.ejs', {
							user: req.user._id ? req.user : req.user[0],
							news: req.session.news, 
							csrfToken: req.csrfToken(),
							vukky: vukky,
							box: box,
							oldBalance: dupe ? newBalance - 0.1 * boxes[req.params.data].price : newBalance,
							newBalance: newBalance,
							gravatarHash: req.user._id ? crypto.createHash("md5").update(req.user.primaryEmail.toLowerCase()).digest("hex") : crypto.createHash("md5").update(req.user[0].primaryEmail.toLowerCase()).digest("hex") 
						});
				}
			});
		} else {
			return res.status(500).render(`${__dirname}/public/error.ejs`, { stacktrace: null, friendlyError: "Silly goose, that's not a box! <a href='/store'>Check the store</a> to find some boxes that DO exist." });
		}
});

app.post('/leaderboard', grl, function(req, res) {
	let user = false
	if(req.isAuthenticated()) user = req.user._id ? req.user : req.user[0];
	let validBoards = ["uniqueVukkiesGot", "rarity", "boxesOpened"]
	if(validBoards.includes(req.body.board) && req.body.limit != undefined && parseInt(req.body.limit) > 0 && parseInt(req.body.limit) <= 200) {
		db.leaderboard({limit: parseInt(req.body.limit), board: req.body.board, rarity: req.body.rarity}, user, response => {
			res.send(response);
		})
	} else {
		res.status(400).send("Invalid request")
	}
})

app.get('/leaderboard', grl, function(req, res) {
	res.render(__dirname + '/public/leaderboard.ejs', {user: req.isAuthenticated() ? req.user._id ? req.user : req.user[0] : null, gravatarHash: req.isAuthenticated() ? crypto.createHash("md5").update(req.user._id ? req.user.primaryEmail.toLowerCase() : req.user[0].primaryEmail.toLowerCase()).digest("hex") : null});
})

app.get('/privacy', function(req, res){
	res.redirect('/resources/privacy.html');
});

app.get('/terms', function(req, res){
	res.redirect('/resources/terms.html');
});

app.get('/delete', grl, checkAuth, function(req,res) {
	let user = req.user._id ? req.user : req.user[0]
	res.render(__dirname + "/public/deleteConfirm.ejs", {csrfToken: req.csrfToken(), twoFactor: user.twoFactor})
})

app.post('/delete2fa', grl, checkAuth, function(req, res) {
	let user = req.user._id ? req.user : req.user[0]
	if(!twoFactor) res.status(400).send("what are you doing.")
	var verified = speakeasy.totp.verify({ secret: user.twoFactorSecret,
		encoding: 'base32',
		token: req.body.otp });
	if(!verified) {
		req.session.twoFactorValidated = false;
		req.session.delete2fa = false; //lets make sure that it is absolutely for sure not allowed to delete without 2fa
		req.session.save();
		res.send({verified: false})
	}
	if(verified) {
		req.session.delete2fa = true;
		req.session.save();
		res.send({verified: true})
	}
	
	
})

app.post("/delete", grl, checkAuth, function(req, res) {
	let user = req.user._id ? req.user : req.user[0]
	if(user.twoFactor && !req.session.delete2fa) res.redirect("/logout");
	db.deleteUser(user, function(result) {
		if(result == 500) {
			res.redirect('/resources/500.html');
		} else {
			req.logout();
			res.redirect('/resources/deleted.html');
		}
	});
})

app.get("/admin", grl, popupMid, function(req, res) {
	  
	if(!req.isAuthenticated()) return res.render(__dirname + "/public/adminfake.ejs");
	if(!req.user && !req.user[0]) return res.render(__dirname + "/public/adminfake.ejs");
	if(req.user && !req.user.discordId) return res.render(__dirname + "/public/adminfake.ejs");
	if(req.user[0] && !req.user[0].discordId) return res.render(__dirname + "/public/adminfake.ejs");
	if(administrators.includes(req.user.discordId) || administrators.includes(req.user[0].discordId)) {
		res.render(__dirname + "/public/admin.ejs", {csrfToken: req.csrfToken()})
	} else {
		res.render(__dirname + "/public/adminfake.ejs")
	}
})

app.get("/jsoneditor", grl, function(req, res) {
	if(!req.isAuthenticated()) return res.render(__dirname + "/public/404.ejs");
	if(!req.user && !req.user[0]) return res.render(__dirname + "/public/404.ejs");
	if(req.user && !req.user.discordId) return res.render(__dirname + "/public/404.ejs");
	if(req.user[0] && !req.user[0].discordId) return res.render(__dirname + "/public/404.ejs");
	if(administrators.includes(req.user.discordId) || administrators.includes(req.user[0].discordId)) return res.render(__dirname + "/public/jsoneditor.ejs", {vjson: vukkyJson, csrfToken: req.csrfToken()})
	res.render(__dirname + "/public/404.ejs")
})

app.post("/jsoneditor", grl, function(req, res) {
	if(!req.isAuthenticated()) return res.render(__dirname + "/public/404.ejs");
	if(!req.user && !req.user[0]) return res.render(__dirname + "/public/404.ejs");
	if(req.user && !req.user.discordId) return res.render(__dirname + "/public/404.ejs");
	if(req.user[0] && !req.user[0].discordId) return res.render(__dirname + "/public/404.ejs");
	let user = req.user._id ? req.user : req.user[0]
	if(!administrators.includes(user.discordId)) return res.render(__dirname + "/public/404.ejs")
	let vukky = {
		name: req.body.name,
		rarity: req.body.rarity,
		description: req.body.description,
		url: req.body.url,
		creator: req.body.creator ? req.body.creator : null,
		audio: req.body.audio ? req.body.audio : null,
		id: req.body.id
	}

	if(!vukkyJson.rarity[vukky.rarity][vukky.id]) return res.send("sussy baka");
	vukkyJson.rarity[vukky.rarity][vukky.id] = {
		name: vukky.name,
		url: vukky.url,
		description: vukky.description
	}
	if(vukky.creator) vukkyJson.rarity[vukky.rarity][vukky.id].creator = vukky.creator
	if(vukky.audio) vukkyJson.rarity[vukky.rarity][vukky.id].audio = vukky.audio
	fs.writeFileSync("./public/vukkies.json", JSON.stringify(vukkyJson, null, "\t"));

	res.render(__dirname + "/public/jsoneditor.ejs", {vjson: vukkyJson, csrfToken: req.csrfToken()})
	
})

app.post("/jsonraritychange", grl, function(req, res) {
	if(!req.isAuthenticated()) return res.sendStatus(403)
	if(!req.user && !req.user[0]) return res.sendStatus(403)
	if(req.user && !req.user.discordId) return res.sendStatus(403)
	if(req.user[0] && !req.user[0].discordId) return res.sendStatus(403)
	let user = req.user._id ? req.user : req.user[0]
	if(!administrators.includes(user.discordId)) return res.sendStatus(403)
	let postData = {
		rarity: req.body.oldRarity,
		newRarity: req.body.newRarity,
		id: req.body.vukkyId
	}
	if(!vukkyJson.rarity[postData.rarity][postData.id]) return res.status(400).send("sussy baka");
	let vukky = vukkyJson.rarity[postData.rarity][postData.id]
	delete vukkyJson.rarity[postData.rarity][postData.id]
	vukkyJson.rarity[postData.newRarity][postData.id] = vukky;
	fs.writeFileSync("./public/vukkies.json", JSON.stringify(vukkyJson, null, "\t"));

	res.sendStatus(200)
	
})

app.get("/admin/**", grl, popupMid, function(req, res) {
	return res.redirect("https://www.youtube.com/watch?v=kBKr8YLuVgs");
})

app.get("/adminauthed", grl, popupMid, function(req, res) {
	res.render(__dirname + "/public/adminfakeauthed.ejs");
})

app.get("/adminfailed",grl, popupMid,  function(req, res) { 
	res.render(__dirname + "/public/adminfakefailed.ejs");
})

app.post("/admin/:action", grl, async function(req, res) {
	if(!req.isAuthenticated()) return res.render(__dirname + "/public/adminfake.ejs");
	if(!req.user && !req.user[0]) return res.render(__dirname + "/public/adminfake.ejs");
	if(["708333380525228082", "125644326037487616"].includes(req.user.discordId) || ["708333380525228082", "125644326037487616"].includes(req.user[0].discordId)) {
		switch(req.params.action) {
			case "create_code":
				db.createCode(req.body.code, req.body.amount, req.body.uses, (resp, err) => {
					if(err) return res.status(400).render(`${__dirname}/public/error.ejs`, { stacktrace: err.stack, friendlyError: null });
					res.redirect("/admin?code=" + resp.code)
				})
			break;
			case "upload_file":
				if(req.body.vukkytype.length < 1 || !req.files.image) return res.status(400).render(`${__dirname}/public/error.ejs`, { stacktrace: null, friendlyError: "Silly goose, you're missing some arguments there! Would you mind <a href='/admin'>trying again</a>?" });
				if(req.body.vukkytype != "special") {
					const fileWithoutExt = req.files.image.name.replace(/\.[^/.]+$/, "")
					const folderLocation = req.body.vukkytype == "pukky" ? "/resources/pukkies/" : "/resources/"
					if(req.files.image.name.endsWith(".gif")) {
						await req.files.image.mv(`${__dirname}/public/resources/temp/${req.files.image.name}`);
						await webp.gwebp(`${__dirname}/public/resources/temp/${req.files.image.name}`,`${__dirname}/public${folderLocation}${fileWithoutExt}.webp`);
						fs.unlinkSync(`${__dirname}/public/resources/temp/${req.files.image.name}`);
					} else if (req.files.image.name.endsWith(".webp")) {
						await req.files.image.mv(`${__dirname}/public${folderLocation}${req.files.image.name}`);
					} else {
						await req.files.image.mv(`${__dirname}/public/resources/temp/${req.files.image.name}`);
						await webp.cwebp(`${__dirname}/public/resources/temp/${req.files.image.name}`,`${__dirname}/public${folderLocation}${fileWithoutExt}.webp`);
						fs.unlinkSync(`${__dirname}/public/resources/temp/${req.files.image.name}`);
					}
					hook.send("<a:eager:902938792896385064> A new Vukky asset has been uploaded.")
					return res.redirect(`/admin?uploaded=https://vukkybox.com${folderLocation}${fileWithoutExt}.webp`);
				} else {
					req.files.image.mv(`${__dirname}/public/resources/${req.files.image.name}`);
					return res.redirect(`/admin`);
				}
				break;
			case "create_vukky": //i really dont want to make this one
				if(req.body.name.length < 1 || req.body.description.length < 1 || req.body.url.length < 1 || req.body.level.length < 1) return res.status(400).render(`${__dirname}/public/error.ejs`, { stacktrace: null, friendlyError: "Silly goose, you're missing some arguments there! Would you mind <a href='/admin'>trying again</a>?" });
				let newId = parseInt(vukkyJson.currentId) + 1
				vukkyJson.currentId = newId;
				vukkyJson.rarity[req.body.level][newId] = {
					name: req.body.name,
					url: req.body.url,
					description: req.body.description
				}
				if(req.body.level != "pukky") vukkyJson.rarity[req.body.level][newId].creator = req.body.creator;
				if(req.body.sfx.length != 0) vukkyJson.rarity[req.body.level][newId].audio = req.body.sfx;
				fs.writeFileSync("./public/vukkies.json", JSON.stringify(vukkyJson, null, "\t"));
				res.redirect("/view/" + req.body.level + "/" + newId)
				if(req.body.level != "pukky") {
					hook.send("<a:eagersplode:902938979563884584> A new Vukky by " + req.body.creator + " has been made! https://vukkybox.com/view/" + req.body.level + "/" + newId)
				} else {
					hook.send("<a:eagersplode:902938979563884584> A new Pukky has been made! https://vukkybox.com/view/" + req.body.level + "/" + newId)
				}
			break;
			case "emails":
				db.listEmails();
				res.redirect("/admin?emails=true")
			break;
			case "email_user":
				db.getUser(req.body.recipient, function(user) {
					db.sendEmail(user, req.body.message, req.body.subject);
					res.redirect("/admin?emailuser=true")
				}) 
			break;
			case "popup_reset":
				db.resetPopup();
				res.redirect("/admin?popup=true")
			break;
			case "news_reset":
				db.resetNews();
				res.redirect("/admin?news=true")
			break;
			case "beta_reset":
				db.resetBeta();
				res.redirect("/admin?beta=true")
			break;
			case "set_balance":
				if(req.body.userid && req.body.newbalance) {
					db.setBalance(req.body.userid, req.body.newbalance)
					adminHook.send(`<a:eagersplode:902938979563884584> \`${req.body.userid}\`'s balance has been set to ${req.body.newbalance}`)
					res.redirect("/admin?balance=true")
				} else {
					return res.status(400).render(`${__dirname}/public/error.ejs`, { stacktrace: null, friendlyError: "Silly goose, you're missing some arguments there! Would you mind <a href='/admin'>trying again</a>?" });
				}
			break;
			case "mass_email":
				if(req.body.template && req.body.subject) {
					db.sendEmails(req.body.template, req.body.subject);
					res.redirect("/admin?massemail=true")
				} else {
					return res.status(400).render(`${__dirname}/public/error.ejs`, { stacktrace: null, friendlyError: "Silly goose, you're missing some arguments there! Would you mind <a href='/admin'>trying again</a>?" });
				}
			break;
			default:
				res.render(__dirname + "/public/adminfake.ejs");
				break;
		}
	} else {
		res.render(__dirname + "/public/adminfake.ejs"); //i really dont want to make this one
	}
});

app.get("/view/:level/:id", grl, popupMid, function (req, res) { 
	if(!vukkyJson.levels[req.params.level]) return res.status(400).render(`${__dirname}/public/error.ejs`, { stacktrace: null, friendlyError: "Silly goose, that's not a rarity! <a href='/gallery'>Check your gallery</a> to find some Vukkies that DO exist." });
	if(!vukkyJson.rarity[req.params.level][req.params.id]) return res.status(400).render(`${__dirname}/public/error.ejs`, { stacktrace: null, friendlyError: "Silly goose, that's not a Vukky! <a href='/gallery'>Check your gallery</a> to find some Vukkies that DO exist." });
	let jsonVukky = vukkyJson.rarity[req.params.level][req.params.id];
	let jsonLevel = vukkyJson.levels[req.params.level];
	let vukky = {
		name: jsonVukky.name,
		creator: jsonVukky.creator,
		id: req.params.id,
		url: jsonVukky.url,
		description: jsonVukky.description,
		audio: jsonVukky.audio,
		rarity: {
			level: req.params.level,
			name: jsonLevel.name,
			color: jsonLevel.color
		}
	}
	if(!req.user) return res.render(__dirname + '/public/vukky.ejs', {
		user: null,
		vukky: vukky,
		news: false,
		csrfToken: req.csrfToken(),
		box: null,
		gravatarHash: null 
	});

	res.render(__dirname + '/public/vukky.ejs', {
		user: req.user._id ? req.user : req.user[0],
		csrfToken: req.csrfToken(),
		news: req.session.news, 
		vukky: vukky,
		box: null,
		gravatarHash: req.user._id ? crypto.createHash("md5").update(req.user.primaryEmail.toLowerCase()).digest("hex") : crypto.createHash("md5").update(req.user[0].primaryEmail.toLowerCase()).digest("hex") 
	});
  })

app.get('/stats', grl, checkAuth, popupMid, function(req, res) {
	if(req.user.primaryEmail) {
		db.getUser(req.user._id, function(resp, err) {
			if(err) return res.send(err)
			res.send(resp)
		})
	} else {	
		db.getUser(req.user[0]._id, function(resp, err) {
			if(err) return res.send(err)
			res.send(resp)
		})
	}
})

app.get('/beta', grl, checkAuth, popupMid, function(req, res) {
	let authorizedReferers = ["https://vukkybox.com/admin, https://vukkybox.com/credits"]
	if(authorizedReferers.includes(req.headers.referer)) return res.render(__dirname + '/public/beta.ejs', {csrfToken: req.csrfToken()})
	res.status(404).render(`${__dirname}/public/404.ejs`);
})

app.post('/beta', grl, popupMid, function(req, res) {
	if(!req.isAuthenticated()) return res.status(403).send("Unauthenticated");
	let newBetaState = req.body.betaState;
	db.setBeta(req.user._id ? req.user._id : req.user[0]._id, newBetaState == "enable" ? true : newBetaState == "disable" ? false : null, function(resp, err, newUser) {
		if(!err) req.session.passport.user = newUser;
		res.send(resp == 200 ? "<pre>Your wish is my command.</pre><button onclick=\"document.location.href = '/'\">OK</button>" : res.status(500).render(__dirname + "public/error.ejs", {stacktrace: err, friendlyError: "Something went wrong when applying this change to your account."}))
	});
})

app.get('/', grl, popupMid, function(req, res) {
	req.session.redirectTo = "/"
	let user = req.isAuthenticated() ? req.user._id ? req.user : req.user[0] : null
	if(!user) return res.render(__dirname + '/public/index.ejs', {news: false, csrfToken: req.csrfToken(), user: user, gravatarHash: user ? crypto.createHash("md5").update(user.primaryEmail.toLowerCase()).digest("hex") : null});
	db.lastLogin(user, function(newBalance, newUser) {
		req.session.passport.user = newUser
		req.session.passport.user.balance = newBalance
		res.render(__dirname + '/public/index.ejs', {news: req.session.news, csrfToken: req.csrfToken(), user: user, gravatarHash: user ? crypto.createHash("md5").update(user.primaryEmail.toLowerCase()).digest("hex") : null});
	})
});

app.get('/balance', grl, popupMid, function(req, res) {
	req.session.redirectTo = "/"
	let user = req.isAuthenticated() ? req.user._id ? req.user : req.user[0] : null
	if (!user) return res.render(__dirname + '/public/balance.ejs', {user: user, gravatarHash: user ? crypto.createHash("md5").update(user.primaryEmail.toLowerCase()).digest("hex") : null});
	db.getUser(user._id, (resp, err) => {
		if (err) return res.send(err)
		let loginHourly = resp.loginHourly
		let loginDaily = resp.loginDaily
		res.render(__dirname + '/public/balance.ejs', {RVNid: resp.RVNid, loginHourly: loginHourly, loginDaily: loginDaily, user: user, gravatarHash: user ? crypto.createHash("md5").update(user.primaryEmail.toLowerCase()).digest("hex") : null});
	})
});

app.get('/gallery', grl, checkAuth, popupMid, function(req, res) {
	let user = req.isAuthenticated() ? req.user._id ? req.user : req.user[0] : null

	db.getUser(user._id, function(user, err) {
		res.render(__dirname + '/public/gallery.ejs', {totalVukkies: vukkyJson.currentId, vukkies: vukkyJson.rarity, user: user, username: user.username, gravatarHash: crypto.createHash("md5").update(user.primaryEmail.toLowerCase()).digest("hex")});
	})
});

app.get("/guestgallery/:userId", grl, popupMid, function(req, res) {
	db.getUser(req.params.userId, function(user, err) {
		if(err) return res.status(500).send("500 " + err)
		if (user.username == user.primaryEmail) user.username = "A Vukkybox User";
		res.render(__dirname + '/public/gallery.ejs', {totalVukkies: vukkyJson.currentId, vukkies: vukkyJson.rarity, user: user, gravatarHash: crypto.createHash("md5").update(user.primaryEmail.toLowerCase()).digest("hex")});
	})
})

app.get('/loginDiscord', passport.authenticate('discord', { scope: scopes, prompt: prompt }), function(req, res) {
	req.session.twoFactorValidated = false
	req.session.twoFactorLastValidated = 0
	req.session.save()
});
app.get('/loginGithub', passport.authenticate('github'), function(req, res) {
	req.session.twoFactorValidated = false
	req.session.twoFactorLastValidated = 0
	req.session.save()
});
app.get('/loginGoogle', passport.authenticate('google'), function(req, res) {
	req.session.twoFactorValidated = false
	req.session.twoFactorLastValidated = 0
	req.session.save()
});

app.get('/callbackdiscord',
	passport.authenticate('discord', { failureRedirect: '/' }), function(req, res) { 
		req.session.twoFactorValidated = false
		req.session.twoFactorLastValidated = 0
		req.session.save()
		if(req.user.twoFactor) return res.redirect('/validate2fa')
		if(req.session.redirectTo) {
			let dest = req.session.redirectTo;
			req.session.redirectTo = "/"
			res.redirect(dest) 
		} else {
			res.redirect('/')
		}
	} // auth success
);

app.get('/callbackgithub',
	passport.authenticate('github', { failureRedirect: '/' }), function(req, res) { 
		req.session.twoFactorValidated = false
		req.session.twoFactorLastValidated = 0
		req.session.save()
		if(req.user.twoFactor) return res.redirect('/validate2fa')
		if(req.session.redirectTo) {
			let dest = req.session.redirectTo;
			req.session.redirectTo = "/"
			res.redirect(dest) 
		} else {
			res.redirect('/')
		}
	} // auth success
);
app.get('/callbackgoogle',
	passport.authenticate('google', { failureRedirect: '/' }), function(req, res) {
		req.session.twoFactorValidated = false
		req.session.twoFactorLastValidated = 0
		req.session.save()
		if(req.user.twoFactor) return res.redirect('/validate2fa')
		if(req.session.redirectTo) {
			let dest = req.session.redirectTo;
			req.session.redirectTo = "/"
			res.redirect(dest) 
		} else {
			res.redirect('/')
		}
	} // auth success
);
app.get('/otpcallback', function(req, res) {
	if(!req.isAuthenticated()) return res.redirect('/login')
	if(!req.user.twoFactor) return res.redirect('/2fa')
	if(!req.session.twoFactorValidated) return res.redirect('/validate2fa')
	if(req.session.redirectTo) {
		let dest = req.session.redirectTo;
		req.session.redirectTo = "/"
		res.redirect(dest) 
	} else {
		res.redirect('/')
	}
})

app.get('/logout', grl, function(req, res) {
	req.logout();
	req.session.destroy();
	res.redirect('/');
});
app.get('/info', grl, checkAuth, function(req, res) {
	res.redirect("/")
});
app.get('/redeem/:code', grl, checkAuth, popupMid, function (req, res) {
	  
	let code = req.params["code"];
	db.validCode(code, req.user, (isValid) => {
		db.redeemCode(req.user, code, (success, amount) => {
			if(success) {
				if(req.user.primaryEmail) {
					req.session.passport.user.balance += amount
				} else {
					req.session.passport.user[0].balance += amount
				}
				res.render(__dirname + '/public/redeem.ejs', {invalid: isValid, code: code, amount: amount});
				adminHook.send(`<a:clappy:919605268902469662> A user has redeemed \`${code}\` for ${amount} Vukkybux!`);
			} else {
				res.render(__dirname + '/public/redeem.ejs', {invalid: isValid, code: null, amount: null});
				if (isValid == "redeemed") adminHook.send(`<a:hahah:919608495576326174> A user tried to redeem \`${req.params["code"]}\`, but they have already used it.`);
				if (isValid == "used") adminHook.send(`<a:hahah:919608495576326174> A user tried to redeem \`${req.params["code"]}\`, but it has no uses left.`);
			}
		});
	});
})

app.get("/popup", grl, checkAuth, function (req, res) {
	let user = req.isAuthenticated() ? req.user._id ? req.user : req.user[0] : null
	res.render(__dirname + '/public/popup.ejs', {csrfToken: req.csrfToken(), user: user, gravatarHash: crypto.createHash("md5").update(user.primaryEmail.toLowerCase()).digest("hex"), redirect: req.session.redirectTo != undefined && req.session.redirectTo.length > 1 ? true : false});
	
})

app.post('/popup', grl, checkAuth, function (req, res) {
	if(req.body.popup != "yes") return res.redirect("/delete")
	let user = req.isAuthenticated() ? req.user._id ? req.user : req.user[0] : null
	db.acceptPopup(user._id)
	res.redirect("/")
})

app.post('/acceptnews', grl, checkAuth, function (req, res) {
	let user = req.isAuthenticated() ? req.user._id ? req.user : req.user[0] : null
	db.acceptNews(user._id)
	res.redirect("/")
})

app.get('/store', grl, popupMid, function(req,res) {
	let user = req.isAuthenticated() ? req.user._id ? req.user : req.user[0] : null
	if (!user) return res.render(__dirname + '/public/store.ejs', {news: false, csrfToken: req.csrfToken(), user: user, gravatarHash: user ? crypto.createHash("md5").update(user.primaryEmail.toLowerCase()).digest("hex") : null});
	db.lastLogin(user, function(newBalance, newUser) {
		req.session.passport.user = newUser
		req.session.passport.user.balance = newBalance
		user.balance = newBalance
		res.render(__dirname + '/public/store.ejs', {news: req.session.news, csrfToken: req.csrfToken(), user: user, gravatarHash: user ? crypto.createHash("md5").update(user.primaryEmail.toLowerCase()).digest("hex") : null});
	})
});

app.get('/credits', grl, popupMid, function(req,res) {
	const vboxVer = require("./package.json").version;
	const gitHash = require('child_process').execSync('git rev-parse --short HEAD').toString().trim()
	const deps = require("./package.json").dependencies;
	const ddeps = require("./package.json").devDependencies;
	const vukkies = require("./public/vukkies.json").rarity;
	let vukkyCreatorData = {};
	Object.keys(vukkies).forEach(function(key) {
		Object.keys(vukkies[key]).forEach(function(keytoo) {
			if(vukkies[key][keytoo].creator) {
				if(vukkyCreatorData[vukkies[key][keytoo].creator] == undefined) vukkyCreatorData[vukkies[key][keytoo].creator] = []
				vukkyCreatorData[vukkies[key][keytoo].creator].push(`${key}/${keytoo}`)
			}
		});
	});
	vukkyCreatorData = Object.entries(vukkyCreatorData).sort((a, b) => b[1].length - a[1].length);
	let user = req.isAuthenticated() ? req.user._id ? req.user : req.user[0] : null
	if(!user) return res.render(__dirname + '/public/credits.ejs', {vukkyCreatorData: vukkyCreatorData, vboxVer: vboxVer, gitHash: gitHash, deps: deps, ddeps: ddeps, user: null, gravatarHash: null});
	db.lastLogin(user, function(newBalance, newUser) {
		req.session.passport.user = newUser
		req.session.passport.user.balance = newBalance
		user.balance = newBalance
		res.render(__dirname + '/public/credits.ejs', {vukkyCreatorData: vukkyCreatorData, vboxVer: vboxVer, gitHash: gitHash, deps: deps, ddeps: ddeps, user: user, gravatarHash: crypto.createHash("md5").update(user.primaryEmail.toLowerCase()).digest("hex")});
	})
});

app.get('/pwasw.js', grl, function(req, res){
	res.sendFile(__dirname + '/public/resources/pwasw.js')
});

function checkAuth(req, res, next) {
	let user = req.isAuthenticated() ? req.user._id ? req.user : req.user[0] : null
	if(user) {
		if (user.twoFactor && !req.session.twoFactorValidated) return res.redirect("/validate2fa")
		db.lastLogin(user, function(newBalance, newUser) {
			req.session.passport.user = newUser
			req.session.passport.user.balance = newBalance
			req.session.save()
		})
		return next();
	}
	req.session.redirectTo = req.path;
	res.redirect(`/login`)
}

function checkAuthnofa(req, res, next) {
	let user = req.isAuthenticated() ? req.user._id ? req.user : req.user[0] : null
	if(user) {
		db.lastLogin(user, function(newBalance, newUser) {
			req.session.passport.user = newUser
			req.session.passport.user.balance = newBalance
			req.session.save()
		})
		return next();
	}
	req.session.redirectTo = req.path;
	res.redirect(`/login`)
}

function checkAuthtime(req, res, next) {
	let user = req.isAuthenticated() ? req.user._id ? req.user : req.user[0] : null
	if(!user) return res.redirect("/login")
	db.lastLogin(user, function(newBalance, newUser) {
		req.session.passport.user = newUser
		req.session.passport.user.balance = newBalance
		req.session.save()
	})
	if(!user.twoFactor) return next();
	if(!req.session.twoFactorValidated) return res.redirect("/validate2fa")
	let diffMs = Date.now() - req.session.twoFactorLastValidated;
	if (diffMs > 1800000) return res.redirect("/validate2fa")
	return next();
}

app.get('/statistics', grl, checkAuth, function(req, res){
	let user = req.user?._id ? req.user : req.user[0];
	let userRanks = {}
	db.leaderboard({"board": "uniqueVukkiesGot", "limit": 1, "rarity": 42}, user, function(leaderboardObject) {
		if (leaderboardObject.userRank) userRanks.uniqueVukkiesGot = leaderboardObject.userRank.rank;
		if (!leaderboardObject.userRank) userRanks.uniqueVukkiesGot = "LOSER!! You dont even have a rank!";
		db.leaderboard({"board": "boxesOpened", "limit": 1, "rarity": 42}, user, function(leaderboardObject) {
			if (leaderboardObject.userRank) userRanks.boxesOpened = leaderboardObject.userRank.rank;
			if (!leaderboardObject.userRank) userRanks.boxesOpened = "LOSER!! You dont even have a rank!";
			db.getUser(user._id, user => {
				db.leaderboard({"board": "codesRedeemed", "limit": 1, "rarity": 42}, user, function(leaderboardObject) {
					if (leaderboardObject.userRank) userRanks.codesRedeemed = leaderboardObject.userRank.rank;
					if (!leaderboardObject.userRank) userRanks.codesRedeemed = "LOSER!! You dont even have a rank!";
					res.render(`${__dirname}/public/statistics.ejs`, {user: user, totalVukkies: vukkyJson.currentId, userRanks: userRanks, gravatarHash: crypto.createHash("md5").update(user.primaryEmail.toLowerCase()).digest("hex")});
})})})})});

app.get('/translog', grl, checkAuth, function(req, res) {
	let user = req.user?._id ? req.user : req.user[0];
	db.transLog(user._id, logs => {
		res.render(`${__dirname}/public/translog.ejs`, {user: user, transLog: logs, gravatarHash: crypto.createHash("md5").update(user.primaryEmail.toLowerCase()).digest("hex")});
	})
})

app.get('/2fa', grl, checkAuthnofa, function(req, res) {
	let user = req.user?._id ? req.user : req.user[0];
	db.getUser(user._id, user => {
		if(user.twoFactor) return res.render(`${__dirname}/public/2fareset.ejs`, {csrfToken: req.csrfToken(), user: user, gravatarHash: crypto.createHash("md5").update(user.primaryEmail.toLowerCase()).digest("hex")});
		let secret = speakeasy.generateSecret({name: "Vukkybox 2FA"});
		req.session.two_factor_temp_secret = secret.base32;
		req.session.save()
		qrcode.toDataURL(secret.otpauth_url, function(err, dataUrl) {
			if (err) return res.render(__dirname + '/public/error.ejs', {stacktrace: null, friendlyError: "Something went wrong while starting the 2FA flow. <br>For your privacy the stacktrace is hidden, if this happens again please contact us."});
			res.render(`${__dirname}/public/2fa.ejs`, {csrfToken: req.csrfToken(), user: user, qrDataUrl: dataUrl, gravatarHash: crypto.createHash("md5").update(user.primaryEmail.toLowerCase()).digest("hex")});
		});
	})
});

app.get('/validate2fa', grl, function(req, res) {
	if (!req.isAuthenticated()) return res.redirect("/login");
	let user = req.user?._id ? req.user : req.user[0];
	db.getUser(user._id, user => {
		if(!user.twoFactor) return res.send("you dont even have 2FA enabled lol");
		res.render(`${__dirname}/public/validate2fa.ejs`, {csrfToken: req.csrfToken(), user: user, gravatarHash: crypto.createHash("md5").update(user.primaryEmail.toLowerCase()).digest("hex")});	
	})
});

app.post('/votp', checkAuthnofa, function(req, res) {
	let user = req.user?._id ? req.user : req.user[0];
	db.getUser(user._id, user => {
		var verified = speakeasy.totp.verify({ secret: user.twoFactorSecret,
			encoding: 'base32',
			token: req.body.otp });
		if(!verified) {
			req.logout()
			return res.send({valid: false});
		}
		if(verified) {
			res.send({valid: true});
			req.session.twoFactorValidated = true;
			req.session.twoFactorLastValidated = Date.now();
			req.session.save();
		}
	})
})

const twofaenablerl = rateLimit({
	windowMs: 10000,
	max: 3,
	handler: function(req, res) {
		res.status(429).send("Hang on, you're going too fast for us to violently stuff Vukkies in boxes!<br>Please give us a second or five...<script>setTimeout(function() { window.location.reload() },2500)</script>")
	},
	keyGenerator: function (req /*, res*/) {
		return req.headers["cf-connecting-ip"];
	}
});

app.post('/fotp', twofaenablerl, checkAuth, function(req, res) {
	let user = req.user?._id ? req.user : req.user[0];
	if(user.twoFactor) return res.status(403).send("2fa already enabled");
	if(!req.session.two_factor_temp_secret) return res.status(400).send("2fa flow not started");
	let userInput = req.body.otp;
	var verified = speakeasy.totp.verify({ secret: req.session.two_factor_temp_secret,
		encoding: 'base32',
		token: userInput });
	if(!verified) return res.status(400).send({valid: false});
	db.enabletwoFactor(user._id, req.session.two_factor_temp_secret);
	res.send({valid: true});
})

const emailrl = rateLimit({
	windowMs: 60000,
	max: 2,
	handler: function(req, res) {
		res.status(429).send("Hang on, you're going too fast for us to violently stuff Vukkies in boxes!<br>Please give us a minute...")
	},
	keyGenerator: function (req /*, res*/) {
		return req.headers["cf-connecting-ip"];
	}
});

app.post('/emailCode', emailrl, checkAuthnofa, function(req, res) {
	let user = req.user?._id ? req.user : req.user[0];
	let secret = speakeasy.generateSecret({length: 8});
	user.emailCode = secret.base32;
	req.session.emailCode = secret.base32;
	req.session.save()
	db.sendEmail(user, fs.readFileSync(`${__dirname}/public/email/emailCode.html`, "utf8"), "Vukkybox Authenticator recovery code");
})

app.post('/emailCheckCode', checkAuthnofa, function(req, res) {
	let user = req.user?._id ? req.user : req.user[0];
	if(!req.session.emailCode) return res.status(400).send({valid: false});
	if(req.body.otp != req.session.emailCode) return res.status(400).send({valid: false});
	db.disabletwoFactor(user._id);
	res.send({valid: true});
})

app.post('/2fareset', checkAuthnofa, function(req, res) {
	let user = req.user?._id ? req.user : req.user[0];
	db.getUser(user._id, user => {
		var verified = speakeasy.totp.verify({ secret: user.twoFactorSecret,
			encoding: 'base32',
			token: req.body.otp });
		if(!verified) return res.status(400).render(`${__dirname}/public/2fareset.ejs`, {failure: true, csrfToken: req.csrfToken(), user: user, gravatarHash: crypto.createHash("md5").update(user.primaryEmail.toLowerCase()).digest("hex")});
		db.disabletwoFactor(user._id);
		res.render(`${__dirname}/public/2fareset.ejs`, {successful: true, csrfToken: req.csrfToken(), user: user, gravatarHash: crypto.createHash("md5").update(user.primaryEmail.toLowerCase()).digest("hex")});
	})
})

app.use(function (err, req, res, next) {
	console.error(err.stack);
	if(err.message == 'Invalid "code" in request.') {
		return res.status(500).render(`${__dirname}/public/error.ejs`, { stacktrace: null, friendlyError: "It looks like we couldn't log you in. Would you mind <a href='/login'>trying that again</a>?" });
	}
	res.status(500).render(`${__dirname}/public/error.ejs`, { stacktrace: err.stack, friendlyError: null });
});

// EASTER EGGS, HERE AT THE BOTTOM FOR ORGANIZATION PURPOSES //

app.get('/sus', function(req, res){
	res.redirect('https://i.imgur.com/IEl9NzL.gif');
});

app.get('/crash', grl, function(req, res){
	res.status(500).render(`${__dirname}/public/error.ejs`, { stacktrace: "CRITICAL SERVER FAULT AT APP.JS:1! QUITTING IMMEDIATELY TO PREVENT FURTHER DAMAGE", friendlyError: null });
});

app.get('/humans.txt', function(req, res){
	res.redirect('https://github.com/LITdevs/.github/blob/main/profile/README.md#-');
});

app.get('/robots.txt', function (req, res) {
    res.type('text/plain');
    res.send("# All robots allowed\n# Unless you're a rude one\n\nUser-agent: *\nDisallow: /guestgallery/\nDisallow: /cdn-cgi/");
});

app.get('/.well-known/keybase.txt', function (req, res) {
    res.type('text/plain');
    res.send("Who would want a base containing keys? Secret bases with cool weapons are much cooler.");
});

app.get('/.well-known/void', function (req, res) {
    res.type('text/plain');
    res.send("No! I don't want to go there!");
});

app.get('/.well-known/dat', function (req, res) {
    res.type('text/plain');
    res.send("dat browser is lokin real sus!");
});

app.get('/.well-known/matrix', function (req, res) {
    res.type('text/plain');
    res.send("Which one?");
});

app.get('/.well-known/webfinger', function (req, res) {
    res.type('text/plain');
    res.send("Fingers are already scary in real life, we don't need them on the Web as well.");
});

app.get('/.well-known/est', function (req, res) {
    res.type('text/plain');
    res.send("I prefer CET.");
});

app.get('/.well-known/acme-challenge', function (req, res) {
    res.type('text/plain');
    res.send("They turned the fictional corporation into a challenge? Wow, I'm amazed by what that website named after the sound of a clock can do.");
});

app.get('/.well-known/browserid', function (req, res) {
    res.type('text/plain');
    res.send("You are stuck in time, but thanks for trying.");
});

app.get('/.well-known/autoconfig/mail', function (req, res) {
    res.type('text/plain');
    res.send("Vukkybox is not an email site.");
});

app.get('/.well-known/xrp-ledger.toml', function (req, res) {
    res.type('text/plain');
    res.send("Get sued, lol!");
});

// and now for something completely different
app.get('/.well-known/security.txt', function (req, res) {
    res.type('text/plain');
    res.send("Contact: mailto:contact@litdevs.org");
});

app.get('/nuke', function (req, res) {
    res.send("<script>while (true) {window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ')}</script>");
});

app.get('*', function(req, res){
	res.status(404).render(`${__dirname}/public/404.ejs`);
});

var fs = require('fs');
var http = require('http');

const httpServer = http.createServer(app);

httpServer.listen(81, () => {
	console.log('HTTP Server running on port 81');
});
