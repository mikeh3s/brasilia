var saved;  
if (typeof window.onload == 'function') {  
            saved = window.onload;  
}  
window.onload = function() {  
            if (saved) saved();  
            var node_div = document.createElement("div");
	  node_div.setAttribute("id","imgContent");
	  node_div.setAttribute("style","position:fixed;top:10px;left:10px;z-index:99999");
	  var bodyContainer=document.getElementsByTagName("body")[0];
	  bodyContainer.appendChild(node_div);
	  var node_a = document.createElement("a");
	  node_a.setAttribute("href","http://www.visionchina.tv/");
	  node_a.setAttribute("id","imgHref");
	  document.getElementById("imgContent").appendChild(node_a);
	  var node_img = document.createElement("img");
	  node_img.setAttribute("src","http://pic.baike.soso.com/p/20090715/20090715074929-746995971.jpg");
	  document.getElementById("imgHref").appendChild(node_img);
};  