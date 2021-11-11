window.addEventListener('load', (event) => {
    icon.classList.add("duration-150");
    icon.onclick = function(){
        icon.classList.add("animate-ping");
        setTimeout(() => {
            icon.classList.remove("animate-ping");
            icon.style.display = "none";
        }, 200);
    };
    document.querySelector("a[href='/']").parentNode.querySelector("p").onclick = function() {
        document.location.pathname = "balance";
    };
    document.querySelector("a[href='/']").parentNode.querySelector("p").onmouseenter = function() {
        document.querySelector("a[href='/']").parentNode.querySelector("p").style.cursor = "pointer";
    };
    document.querySelector("a[href='/']").parentNode.querySelector("p").onmouseout = function() {
        document.querySelector("a[href='/']").parentNode.querySelector("p").style.cursor = "";
    };
});