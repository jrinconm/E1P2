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
        .done(function(msg) { compruebaMsg(msg); })
        .fail(function() { alert("Ha fallado la consulta") })
    }
}
// Compruebo el mensaje que responde el servidor
function compruebaMsg(msg){
    // Si el mensaje es error indico que deben ser impar las letras
    if(msg=="ERROR"){
        alert("Por favor introduzca una cantidad de letras impar");
    // Si da OK realizamos los cambios
    } else if (msg=="OK"){
        // Creo un div con un p
        let nuevoDiv=$('<div id="nuevoDiv"><p></p></div>')
        if(!$("#nuevoDiv").length){
            //Lo añado al cuerpo
            $("body").append(nuevoDiv);
        }

        // Pongo el texto pedido
        $("#nuevoDiv").html("A luchar héroe :" + $("#nombre").val());
        $("#jugar").prop('disabled',false);
    } else {
        // Solo hay 2 opciones, pero por si acaso
        alert("Opción no contemplada");
    }
}