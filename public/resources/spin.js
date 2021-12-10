window.addEventListener('load', (event) => {
    const noAnim = !window.matchMedia("(prefers-reduced-motion: reduce)") || window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if(!noAnim) {
        icon.classList.add("duration-150");
        icon.onclick = function(){
            icon.classList.add("animate-ping");
            setTimeout(() => {
                icon.classList.remove("animate-ping");
                icon.style.display = "none";
            }, 200);
        };
    }
    document.querySelector("a[href='/']").parentNode.querySelector("p").id = "balance";
    document.querySelector("#balance").onclick = function() {
        document.location.pathname = "balance";
    };
    document.querySelector("#balance").onmouseenter = function() {
        document.querySelector("#balance").style.cursor = "pointer";
    };
    document.querySelector("#balance").onmouseout = function() {
        document.querySelector("#balance").style.cursor = "";
    };
    document.querySelectorAll("a").forEach(function(node) {
        node.addEventListener("click", function() {
            new Audio('https://vukkybox.com/resources/select.flac').play();
        })
    })
    document.querySelectorAll(".purchase").forEach(function(node) {
        if(localStorage.getItem("kachingOn") != "false") {
            node.addEventListener("click", function() {
                new Audio('https://vukkybox.com/resources/purchase.wav').play();
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