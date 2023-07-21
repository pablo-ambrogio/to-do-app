window.addEventListener('load', function () {
    /* ---------------------- obtenemos variables globales ---------------------- */

    const emaill = document.querySelector( '#inputEmail' );
    const pass = document.querySelector( '#inputPassword' );
    const form = document.querySelector( 'form' );
    const url = 'https://todo-api.ctd.academy/v1'
    const mensaje = document.querySelector( '.mensaje' )

    /* -------------------------------------------------------------------------- */
    /*            FUNCIÓN 1: Escuchamos el submit y preparamos el envío           */
    /* -------------------------------------------------------------------------- */
    form.addEventListener('submit', function (event) {
    
        event.preventDefault();

        const payload = {
            email: validarEmail(emaill.value),
            password: pass.value
        }

        const settings = {
            method: 'POST',
            body : JSON.stringify( payload ),
            headers: {
                "Content-Type": "application/json"
            }
        }
        realizarLogin( settings );
        // form.reset();
    });

    /* -------------------------------------------------------------------------- */
    /*                     FUNCIÓN 2: Realizar el login [POST]                    */
    /* -------------------------------------------------------------------------- */
    function realizarLogin(settings) {
    
        fetch( `${url}/users/login`, settings )
        .then( res => {
            if ( !res.ok ) {
                console.log( 'Error en la promesa' );
                console.log( res );
            }
            return res.json();
        })
        .then( data => {
            
            if ( !data.jwt ) {
                mensaje.innerText = "Datos incorrectos";
                emaill.classList.add( 'error' );
                pass.classList.add( 'error' );
                return;
            } 
            localStorage.setItem( 'jwt', JSON.stringify( data.jwt ) );
            location.replace( './mis-tareas.html' );
            console.log( 'Exitos' );
            
        })
        .catch( error => {
            console.log( 'Error' );
            console.log( error );
        } )
        
    };

});