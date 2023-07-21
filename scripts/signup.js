window.addEventListener('load', function () {
    /* ---------------------- obtenemos variables globales ---------------------- */

    const form = document.querySelector( 'form' )
    const name = document.querySelector( '#inputNombre' );
    const lastName = document.querySelector( '#inputApellido' );
    const email = document.querySelector( '#inputEmail' );
    const password = document.querySelector( '#inputPassword' );
    const repeatPassword = document.querySelector( '#inputPasswordRepetida' );
    const mensaje = document.querySelector( ".mensaje" )

    const url = 'https://todo-api.ctd.academy/v1'

    /* -------------------------------------------------------------------------- */
    /*            FUNCIÓN 1: Escuchamos el submit y preparamos el envío           */
    /* -------------------------------------------------------------------------- */
    
    form.addEventListener('submit', function (event) {
    
        event.preventDefault();

        const data = {
            firstName: validarSoloTexto( name.value ),
            lastName: validarSoloTexto( lastName.value ),
            email: validarEmail( email.value ),
            password: compararContrasenias( password.value, repeatPassword.value )
        }

        const settings = {
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify( data )

        }
        realizarRegister( settings );

    } );

    /* -------------------------------------------------------------------------- */
    /*                    FUNCIÓN 2: Realizar el signup [POST]                    */
    /* -------------------------------------------------------------------------- */
    function realizarRegister(settings) {
        
        fetch( `${url}/users`, settings )
        .then( res => {
            if ( !res.ok ) {
                console.log( "Error en la promesa" )
            }
            return res.json()
        })
        .then( data => {
            console.log( data )
            mensaje.innerText = "Datos incorrectos"
            mensaje.classList.add( 'mensaje-error' )

            if ( data.jwt ) {
                // localStorage.setItem( 'jwt', JSON.stringify( data.jwt ) )
                form.reset();
                mensaje.classList.remove( 'mensaje-error' )
                mensaje.classList.add( 'mensaje-successful' )
                mensaje.innerText = "Cuenta creada con éxitos";
                setTimeout(() => {
                    location.replace( './index.html' )
                }, 1000);
            }
            
        })
        .catch( error => {
            alert( error )
        })

    };

});