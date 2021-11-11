var express  = require('express')
  , session  = require('express-session')
  , passport = require('passport')
  , DiscordStrategy = require('passport-discord').Strategy
  , app      = express();
const crypto = require("crypto");
require("dotenv").config();
const MongoDBStore = require("connect-mongodb-session")(session);
var store = new MongoDBStore({
	uri: process.env.MONGODB_HOST,
	collection: 'sessions'
});
var GitHubStrategy = require('passport-github').Strategy;
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var MediaWikiStrategy = require('passport-mediawiki-oauth').OAuthStrategy;
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
var prompt = 'consent'
app.set("view egine", "ejs")
passport.use(new MediaWikiStrategy({
    consumerKey: process.env.MEDIAWIKI_CONSUMER,
    consumerSecret: process.env.MEDIAWIKI_SECRET,
    callbackURL: "https://vukkybox.com/callbackmediawiki"
  },
  function(token, tokenSecret, profile, done) {
    db.findOrCreate(profile.provider, profile, function(user) {
		done(null, user)
	  })
  }
));
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
app.use("/.well-known", express.static('public/.well-known'))
app.use(express.urlencoded({extended:true}));
app.use(express.json())

app.get('/login', function(req, res) {
  if(req.user) {
	if(req.user.primaryEmail) {
	  res.render(__dirname + '/public/login.ejs', {user: req.user, username: req.user.username, gravatarHash: crypto.createHash("md5").update(req.user.primaryEmail.toLowerCase()).digest("hex"), redirect: req.session.redirectTo != undefined && req.session.redirectTo.length > 1 ? true : false});
	} else {
	  if(req.user[0].primaryEmail) {
		res.render(__dirname + '/public/login.ejs', {user: req.user[0], username: req.user[0].username, gravatarHash: crypto.createHash("md5").update(req.user[0].primaryEmail.toLowerCase()).digest("hex"), redirect: req.session.redirectTo != undefined && req.session.redirectTo.length > 1 ? true : false});
	  }
	}
	} else {
	  res.render(__dirname + '/public/login.ejs', {username: "", gravatarHash: "", redirect: req.session.redirectTo != undefined && req.session.redirectTo.length > 1 ? true : false})
	}
});
app.get("/index", (req, res) => {
  res.send("Hello world")
})

app.get("/profile", checkAuth, function (req, res) {
  if(req.user) {
	if(req.user.primaryEmail) {
	  
	  res.render(__dirname + '/public/profile.ejs', {user: req.user, linkedAccounts: req.user.LinkedAccounts, username: req.user.username, primaryEmail: req.user.primaryEmail, gravatarHash: crypto.createHash("md5").update(req.user.primaryEmail.toLowerCase()).digest("hex")});
	  } else {
		if(req.user[0].primaryEmail) {
		  res.render(__dirname + '/public/profile.ejs', {user: req.user[0], linkedAccounts: req.user[0].LinkedAccounts, username: req.user[0].username, primaryEmail: req.user[0].primaryEmail, gravatarHash: crypto.createHash("md5").update(req.user[0].primaryEmail.toLowerCase()).digest("hex")});
		}
	  }
	  }
});

app.get("/editProfile", checkAuth, function (req, res) { 
  
  if(req.user.primaryEmail) {
	res.render(__dirname + '/public/editProfile.ejs', {user: req.user, username: req.user.username, gravatarHash: crypto.createHash("md5").update(req.user.primaryEmail.toLowerCase()).digest("hex")});
	} else {
	  if(req.user[0].primaryEmail) {
		res.render(__dirname + '/public/editProfile.ejs', {user: req.user[0], username: req.user[0].username, gravatarHash: crypto.createHash("md5").update(req.user[0].primaryEmail.toLowerCase()).digest("hex")});
	  }
	}
})

app.post("/editProfile", checkAuth, function(req, res) {
	if(req.body.username != "") {
	  db.changeUsername(req.user, req.body.username)
	  req.session.passport.user.username = req.body.username
	}
	res.redirect("/profile")
})

app.get('/buyBox/:data', checkAuth, (req, res) => {
		let validBoxes = ["veggie", "warped", "classic", "fire", "pukky"]
		if(validBoxes.includes(req.params.data)) {
			db.buyBox(req.user, req.params.data, function(prize, newBalance, newGallery, dupe) {
				if(prize.box) {
					if(req.user.primaryEmail) {
						let oldBalance = req.user.balance
						req.session.passport.user.balance = newBalance
						req.session.passport.user.gallery = newGallery
						res.render(__dirname + '/public/buyBox.ejs', {oldBalance: oldBalance, boxType: req.params.data, dupe: dupe, prize: prize, user: req.user, username: req.user.username, gravatarHash: crypto.createHash("md5").update(req.user.primaryEmail.toLowerCase()).digest("hex")})	
						
					} else {
						let oldBalance = req.user[0].balance
						req.session.passport.user[0].balance = newBalance
						req.session.passport.user[0].gallery = newGallery
						res.render(__dirname + '/public/buyBox.ejs', {oldBalance: oldBalance, boxType: req.params.data, dupe: dupe, prize: prize, user: req.user[0], username: req.user[0].username, gravatarHash: crypto.createHash("md5").update(req.user[0].primaryEmail.toLowerCase()).digest("hex")});
						
					}
				} else {
					res.redirect("https://vukkybox.com/store?poor=true")
				}
			});
		} else {
			console.log("Invalid box")
			res.status(400).send({message: "Box not found"})
		}
});

