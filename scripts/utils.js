/* ---------------------------------- texto --------------------------------- */
function validarTexto( texto ) {
    const soloTexto = /^[A-Za-z0-9\s]+$/;
    const mensaje = document.querySelector( '#mensaje' )
    if ( soloTexto.test( texto.trim() ) ) {
        mensaje.classList.remove( "message-error" )
        mensaje.innerHTML = ""
        return true
    }
    else {
        mensaje.classList.add( "message-error" )
        mensaje.innerHTML = "Ingrese la tarea"
    }
}

function validarSoloTexto( texto ) {
    const soloTexto = /^[A-Za-z]+$/;
    const inputs = document.querySelectorAll( 'input' );
    let textoDevuelto = ""
    inputs.forEach( input => {
        if ( soloTexto.test( texto.trim() ) ) {
            input.classList.remove( 'error' )
            
            textoDevuelto = texto.trim()
        } else {
            input.classList.add( 'error' )
        }
    } )
    return textoDevuelto;
    
}

function normalizarTexto(texto) {
    return texto.toLowerCase()
}

/* ---------------------------------- email --------------------------------- */
function validarEmail(email) {
    const esEmail = /^(([^<>()\[\]\\.,;:\s@”]+(\.[^<>()\[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$/;

    if ( esEmail.test( email ) && esEmail != "" ) {
        return email
    } else {
        return false
    }
}

function normalizarEmail(email) {
    
}

/* -------------------------------- password -------------------------------- */
function validarContrasenia(contrasenia) {
    
}

function compararContrasenias(contrasenia_1, contrasenia_2) {
    if ( contrasenia_1 === contrasenia_2 && contrasenia_1 != "" && contrasenia_2 != "" ) {
        return contrasenia_1;
    }
}
