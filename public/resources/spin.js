window.addEventListener('load', (event) => {
    icon.classList.add("duration-150");
    icon.onclick = function(){
        icon.classList.add("animate-ping");
        setTimeout(() => {
            icon.classList.remove("animate-ping");
            icon.style.display = "none";
        }, 200);
    };
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
});