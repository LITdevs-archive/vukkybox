function rainParticles(particles, amount) {
    if(amount > 12) console.warn("rainParticles does not properly support adding more than 12 particles at a time.")
    document.querySelector('head').innerHTML += '<style> /* customizable snowflake styling */.snowflake {color: #fff;font-size: 1em;font-family: Arial, sans-serif;text-shadow: 0 0 5px #000;}@-webkit-keyframes snowflakes-fall{0%{top:-10%}100%{top:100%}}@-webkit-keyframes snowflakes-shake{0%,100%{-webkit-transform:translateX(0);transform:translateX(0)}50%{-webkit-transform:translateX(80px);transform:translateX(80px)}}@keyframes snowflakes-fall{0%{top:-10%}100%{top:100%}}@keyframes snowflakes-shake{0%,100%{transform:translateX(0)}50%{transform:translateX(80px)}}.snowflake{position:fixed;top:-10%;z-index:9999;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;cursor:default;-webkit-animation-name:snowflakes-fall,snowflakes-shake;-webkit-animation-duration:10s,3s;-webkit-animation-timing-function:linear,ease-in-out;-webkit-animation-iteration-count:infinite,infinite;-webkit-animation-play-state:running,running;animation-name:snowflakes-fall,snowflakes-shake;animation-duration:10s,3s;animation-timing-function:linear,ease-in-out;animation-iteration-count:infinite,infinite;animation-play-state:running,running}.snowflake:nth-of-type(0){left:1%;-webkit-animation-delay:0s,0s;animation-delay:0s,0s}.snowflake:nth-of-type(1){left:10%;-webkit-animation-delay:1s,1s;animation-delay:1s,1s}.snowflake:nth-of-type(2){left:20%;-webkit-animation-delay:6s,.5s;animation-delay:6s,.5s}.snowflake:nth-of-type(3){left:30%;-webkit-animation-delay:4s,2s;animation-delay:4s,2s}.snowflake:nth-of-type(4){left:40%;-webkit-animation-delay:2s,2s;animation-delay:2s,2s}.snowflake:nth-of-type(5){left:50%;-webkit-animation-delay:8s,3s;animation-delay:8s,3s}.snowflake:nth-of-type(6){left:60%;-webkit-animation-delay:6s,2s;animation-delay:6s,2s}.snowflake:nth-of-type(7){left:70%;-webkit-animation-delay:2.5s,1s;animation-delay:2.5s,1s}.snowflake:nth-of-type(8){left:80%;-webkit-animation-delay:1s,0s;animation-delay:1s,0s}.snowflake:nth-of-type(9){left:90%;-webkit-animation-delay:3s,1.5s;animation-delay:3s,1.5s}.snowflake:nth-of-type(10){left:25%;-webkit-animation-delay:2s,0s;animation-delay:2s,0s}.snowflake:nth-of-type(11){left:65%;-webkit-animation-delay:4s,2.5s;animation-delay:4s,2.5s}</style>';
    let snowflakes = document.createElement('div');
    snowflakes.className = "snowflakes";
    snowflakes.setAttribute("aria-hidden", "true")
    for (let i = 0; i < amount; i++) {
        snowflakes.innerHTML += `<div class="snowflake">${particles[Math.floor(Math.random()*particles.length)]}</div>`;
    }
    document.body.appendChild(snowflakes);
}