app.get("/admin", function(req, res) {
	if(!req.isAuthenticated()) return res.status(404).render(`${__dirname}/public/404.ejs`);
	if(["708333380525228082", "125644326037487616"].includes(req.user.discordId) || ["708333380525228082", "125644326037487616"].includes(req.user[0].discordId)) {
		res.render(__dirname + "/public/admin.ejs")
	} else {
		res.status(404).render(`${__dirname}/public/404.ejs`);
	}
})

app.post("/admin/:action", function(req, res) {
	if(["708333380525228082", "125644326037487616"].includes(req.user.discordId) || ["708333380525228082", "125644326037487616"].includes(req.user[0].discordId)) {
		switch(req.params.action) {
			case "create_code":
				db.createCode(req.body.code, req.body.amount, req.body.uses, (resp, err) => {
					if(err) return res.redirect("/admin?error=" + err) // res = {code: "code", amount: 123}
					res.redirect("/admin?code=" + resp.code)
				})
			break;
			case "create_vukky": //i really dont want to make this one
				if(req.body.name.length < 1 || req.body.description.length < 1 || req.body.url.length < 1 || req.body.level.length < 1) return res.redirect("/admin?error=missingargs")
				let newId = parseInt(vukkyJson.currentId) + 1
				vukkyJson.currentId = newId;
				vukkyJson.rarity[req.body.level][newId] = {
					name: req.body.name,
					url: req.body.url,
					description: req.body.description
				}
				fs.writeFileSync("./public/vukkies.json", JSON.stringify(vukkyJson, null, "\t"));
				res.redirect("/view/" + req.body.level + "/" + newId)
				/*
				"67":{
					"name":"Vukky Miner",
					"url":"https://github.com/Vukkyy/vukmoji/blob/master/emojis/static/vukkyminer.png?raw=true",
					"description":"This Vukky's going to mine crypto and convert it to SQUID! Wait! No! <a href='https://www.reddit.com/qkai4d'>The value dropped by 99%!</a> You're going to lose all your money! Stop!"
				}
				*/
			break;
			default:
				res.redirect("/admin?error=invalidaction")
				break;
		}
	} else {
		res.status(403).send({message: "This endpoint is reserved for future purposes. (but you are too cringe to have access to it)"})
	}
});

app.get("/view/:level/:id", checkAuth, function (req, res) { 
	if(!vukkyJson.levels[req.params.level]) return res.send("this doesnt exist")
	if(!vukkyJson.rarity[req.params.level][req.params.id]) return res.send("this doesnt exist")
	if(req.user.primaryEmail) {
		  res.render(__dirname + '/public/view.ejs', {level: JSON.stringify(vukkyJson.levels[req.params.level]), vukkyId: req.params.id, vukky: JSON.stringify(vukkyJson.rarity[req.params.level][req.params.id]), user: req.user, username: req.user.username, gravatarHash: crypto.createHash("md5").update(req.user.primaryEmail.toLowerCase()).digest("hex")});
	  
		} else {
		if(req.user[0].primaryEmail) {
			res.render(__dirname + '/public/view.ejs', {level: JSON.stringify(vukkyJson.levels[req.params.level]), vukkyId: req.params.id, vukky: JSON.stringify(vukkyJson.rarity[req.params.level][req.params.id]), user: req.user[0], username: req.user[0].username, gravatarHash: crypto.createHash("md5").update(req.user[0].primaryEmail.toLowerCase()).digest("hex")});
		} else {
			res.status("500").send("something fucked up.")
		}
	  }
  })

app.get('/stats', checkAuth, function(req, res) {
	
	if(req.user.primaryEmail) {
		db.getUser(req.user._id, function(resp, err) {
			if(err) return res.send(err)
			res.send(resp)
		})
	} else {	
		db.getUser(req.user[0]._id)
	}
})

