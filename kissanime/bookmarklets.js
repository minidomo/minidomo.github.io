// Javascript code for the bookmarklets.
// Use https://mrcoles.com/bookmarklet/ or something else to convert the javascript to a bookmarklet.

// KissAnime
try {
    var div = document.getElementById("divContentVideo");
    var contents = div.innerHTML;
    var srcIndex = contents.indexOf("src") + 5;
    var halfweb = contents.substring(srcIndex);
    var website = halfweb.substring(0, halfweb.indexOf("\""));
    window.location = website;
} catch (err) {
    alert("Must be on KissAnime and the correct page.");
}

// RapidVideo
try {
    var div = document.getElementById("videojs_html5_api");
    var contents = div.innerHTML;
    var srcIndex = contents.indexOf("src") + 5;
    var halfweb = contents.substring(srcIndex);
    var website = halfweb.substring(0, halfweb.indexOf("\""));
    window.location = website;
} catch (err) {
    alert("Must be on RapidVideo and the correct page.");
}