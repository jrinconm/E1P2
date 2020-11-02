'use strict';
// Inicializo el contador de tiradas globalmente
var numeroTiradas=0;
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
                let celda=$('<td><img /></td>');
                $("#tablero tr:last").append(celda);
                // Para controlar las celdas, voy a ponerles una clase
                $("#tablero tr:last td:last").addClass('td'+y);
            }
        }
        // Pongo nuestro heroe en su clase
        $("#tablero tr:nth-child(1) td:nth-child(1) img").addClass("heroe");
        // Pongo el cofre en su clase
        $("#tablero tr:nth-child(10) td:nth-child(10) img").addClass("cofre");
        // Habilito el jugar
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
    numeroTiradas++;
    generarOpciones(tirada);
    // Le quito el listener para que se mueva si o si
    $("#tirarDado").off("click");
}
function generarOpciones(movimiento){
    //Posicion X
    let posicionx=$(".heroe").parent().attr('class').slice(2,3);
    //Posicion Y
    let posiciony=$(".heroe").parent().parent().attr('class').slice(2,3);
    //Por el norte
    let posiblePosicion=calcularMovimiento(posiciony,-movimiento);
    if(posiblePosicion){
        posibleCelda(posicionx,posiblePosicion,"norte");
    }
    //Por el sur
    posiblePosicion=calcularMovimiento(posiciony,movimiento);
    if(posiblePosicion){
        posibleCelda(posicionx,posiblePosicion,"sur");
    }
    //Por el oeste
    posiblePosicion=calcularMovimiento(posicionx,-movimiento);
    if(posiblePosicion){
        posibleCelda(posiblePosicion,posiciony,"oeste");
    }
    //Por la derecha
    posiblePosicion=calcularMovimiento(posicionx,movimiento);
    if(posiblePosicion){
        posibleCelda(posiblePosicion,posiciony,"este");
    }
}
function calcularMovimiento(posicion,movimiento){
    // Cambio y a numero
    posicion=parseInt(posicion);
    if(posicion+movimiento>9){
        return false;
    } else {
        //
        return (posicion+movimiento);
    }
}
function posibleCelda(posicionX,posicionY,direccion){
    // Construyo las clases de las filas y celdas
    let claseX="td"+posicionX;
    let claseY="tr"+posicionY;
    // Añado la clase posible a esa combinacion
    $("." + claseY + " ." + claseX).addClass('posible');
    //Indico la orientacion del muñeco por clase
    $("img","." + claseY + " ." + claseX).addClass(direccion);
    //Le añado la opcion de mover el heroe al hacer click
    $("." + claseY + " ." + claseX).click(moverHeroe);
}
function moverHeroe(){
    //Guardo la posicion
    let direccion=$("img",this).attr("class");
    // Quito las opciones y al heroe
    limpiaCeldas();
    // Muevo la clase heroe a la nueva celda y lo pinto
    $("img",this).addClass("heroe");
    $("img",this).addClass(direccion);
    // compruebo si la clase heroe y la clase cofre están en el mismo lugar
    if($(".heroe").hasClass("cofre")){
        finpartida();
    } else {
        // Vuelvo a dejar tirar dados
        $("#tirarDado").click(tiraDado);
    }
}
function finpartida(){
    alert("Héroe, has llegado al cofre en "+numeroTiradas+" tiradas")
}
// Cuando voy a mover, limpio el color y los listeners
function limpiaCeldas(){
    $(".posible").each(function(){
        //Quito el listener
        $(this).off("click");
        //Quito la clase
        $(this).removeClass("posible");
    })
    let direcciones = ["norte","sur","este","oeste"];
    for(const direccion of direcciones){
        if($("."+direccion).length){
            $("."+direccion).removeClass(direccion);    
        }        
    }
    // Al quitar la clase heroe se pinta de verde
    $(".heroe").removeClass("heroe");
}