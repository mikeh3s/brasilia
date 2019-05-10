Inicia con index.html.
Este archivo hace un redireccionamiento a homePage/web/full.html
full.html
En full.html el muestra la publicidad con codigo AJAX, JSON para mostrar las imagenes
tambien utiliza JQUERY.
Despues del intervalo determinado de tiempo que se configura en:
src: advertisement/data/010001 este archivo es llamado atravez de JSON
la pagina se redirecciona a homePage.html
src: homePage/web/homePage.html
homePage.html
Aqui corre la pagina principal para seleccionar cada una de las funcionalidades
de la aplicacion. Esta pagina llama un codigo en javascript.
src: homePage/js/homePage.js
Este codigo llama las imagenes de los difetentes anuncios y envia informacion por AJAX
sobre los click que se le dan a los anuncios y segun los intervalos determina
cuanto tiempo ve la persona determinado anuncio.


El archivo init_data.php por medio de llamar a get_config.php
optiene la informacion de el dispositivo.

El archivo get_config.php es el que extrae la informaciòn que hay
en lo siguientes archivos.
Directorios:
/tmp/device.info
/tmp/hdconfig/run.conf

Despues el archivo init_data.php llama al archivo get_config.php
y guarda la IP la MAC y el SN en el array predefinido $_SESSION.
