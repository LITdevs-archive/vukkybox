function fardedLol() {
    navigator.clipboard.writeText("https://vukkybox.com/view/6/312").then(function() {
        alert("Copied to clipboard!");
        document.location.href = "https://vukkybox.com/view/6/312";
    });
}
if(document.location.search == "?copytv") {
    document.body.innerHTML = `<span class="button button-blue" onclick="fardedLol();">CLICK HERE TO COPY PLEASE</button>`
}
if(document.location.search != "?notv" && document.location.search != "?copytv") {
    document.title = "VukkyTV";
    var script = document.createElement('script');
    script.setAttribute('src', '/resources/imagemap.js');
    script.setAttribute('type', 'text/javascript');
    script.onload = function() { 
        document.body.innerHTML = `<audio loop="" autoplay="" src="https://vukkybox.com/resources/unboxwebtv.ogg"></audio><img src="https://vukkybox.com/resources/webtvvukky.webp" usemap="#webtvui" width="100%" height="100%">
        <map name="webtvui">
            <area target="" alt="VIEW BALANCE" title="VIEW BALANCE" href="https://vukkybox.com/balance" coords="0,117,138,143" shape="rect">
            <area target="" alt="COPY LINK TO HILARIOUS PAGE" title="COPY LINK TO HILARIOUS PAGE" href="https://vukkybox.com/view/6/312?copytv" coords="139,175,0,145" shape="rect">
            <area target="" alt="GO HOME (I DON'T LIKE YOU)" title="GO HOME (I DON'T LIKE YOU)" href="https://vukkybox.com" coords="133,106,7,5" shape="rect">
            <area target="" alt="SEND EMAIL TO CREATORS OF FUNNY CREATION" title="SEND EMAIL TO CREATORS OF FUNNY CREATION" href="mailto:contact@vukkybox.com" coords="239,103,154,7" shape="rect">
            <area target="" alt="VIEW GALLERY" title="VIEW GALLERY" href="https://vukkybox.com/gallery" coords="253,9,338,101" shape="rect">
            <area target="" alt="VIEW SOURCE CODE" title="VIEW SOURCE CODE" href="https://github.com/litdevs/vukkybox" coords="437,101,366,8" shape="rect">
            <area target="" alt="YOU SHALL BUY THESE THINGS" title="YOU SHALL BUY THESE THINGS" href="https://vukkybox.com/store" coords="531,102,449,8" shape="rect">
            <area target="" alt="JOIN DISCORD...?" title="JOIN DISCORD...?" href="https://discord.gg/TJ6BfgXffa" coords="249,381,157,293" shape="rect">
            <area target="" alt="UPDATE TO THE LATEST VUKKYTV VERSION" title="UPDATE TO THE LATEST VUKKYTV VERSION" href="https://vukkybox.com/view/6/312?notv" coords="528,261,172,137" shape="rect">
            <area target="" alt="WEB-TV GUIDE (HA HA)" title="WEB-TV GUIDE (HA HA)" href="https://vukkybox.com/credits" coords="268,295,352,379" shape="rect">
            <area target="" alt="EDUCATIONAL CONTENT" title="EDUCATIONAL CONTENT" href="https://www.gwern.net/docs/cs/2001-12-02-treginaldgibbons-isyoursonacomputerhacker.html" coords="362,297,440,378" shape="rect">
            <area target="" alt="E" title="E" href="https://www.youtube.com/watch?v=74qsaPK6TCc" coords="453,297,546,379" shape="rect">
        </map>`
        imageMapResize() 
    }
    document.getElementsByTagName('head')[0].appendChild(script);
}
if(document.location.search == "?notv") {
    document.title = "Vukkybox - WebTV Vukky (#312)";
    window.addEventListener('load', (event) => {
        document.querySelector("audio").src = "https://vukkybox.com/resources/unboxmsntv.ogg"
        document.querySelector("audio").play();
    });
}