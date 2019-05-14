let i = 0;
let images = [];
let time = 3000;

// Image List
images[0] = '../../advertisement/images/'+ namePage +'/had1.jpg';
images[1] = '../../advertisement/images/'+ namePage +'/had2.jpg';
images[2] = '../../advertisement/images/'+ namePage +'/had3.jpg';

// Change Image

let changeImg = function(){
    document.slide.src = images[i];
    
    if (i < images.length -1)
    {
        i++;
    }
    else
    {
        i = 0;
    }
    
    setTimeout("changeImg()", time);
}
window.onload = changeImg;

$(document).ready(function() {
    $('#slider').html("<div class='row'>" +
        "<div class='col-12 position-relative slide slide'>" +
            "<img name='slide' alt='No carga xd'>" +
        "</div>" +
    "</div>");
        
});
