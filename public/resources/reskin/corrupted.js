document.querySelector("nav").remove();
document.body.classList = [];
window.addEventListener('load', (event) => {
    document.querySelectorAll("button").forEach(function(node) {
        node.remove();
    })
});