$(document).ready(function(){
    /** GET ID */
    let menu_options = {
        news: $('#news'),
        travel: $('#travel'),
        portals: $('#portals'),
        movies: $('#movies'),
        series: $('#series'),
        music: $('#music')
    };
    /** GET LINK */
    let links = {
        news: "../../news/web/news.html",
        travel: "../../travel/web/travel.html",
        portals: "../../internet/web/portals.html",
        movies: "../../video/web/movies.html",
        series: "../../video/web/series.html",
        music: "../../music/web/music.html"
    };
    /** REDIRECT PAGE */
    for(let prop in menu_options)
    {
        menu_options[prop].click(function(){

            location.href = links[prop];
        });
    }
});