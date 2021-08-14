window.addEventListener('load', (event) => {
    icon.classList.add("duration-150");
    icon.onclick = function(){
        icon.classList.add("animate-ping");
        setTimeout(() => {
            icon.classList.remove("animate-ping");
            icon.style.display = "none";
        }, 200);
    }
});