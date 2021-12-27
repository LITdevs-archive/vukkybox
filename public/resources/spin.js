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
    const noAnim = !window.matchMedia("(prefers-reduced-motion: reduce)") || window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if(!noAnim) {
        if(new Date().getMonth() == 11) {
            icon.src = "https://vukkybox.com/resources/icons/santa.png";
            rainParticles(["❅", "❆"], 12)
        }
        if(new Date().getMonth() === 3 && new Date().getDate() === 1) {
            icon.src = "https://vukkybox.com/resources/beggarsvukkybox.webp";
            rainParticles(["undefined", "@everyone", "arch btw", '"woo"'], 12);
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
    })
    if(document.querySelector("a[href='/']") && document.querySelector("a[href='/']").parentNode && document.querySelector("a[href='/']").parentNode.querySelector("p")) document.querySelector("a[href='/']").parentNode.querySelector("p").id = "balance";
    if(document.querySelector("#balance")) {
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