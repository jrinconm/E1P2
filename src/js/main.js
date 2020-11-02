$(document).ready(function (){
    // añado al id enviar el listener click que lanzar la funcion compruebaNombre
    $("#enviar").click(compruebaNombre);
});
// Compruebo el campo nombre
function compruebaNombre(){
    let nombre=$("#nombre").val();
    // Que sea mayor o igual a 4
    if(nombre.length < 4){
        alert("El nombre debe tener 4 o más letras");
        // Que no tenga ningún digito
    } else if (/[\d]{1,}/.test(nombre)){
        alert("Números no permitidos");
        // Hago la peticion ajax
    } else {
        $.ajax({ method:"POST", url:"https://apuntesfpinformatica.es/DWEC/entregable1-2.php", 
        data:{ nombre : nombre} })
        .done(function(msg) { alert("Recibo: " + msg); })
        .fail(function() { alert("Error"); })
        .always(function() { alert("Trabajo realizado"); }); // Ajax 
    }
}
