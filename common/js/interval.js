// Funcion que crea la ventana modal y la lanza cada cierto tiempo

let modal = document.getElementById('modal-window');
let flex = document.getElementById('flex');
let open = document.getElementById('open');
let close = document.getElementById('close');

open.addEventListener('click', function(){
  modal.style.display = 'block';
});

close.addEventListener('click', function(){
  modal.style.display = 'none';
});
// Función que nos permite cerrar el modal desde fuera de la ventana
// window.addEventListener('click', function(e){
//   if(e.target == flex){
//     modal.style.display = 'none';
//   }
// });
function inicio() {
    modal.style.display = 'block';
    setInterval(close.addEventListener('click', function(){
      modal.style.display = 'none';
    }));
}




window.onload = inicio();
