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
        "We leak stuff into their Discord a bit too often.", // annoyingrains
        "We are currently arguing in our Discord! Come join in and pick a side!", // annoyingrains
        "Fun fact! More than one hour has been spent developing this website!", // annoyingrains
        "Fun fact! Egg text does **not** support Markdown!", // annoyingrains
        "Fun fact! Egg text <b>does<b> support HTML!", // vukky
        "Fun fact! we are torturing vukky by forcing him to add more and more egg text", // skelly
        "[ROBOTS EAT BATTERIES]" // skelly
    ];
    tippy('#icon', {
        content: splashies[Math.floor(Math.random()*splashies.length)],
        placement: 'left',
        allowHTML: true
    });
    const noAnim = !window.matchMedia("(prefers-reduced-motion: reduce)") || window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if(!noAnim) {
        if(localStorage.getItem("seasonalFlair") != "false") {
            // Simple logo swaps or particles
            if(new Date().getMonth() == 0 && new Date().getDate() == 1) { rainParticles(["<img width='32' src='https://raw.githubusercontent.com/Vukkyy/vukmoji/webp/emojis/events/static/vukkynewyear.webp'>"], 12); }
            if(new Date().getMonth() == 0 && new Date().getDate() == 4) { rainParticles(["<img width='32' src='https://raw.githubusercontent.com/Vukkyy/vukmoji/webp/emojis/events/static/vukkynewyear.webp'>"], 12); }
            if(new Date().getMonth() == 1 && new Date().getDate() == 14) { icon.src = "https://vukkybox.com/resources/icons/rs.png"; }
            // Logo swaps and particles (use with care, usually during major things, not just "make fire lol")
            if(new Date().getMonth() == 10 && new Date().getDate() == 11) {
                icon.src = "https://vukkybox.com/resources/firevukkybox.webp";
                rainParticles(["<img width='32' src='https://raw.githubusercontent.com/Vukkyy/vukmoji/webp/emojis/vukkybox/birtdayvuky.webp'>"], 12);
            }
            if(new Date().getMonth() == 11) {
                icon.src = "https://vukkybox.com/resources/icons/santa.png";
                rainParticles(["<img width='32' src='https://raw.githubusercontent.com/Vukkyy/vukmoji/webp/emojis/vukkybox/giftvukky.webp'>", "<img width='32' src='https://raw.githubusercontent.com/Vukkyy/vukmoji/webp/emojis/events/static/vukkychristmas.webp'>"], 12);
            }
            // More fancy stuff
            if(new Date().getMonth() == 3 && new Date().getDate() == 1) {
                icon.src = "https://vukkybox.com/resources/beggarsvukkybox.webp";
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
            let audioEffectThing = new Audio('https://vukkybox.com/resources/select.flac');
            if(localStorage.getItem("sfxVolume")) audioEffectThing.volume = localStorage.getItem("sfxVolume");
            audioEffectThing.play();
        })
    })
    document.querySelectorAll(".purchase").forEach(function(node) {
        if(localStorage.getItem("kachingOn") != "false") {
            if(window.location.pathname == "/store" && document.getElementById("loggedIn").value == "0") return false;
            node.addEventListener("click", function() {
                let audioEffectThing = new Audio('https://vukkybox.com/resources/purchase.wav');
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