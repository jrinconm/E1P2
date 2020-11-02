// Inicializo el contador de tiradas globalmente
var tiradas=0;
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
        // Genero la tabla pedida
        let nuevaTabla=$('<table id="tablero"></table>');
        $("#nuevoDiv").append(nuevaTabla);
        for(let x=0; x<10;x++){
            let fila=$('<tr></tr>');            
            $("#tablero").append(fila);
            // Para controlar las filas, voy a ponerles una clase
            $("#tablero tr:last").addClass('tr'+x);
            for(let y=0;y<10;y++){
                let celda=$('<td><img src="suelo.png"/></td>');
                $("#tablero tr:last").append(celda);
                // Para controlar las celdas, voy a ponerles una clase
                $("#tablero tr:last td:last").addClass('td'+y);
            }
        }
        // Cambio la primera fila primera celda a nuestro heroe
        $("#tablero tr:nth-child(1) td:nth-child(1) img").attr("src","link_sur.png");
        $("#jugar").prop('disabled',false);
        // Cambio boton enviar por boton tirar dado
        cambiaDado();
    } else {
        // Solo hay 2 opciones, pero por si acaso
        alert("Opción no contemplada");
    }
}
// Funcion que cambia el boton enviar por un boton "Dado"
function cambiaDado(){
    //Quito el listener
    $("#enviar").off("click");
    // Le cambio el id para que sea acorde con la accion
    $("#enviar").attr("id","tirarDado");
    // Le cambio el texto
    //$("#tirarDado").attr("value","Tirar dado");
    //Quito el texto, no me gusta
    $("#tirarDado").attr("value","");
    // Le pongo imagen 
    $("#tirarDado").css("background-image","url(Alea_1.png)");
    // No quiero multiplcarla
    $("#tirarDado").css("background-repeat","no-repeat");
    // Quiero que cubra el boton
    $("#tirarDado").css("background-size","cover");
    // Hago el botón de un tamaño razonable
    $("#tirarDado").css("height","8rem");
    $("#tirarDado").css("width","8rem");
    // Le quito el borde y el color al boton
    $("#tirarDado").css("border","none");
    $("#tirarDado").css("background-color","none");
    // Le pongo un listener nuevo
    $("#tirarDado").click(tiraDado);
}
function tiraDado(){
    // Aleatorio entre el 1 y el 6
    let tirada = Math.floor(Math.random() * 5) + 1;
    // Construyo la imagen que es "Alea_" y el numero
    let imagen = "Alea_" + tirada + ".png"
    $("#tirarDado").css("background-image","url("+imagen+")");
    tiradas++;
    console.log(tiradas);
}