window.addEventListener('load', (event) => {
    let splashies = [
        "trading when?", // annoyingrains
        "Far too many Vukkies <i>and counting!</i>", // socialdalek
        "oh no gacha game", // annoyingrains
        "oh yes gacha game", // socialdalek
        "I wonder if the Vukkybox logo is a Vukky?", // annoyingrains
        "Also try WikiLIT!", // annoyingrains
        "You only have one pull.", // vukky
        "I wonder if this website has any Easter eggs, could you check for me?", // annoyingrains
        "Hi there! I hope you're having a lovely day!", // socialdalek
        "You should join our Discord!", // socialdalek
        "It's actually quite comfy sitting in this box. You just have to trust me.", // socialdalek
        "<b>H</b>", // mot
        "Submit egg text in our Discord!", // socialdalek
        "What happens if you collect <i>all</i> of the Vukkies?", // socialdalek
        "Collect Vukkies trapped in boxes! Or don't, I won't judge.", // socialdalek
        "Collect Vukkies trapped in boxes! Or else...", // skelly
        "Woo!", // annoyingrains
        "Boo!", // vukky
        "whats up my fellow vukkies today we are playing the popular gacha game \"vukkyboc\"", // skelly
        "You people are truly Vukktastic!", // socialdalek
        "\"Gacha, the lootbox mechanic, should not be confused with Gacha Life\" 🤓", // vukky
        "So, wait, I'm a Vukky, but there's also a person called Vukky... huh?", // annoyingrains
        "Vukkybox: Cramming Vukkies in small cardboard boxes since 2021.", // skelly
        "It's not gambling, it's surprise tactics!", // annoyingrains
        "It's not gambling, you have no chance to get your money back!", // skelly
        "Vukkybox: The only game that includes Vukkies AND boxes!", // annoyingrains
        "Fun fact! There's more than one egg text!", // annoyingrains
        "It's gambling, just with your time!", // vukky
        "Vukky: Do the gacha thing.", // socialdalek
        "A young Vukky sits in its box. It just so happens that today is its birthday.", // socialdalek
        "Do a Vukky roll!", // annoyingrains
        "Vukky was not the impostor. 3 impostors remain.", // annoyingrains
        "Vukky was the impostor. 2 impostors remain.", // skelly
        "I'm collecting a vukky and the vukky is you", // socialdalek
        "VUKKY IS YOU", // skelly
        "VUKKY IS FIRE", // skelly
        "Fun fact! Vukkybox is available in a total of one (1) language! Woo!", // annoyingrains
        "Hey guys. Vukksauce, Vukky here. What is a Vukky?", // socialdalek
        "Vukky is not in the sudoers file. This incident will be reported.", // annoyingrains
        "sudo vukkybox --vukkybux 100000", // skelly & vukky
        "I wonder if Vukkybox would work in w3m?", // annoyingrains
        "Sure Vukkybox is great, but can it run Doom?", // socialdalek
        "Sure Vukkybox is great, but can it run Crysis?", // socialdalek 
        "Fun fact! Someone got Vukkybox working on their watch once! It wasn't very easy to play though...", // annoyingrains
        "Fun fact! This egg text was written on the 7th of June, 2022!", // annoyingrains
        "How do I quit Vukkybox?", // vukky
        "This statement is false.", // socialdalek
        "vukky boxing", // pokisan
        "Why doesn't Cheat Engine work on this site? Please fix.", // vukky
        "when are you playing ori", // vukky
        "Fun fact! Someone put Vukky into Beat Saber once! Many Vukkies were killed that day...", // annoyingrains
        "Some boxes have exclusive Vukkies!", // annoyingrains
        "Fun fact! Vukkybox cannot run on the Wii U browser!", // annoyingrains
        "LGBTQ+ rights!", // socialdalek
        "Name's Box. Vukky Box.", // socialdalek
        "It's not the fart that kills you, it's the smell.", // silje
        ":3c", // vukky
        "I wonder who the character wearing a red triangle and holding contracts is?", // skelly
        "What even <i>is</i> a Vukky?", // annoyingrains
        // You can tell we've run out of original ideas by now but that still won't stop us 
        "Whether we wanted it or not, we've stepped into a war with the Cabal on Mars.", // socialdalek
        "Every second you're not running I'm only getting closer.", // socialdalek
        "VoHiYo", // vukky
        "Fun fact! Vukkybox can run on the Nintendo Switch browser!", // annoyingrains
        "Fun fact! Vukkybox cannot run on the PlayStation 5 browser!", // socialdalek
        "Don't forget to feed your Neopets!", // vukky
        "Sussy!", // vukky
        "Click the Buy buttons. To the beat.", // vukky
        "Speedy Vukky goes in, speedy Vukky goes out.", // annoyingrains
        "owo whats this?", // 3of
        "Did you know that the critically acclaimed MMORPG Final Fantasy XIV has a free trial, and includes the entirety of A Realm Reborn AND the award-winning Heavensward expansion up to level 60 with no restrictions on playtime? Sign up, and enjoy Eorzea today! https://secure.square-enix.com/account/app/svc/ffxivregister", // SQUARE ENIX
        "spinny vukky!", // annoyingrains
        "Fun fact! Some Vukkybox players have their own WikiLIT entries!", // annoyingrains
        "Run escape.", // vukky
        "the cake is a lie", // skelly
        "vukture laboratories", // skelly
        "i was eating!! and forgor", // skelly
        "No one knows how Vukkies are made, and why they are stuffed in boxes, but I guess that's for you to figure out!", // annoyingrains
        "There may be hidden bits of lore here somewhere.", // skelly
        "Today on How It's Made: Vukkies!", // skelly
        "Today on What's Inside: Vukkies!", // annoyingrains
        "Vukky murder!", // annoyingrains
        "<s>No</s> LOTS of Vukkies were harmed in the making of this website!", // annoyingrains
        "apt install vukky", // annoyingrains
        "pacman -S vukky", // annoyingrains
        "Vukkybox!", // vukky
        "Random egg text!", // vukky
        "Singleplayer!", // vukky
        "What did you expect? Something funny?", // havefunrich
        "The Vukky is a spy!", // vukky
        "Fun fact! Most of these fun facts aren't that fun, but they are facts!", // annoyingrains
        "Fun fact! This fun fact talks about fun facts, that makes it a meta fun fact, but because it has also acknowledged that, it makes it a double meta fun fact! Spooky!", // annoyingrains
        "Fun fact! These egg texts are written by the community!", // annoyingrains
        "100% more egg text!", // vukky
        "jumpscare!", // annoyingrains
        "You can see who wrote these egg texts by looking at the code on GitHub!", // annoyingrains
        "Remember, grass exists.", // havefunrich
        "We need more egg text!", // annoyingrains
        "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA ONESHOT IS A COOL GAME AND YOU SHOULD PROBABLY PLAY IT :))))))))))))))))))))))))))))", // skelly
        "We leak stuff into our Discord a bit too often.", // annoyingrains
        "We are currently arguing in our Discord! Come join in and pick a side!", // annoyingrains
        "Fun fact! More than one hour has been spent developing this website!", // annoyingrains
        "Fun fact! Egg text does **not** support Markdown!", // annoyingrains
        "Fun fact! Egg text <b>does</b> support HTML!", // vukky
        "Fun fact! we are torturing vukky by forcing him to add more and more egg text", // skelly
        "[ROBOTS EAT BATTERIES]", // skelly
        "According to all known laws of aviation Vukkies should not be able to fly, but they can.", // skelly
        "Some god you are. Please let more Vukkies out of their boxes.", // vukky
        "Today's word of the day is: Vukky!", // socialdalek
        "Why don't you take the Vukky out of the box? It doesn't look very comfortable.", // synne
        "Vinyl is the best audio listening format.", // socialdalek
        "Digital is the best audio listening format.", // socialdalek
        "1D", // vukky
        "Did you know that boxes are made of cardboard?", // synne
        "Fun fact! Boxes have six sides.", // vukky
        "Live long and prosper 🖖", // socialdalek
        "May the force be with you!", // socialdalek
        "<span style='position:fixed;z-index:10000;font-size:10px'>I hate CSS!</span>", // skelly
        "Help me, Vukky-Van Vukkobi. You're my only hope.", // synne
        "123.456.789.10", // socialdalek
        "The force is strong with this Vukky...", // socialdalek
        "May the Vukky be with you.", // skelly
        "Once you start down the Vukky path, forever will it dominate your destiny.", // synne
        "Vukkybox should be a religion.", // mot
        "All rise for the Honorable Vukky", // synne
        "Unfortunately you are Vukkyless.", // skelly
        "Don't blink. Don't even blink. Blink and you're dead. They are fast, faster than you can believe. Don't turn your back, don't look away, and don't blink. Good luck.", // socialdalek
        "We may not have much in common, you and I. Still, I consider you as a friend.", // socialdalek
        "Science demands we explode the sun!", // socialdalek
        "The future depends on the past, even if we don't get to see it.", // socialdalek
        "Do you even Vukkybox bro?", // synne
        "Hypothesis: Vukkies are actually extremely powerful creatures.", // skelly
        "I warned you about those Vukkies bro! I told you dawg!!", // socialdalek
        "can i haz vukyz?", // vukky
        "Hypothesis: Vukkies are the source of all ghost matter in the universe.", // skelly
        "Can you close the tab, please? I want to sleep now...", // vukky
        "As a child, I considered such unknowns sinister. Now, though, I understand they bear no ill will. The universe is, and we are.", // socialdalek
        "Are Vukkies the littlefish, or are they blind?", // skelly
        "You destroyed the fabric of spacetime.",  // skelly
        "(McMuffin) Egg (&) text(ing sounds nice...)", // nancy
        "A concious observer has entered the Vukkybox.", // vukky
        "McDonald's or Burger King?", // vukky
        "How long have you been here? Minutes? Years? You are unsure but it seems your journey has reached its end.", // socialdalek
        "AM I NOT REAL?", // vukky
        "Pancakes...", // vukky
        "Fun fact! The chance of getting a unique Vukky in the shark box is less than 0.1%!", // skelly
        "uwu", // 3of
        "The final choice is up to you.", // socialdalek
        "Why are you reading this? Go back to opening boxes!", // 3of
        "Vukky Funko Pop when?", // socialdalek
        "Fun fact! The chance of obtaining a unique Vukky from a Beggars box is definitely 100%, not 0%.", // 3of
        "Now with less furries!", // 3of
        "Now with extra furries!", // socialdalek
        "Now with extra caffeine!", // 3of
        "*snap* yep that one's going into the cringe compilation", // socialdalek
        "Mint now! Vukky NFTs are being sold out quickly. Only 69 remain! Only for 420 ETH!", // 3of
        "Vukky used box... It's super effective!", // synne
        "All your Vukky are belong to us", // synne
        "Boxyvuk when", // mot
        "Now gluten free!", // 3of
        "This Summer don't forget to buy Vukkybox Deluxe Edition! Only on Nintendo Wii U.", // socialdalek
        "Buy 3 Get 2 Vukkies!", // synne
        "Buy 1 Get 0, because you ran out of Vukkybux!", // vukky
        "Peeps help I'm trapped in the Metaverse!", // socialdalek
        "Anybody there? Please help me I am stuck in a box", // 3of
        "Look for the Vukkybox album in stores on November 13th with lots of music, videos, and extras.", // socialdalek
        "All my friends are being sold in boxes... Is this how Animal Crossing works?", // vukky
        "All right, I've been thinking, when life gives you Vukkies, don't make Vukkyaid! Make life take the Vukkies back! Get mad! I don't want your damn Vukkies! What am I supposed to do with these? Demand to see life's manager! Make life rue the day it thought it could give Cave Johnson Vukkies! Do you know who I am? I'm the man whose gonna burn your house down - with the Vukkies!", // annoyingrains
        "Bring back r/place", // synne
        "Posture check!", // mot
        "Free the vukkies from the boxes by opening more boxes.", // 3of
        "Help! I can't breathe in here...", // mitch
        "Vukkybox addiction is proven to be better than a gambling addiction.", // 3of
        "r/place was better", // annoyingrains
        "blame vukky", // 3of
        "What is this, some kinda Bored Apes ripoff?", // socialdalek
        "Life is like a box of Vukkies. You never know what you're gonna get.", // synne
        "why are you buying VUKKIES at the SOUP STORE?", // laker
        "if you are reading this you are cute", // 3of
        "If you are reading this, you can read.", // synne
        "If you are reading this, you might not be blind!", // mitch
        "If you are reading this, you are reading this.", // socialdalek
        "Fun fact! Vukkies are made of [REDACTED].", // synne
        "Vukkybox includes now more fursuits than ever in the boxes!", // 3of
        "If you are reading this, you are lucky! You got this egg text out of hundreds! I think you used up your luck for today on that, though.", // vukky
        "Thanks to Vukkybox, my life's never been better!", // socialdalek
        "Just like copper, bad things happen when you microwave a Vukky.", // mitch
        "what", // mot
        "I'm stupid.", // vukky
        "You can't escape Vukky and its boxes.", // 3of
        "I forgor",
        "Periwinkle > Orangered", // synne
        "Congratulations, you just advanced an Egg Text level. Your Egg Text level is now 99.", // vukky
        "get a free 14 day trial of vukkybox+ by buying this stupid jpeg on some nature destroying blockchain thingy", // 3of
        "\"If you put Vukkies in a box, they can't hurt you\" - Sun Tzu", // vukky
        "Vukkybox: still a better love story than Twilight.", // synne
        "Use code actuallyfree for free Vukkybux!", // vukky
        "its scientifically proven you are cute!", // 3of
        "One single Vukky contains all the vitamins and minerals your body needs daily to function well.", // synne
        "<img src='https://i.imgur.com/XTVHgGl.png'>", // vukky
        "Don't forget to apply sunscreen! A burnt Vukky is a sad Vukky.", // synne
        "vukkybox pro series is the official vukkybox esports league!", // 3of
        "Fun fact! This text is called the \"egg text\".", // skelly
        "Are ya winning son?", // havefunrich
        "this is where we put bad jokes we couldnt fit elsewhere on the site", // skelly
        "the backend of this site is a giant mess :D",
        "CSS is #000000 magic", // skelly
        "<span style='transform: scale(-1, -1); display: inline-block'>This egg text goes out for all of the Aussies out there!</span>", // socialdalek
        "English is an awful language I'm so glad to be here speaking it", // socialdalek
        "Fortnite is actually cool y'all just like hating on it because it's popular", // socialdalek
        "<span style='transform: scale(-1, -1); display: inline-block'>lift your monitor up from the desk and rotate it to read this useless piece of egg text", // 3of
        "They aren't thigh highs! They're just highly optimized programmer socks.", // socialdalek
        "No", // silje
        "I swear it's just a maid outfit and programming socks I am definitely not a femboy.", // 3of
        "Gachapon games are the 8th deadly sin.", // socialdalek
        "Feed me.", // silje
        "Now with more lean!", // 3of
        "Don't forget to buy your Vukky themed programmer socks from the official Vukky store!", // socialdalek
        "Click on me!", // silje
        "dont play with fire please", // 3of
        "Chewing on ice cubes is bad for your teeth", // socialdalek
        "omnomnomnomnomnomnomnom mcdonalds ice cubes", // vukky
        "I love cheese.", // silje
        "404 egg text not found", // 3of
        "the vending machine is missing item number 404, why is everyone around me dying??", // skelly
        "Welcome!", // silje
        "You'll never find out where we keep all the boxed up Vukkies.", // socialdalek
        "<span style=\"background-image: linear-gradient(to left, violet, indigo, blue, green, yellow, orange, red);-webkit-background-clip: text;color: transparent;\">extra shiny</span>", // skelly
        "Reject humanity. Become Vukky.", // socialdalek
        "noclips & glitches out of vukkybox cutely", // 3of
        "Fun fact! Egg Text stands for Egg Gg G Text Ext Xt T.", // skelly
        "Text Egg", // socialdalek
        "Now with more eggs!", // 3of
        function() { // mitch
			document.querySelector("#icon").style.filter="invert()"
			return "Spooky!"
		},
        "USB-C is the superior charging connector.", // 3of
        "Omelette", // socialdalek
        "Do you think you could take over for me? It's really hard work up in this corner is all.", // socialdalek
        "I'm too full to eat more.", // silje
        "So what's the deal with airline food?", // socialdalek
        function() { return `There are ${splashies.length} different egg texts!` }, // skelly
        "How much ground could a groundhog hog if a groundhog could hog ground?", // phrotonz
        "Vukkybox is so eggciting!", // nancy,
        "You don't have to send that meme to your friend. They already reddit.", // synne
        "The fun will never end!", // socialdalek
        "Nothing interesting happens.", // vukky
        "Send this egg text to 10 friends for a free nothing!", // vukky
        "What is a Vukky anyways? What does it eat? What does it do?", // username42
        "Never gonna vukk you up, never gonna vukk you down, never gonna vukk around and vukky you", //username42
        "How does one get an egg to text?", // laker
        "My ex-wife still misses me… <i>but her aim is getting better!</i>", // socialdalek
        "git commit -m \"some changes\" && git push" // socialdalek
    ];
    window.eggtippy = tippy('#icon', {
        content: splashies[Math.floor(Math.random()*splashies.length)],
        placement: 'left',
        allowHTML: true
    });
    if(document.querySelector("#icon:hover") != null) {
        window.eggtippy[0].show();
    }
    const noAnim = !window.matchMedia("(prefers-reduced-motion: reduce)") || window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if(!noAnim) {
        if(localStorage.getItem("seasonalFlair") != "false") {
            // Simple logo swaps or particles
            if(new Date().getMonth() == 0 && new Date().getDate() == 1) { rainParticles(["<img width='32' src='https://raw.githubusercontent.com/Vukkyy/vukmoji/webp/emojis/events/static/vukkynewyear.webp'>"], 12); }
            if(new Date().getMonth() == 0 && new Date().getDate() == 4) { rainParticles(["<img width='32' src='https://raw.githubusercontent.com/Vukkyy/vukmoji/webp/emojis/events/static/vukkynewyear.webp'>"], 12); }
            if(new Date().getMonth() == 1 && new Date().getDate() == 14) { icon.src = "/resources/icons/rs.png"; }
            // Logo swaps and particles (use with care, usually during major things, not just "make fire lol")
            if(new Date().getMonth() == 10 && new Date().getDate() == 11) {
                icon.src = "/resources/firevukkybox.webp";
                rainParticles(["<img width='32' src='https://raw.githubusercontent.com/Vukkyy/vukmoji/webp/emojis/vukkybox/birtdayvuky.webp'>"], 12);
            }
            if(new Date().getMonth() == 11) {
                icon.src = "/resources/icons/santa.png";
                rainParticles(["<img width='32' src='https://raw.githubusercontent.com/Vukkyy/vukmoji/webp/emojis/vukkybox/giftvukky.webp'>", "<img width='32' src='https://raw.githubusercontent.com/Vukkyy/vukmoji/webp/emojis/events/static/vukkychristmas.webp'>"], 12);
            }
            // More fancy stuff (use with extreme care, like you know er erm april fool'd lol)
            if(new Date().getMonth() == 3 && new Date().getDate() == 1) {
                icon.src = "/resources/beggarsvukkybox.webp";
                rainParticles(["<img width='32' src='https://raw.githubusercontent.com/Vukkyy/vukmoji/webp/emojis/vukkybox/glitchedvukky.webp'>", "<img width='32' src='https://raw.githubusercontent.com/Vukkyy/vukmoji/webp/emojis/vukkybox/deformedvukky.webp'>", "<img width='32' src='https://raw.githubusercontent.com/Vukkyy/vukmoji/webp/emojis/vukkybox/deepfriedvukky.webp'>"], 12);
                setInterval(function() {
                    document.querySelectorAll("audio[type=music]").forEach(function(node) {
                        node.fastSeek(0 + Math.random() * (node.duration - 0));
                    })
                }, 300)
                setInterval(() => {
                    rainParticles(["<img width='32' src='https://raw.githubusercontent.com/Vukkyy/vukmoji/webp/emojis/vukkybox/glitchedvukky.webp'>", "<img width='32' src='https://raw.githubusercontent.com/Vukkyy/vukmoji/webp/emojis/vukkybox/deformedvukky.webp'>", "<img width='32' src='https://raw.githubusercontent.com/Vukkyy/vukmoji/webp/emojis/vukkybox/deepfriedvukky.webp'>"], 12);
                }, 4000 + Math.random() * (1500 - 4000));
            }
        }
        icon.classList.add("duration-150");
        icon.onclick = function(){
            icon.classList.add("animate-ping");
            setTimeout(() => {
                icon.classList.remove("animate-ping");
                icon.style.display = "none";
            }, 200);
        };
    }

    document.querySelectorAll("audio").forEach(function(node) {
        if(node.getAttribute("type") == "music" && localStorage.getItem("musicVolume")) {
            node.volume = localStorage.getItem("musicVolume");
        } else if (node.getAttribute("type") == "sfx" && localStorage.getItem("sfxVolume")) {
            node.volume = localStorage.getItem("sfxVolume");
        }
        if(node.getAttribute("playOnLoad") == "true") {
            node.play();
        }
    })
    if(document.querySelector("a[href='/']") && document.querySelector("a[href='/']").parentNode && document.querySelector("a[href='/']").parentNode.querySelector("p")) document.querySelector("a[href='/']").parentNode.querySelector("p").id = "balance";
    if(document.querySelector("#balance")) {
        balance.innerHTML = parseFloat(balance.innerText.split(" Vukkybux")).toLocaleString() + " Vukkybux";
        document.querySelector("#balance").onclick = function() {
            document.location.pathname = "balance";
        };
        document.querySelector("#balance").onmouseenter = function() {
            document.querySelector("#balance").style.cursor = "pointer";
        };
        document.querySelector("#balance").onmouseout = function() {
            document.querySelector("#balance").style.cursor = "";
        };
    }
    document.querySelectorAll("a").forEach(function(node) {
        node.addEventListener("click", function() {
            let audioEffectThing = new Audio('/resources/select.flac');
            if(localStorage.getItem("sfxVolume")) audioEffectThing.volume = localStorage.getItem("sfxVolume");
            audioEffectThing.play();
        })
    })
    document.querySelectorAll(".purchase").forEach(function(node) {
        if(localStorage.getItem("kachingOn") != "false") {
            if(window.location.pathname == "/store" && document.getElementById("loggedIn").value == "0") return false;
            node.addEventListener("click", function() {
                let audioEffectThing = new Audio('/resources/purchase.wav');
                if(localStorage.getItem("sfxVolume")) audioEffectThing.volume = localStorage.getItem("sfxVolume");
                audioEffectThing.play();
            })
        }
    })
    if(document.querySelector("#redeemCode")) {
        document.querySelector("#redeemCode").onclick = function() {
            let codename = prompt("Enter the code you would like to redeem.");
            if (codename == "sharkbox") return document.location.pathname = "/buyBox/shark";
            if(codename != null && codename != "") {
                document.location.pathname = `/redeem/${codename}`
            }
        }
    }
});

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/pwasw.js', { scope: "/" })
    .catch(function(error) {
      console.log('Service worker registration failed, error:', error);
    });
}