app.get('/', function(req, res) {
	req.session.redirectTo = "/"
  	if(req.user) {
		if(req.user.username) {
			res.render(__dirname + '/public/index.ejs', {user: req.user, username: req.user.username, gravatarHash: crypto.createHash("md5").update(req.user.primaryEmail.toLowerCase()).digest("hex")});
		} else {
			if(req.user[0].primaryEmail) {
				res.render(__dirname + '/public/index.ejs', {user: req.user[0], username: req.user[0].username, gravatarHash: crypto.createHash("md5").update(req.user[0].primaryEmail.toLowerCase()).digest("hex")});
			}
		}
	} else {
	  res.render(__dirname + '/public/index.ejs', {user: null, username: ""})
	}
});

app.get('/gallery', checkAuth, function(req, res) {
  	if(req.user) {
		if(req.user.username) {
			res.render(__dirname + '/public/gallery.ejs', {vukkies: vukkyJson.rarity, user: req.user, username: req.user.username, gravatarHash: crypto.createHash("md5").update(req.user.primaryEmail.toLowerCase()).digest("hex")});
		} else {
			if(req.user[0].primaryEmail) {
				res.render(__dirname + '/public/gallery.ejs', {vukkies: vukkyJson.rarity, user: req.user[0], username: req.user[0].username, gravatarHash: crypto.createHash("md5").update(req.user[0].primaryEmail.toLowerCase()).digest("hex")});
			}
		}
	}
});

app.get("/guestgallery/:userId", function(req, res) {
	db.getUser(req.params.userId, function(user, err) {
		if(err) return res.status(500).send("500 " + err)
		res.render(__dirname + '/public/gallery.ejs', {vukkies: vukkyJson.rarity, user: user, username: "Guest Collection", gravatarHash: null});
	})
})

app.get('/loginDiscord', passport.authenticate('discord', { scope: scopes, prompt: prompt }), function(req, res) {});
app.get('/loginGithub', passport.authenticate('github'), function(req, res) {});
app.get('/loginGoogle', passport.authenticate('google'), function(req, res) {});
app.get('/loginMediawiki', passport.authenticate('mediawiki'), function(req, res) {});
app.get('/callbackdiscord',
	passport.authenticate('discord', { failureRedirect: '/' }), function(req, res) { 
		if(req.session.redirectTo) {
			let dest = req.session.redirectTo;
			req.session.redirectTo = "/"
			res.redirect(dest) 
		} else {
			res.redirect('/')
		}
	} // auth success
);


app.get('/callbackmediawiki',
	passport.authenticate('mediawiki', { failureRedirect: '/' }), function(req, res) { 
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
		if(req.session.redirectTo) {
			let dest = req.session.redirectTo;
			req.session.redirectTo = "/"
			res.redirect(dest) 
		} else {
			res.redirect('/')
		}
	} // auth success
);
app.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/');
});
app.get('/info', checkAuth, function(req, res) {
	//console.log(req.user
	res.redirect("/")
	//db.findOrCreate(req.user.provider, req.user)
});
app.get('/redeem/:code', checkAuth, function (req, res) {
	let code = req.params["code"];
	db.validCode(code, (isValid) => {
		db.redeemCode(req.user, code, (success, amount) => {
			if(success) {
				if(req.user.primaryEmail) {
					req.session.passport.user.balance += amount
				} else {
					req.session.passport.user[0].balance += amount
				}
				res.render(__dirname + '/public/redeem.ejs', {invalid: isValid, code: code, amount: amount});
			} else {
				res.render(__dirname + '/public/redeem.ejs', {invalid: isValid, code: null, amount: null});
			}
		});
	});
})

app.get('/store', function(req,res) {
	if(req.isAuthenticated()) {
		if(req.user.primaryEmail) return res.render(__dirname + '/public/store.ejs', {user: req.user, username: req.user.username, gravatarHash: crypto.createHash("md5").update(req.user.primaryEmail.toLowerCase()).digest("hex")});
		if(req.user[0].primaryEmail) return res.render(__dirname + '/public/store.ejs', {user: req.user[0], username: req.user[0].username, gravatarHash: crypto.createHash("md5").update(req.user[0].primaryEmail.toLowerCase()).digest("hex")});
	} else {
		res.render(__dirname + '/public/store.ejs', {user: null, username: "", gravatarHash: null});
	}
});

function checkAuth(req, res, next) {
	if (req.isAuthenticated()) {
		db.lastLogin(req.user, function(newBalance) {
			if(req.user.primaryEmail) {
				req.session.passport.user.balance = newBalance
			} else {
				req.session.passport.user[0].balance = newBalance
			}
		})
		return next();
	}
	req.session.redirectTo = req.path;
	res.redirect(`/login`)
}


app.get('*', function(req, res){
	res.status(404).render(`${__dirname}/public/404.ejs`);
});

var fs = require('fs');
var http = require('http');

const httpServer = http.createServer(app);

httpServer.listen(80, () => {
	console.log('HTTP Server running on port 80');
});
