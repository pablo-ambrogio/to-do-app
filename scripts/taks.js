// SEGURIDAD: Si no se encuentra en localStorage info del usuario
// no lo deja acceder a la página, redirigiendo al login inmediatamente.

/* ------ comienzan las funcionalidades una vez que carga el documento ------ */
window.addEventListener('load', function () {

  /* ---------------- variables globales y llamado a funciones ---------------- */
  
  const token = JSON.parse( localStorage.jwt );

  if ( !localStorage.jwt ) {
    location.replace( './index.html' )
  }

  const btnCerrarSesion = document.querySelector('#closeApp');
  const nuevaTarea = document.querySelector('#nuevaTarea');
  const formCrearTarea = document.querySelector('.nueva-tarea');
  const urlUser = 'https://todo-api.ctd.academy/v1/users/getMe';
  const urlTasks = 'https://todo-api.ctd.academy/v1/tasks';

  obtenerNombreUsuario()
  consultarTareas();

  /* -------------------------------------------------------------------------- */
  /*                          FUNCIÓN 1 - Cerrar sesión                         */
  /* -------------------------------------------------------------------------- */

  btnCerrarSesion.addEventListener('click', function () {
    const cerrarSesion = confirm( '¿Seguro que quieres cerrar sesión?' );

    if ( cerrarSesion ) {
      localStorage.clear();
      location.replace( './index.html' );
    }

  });

  /* -------------------------------------------------------------------------- */
  /*                 FUNCIÓN 2 - Obtener nombre de usuario [GET]                */
  /* -------------------------------------------------------------------------- */

  function obtenerNombreUsuario() {

    const userName = document.querySelector( '.user-info p' );
    
    const settings = {
      method : 'GET',
      headers : {
        authorization : token
      }
    }

    fetch( urlUser, settings )
    .then( res => {
      if ( !res.ok ) {
        alert( 'Error en la promesa' )
      }
      return res.json()
    } )
    .then( data => {
      userName.innerText = data.firstName;
    })
    .catch( error => {
      console.log( error )
    } )


  };

  /* -------------------------------------------------------------------------- */
  /*                 FUNCIÓN 3 - Obtener listado de tareas [GET]                */
  /* -------------------------------------------------------------------------- */

  function consultarTareas() {

    const settings = {
      method: 'GET',
      headers: {
        'authorization' : token
      }
    }

    fetch( urlTasks, settings )
    .then( res => {
      return res.json()
    })
    .then( data => {
      renderizarTareas( data )
      botonBorrarTarea()
      botonesCambioEstado()
    })
    .catch( error => {
      console.log( error );
    })

  };
  /* -------------------------------------------------------------------------- */
  /*                    FUNCIÓN 4 - Crear nueva tarea [POST]                    */
  /* -------------------------------------------------------------------------- */

  formCrearTarea.addEventListener( 'submit', function (event) {
    
    event.preventDefault();
    
    const data = {
      description: nuevaTarea.value,
      completed: false
    }

    const settings = {
      method : 'POST',
      headers : {
        'authorization' : token,
        'Content-Type' : 'application/json'
      },
      body : JSON.stringify( data )

    }
    if ( validarTexto( data.description ) ) {

      fetch( urlTasks, settings )
      .then( res => {
        return res.json()
      })
      .then( data => {
        consultarTareas();
      })
      .catch( error => {
        console.log( error );
      })
      
    }

    formCrearTarea.reset();
    
  });

  /* -------------------------------------------------------------------------- */
  /*                  FUNCIÓN 5 - Renderizar tareas en pantalla                 */
  /* -------------------------------------------------------------------------- */
  function renderizarTareas(listado) {

    const ulTarea = document.querySelector( ".tareas-pendientes" )
    const ulTareasFinalizadas = document.querySelector( ".tareas-terminadas" )
    const cantTareasFinalizas = document.querySelector( "#cantidad-finalizadas" )
    ulTarea.innerHTML = "";
    ulTareasFinalizadas.innerHTML = "";
    let tareasFinalizadas = 0;

    listado.forEach( list => {
      let textoNormalizado = normalizarTexto( list.description )
      if ( !list.completed ) {
        ulTarea.innerHTML += `
      <li class="tarea">
        <div class="hecha" id="${list.id}">
          <i class="fa-regular fa-circle-check"></i>
        </div>
        <div class="descripcion">
          <p class="nombre">${textoNormalizado}</p>
          <div class="cambios-estados">
            <button class="change incompleta" id="${list.id}" ><i class="fa-solid fa-rotate-left"></i></button>
            <button class="borrar" id="${list.id}"><i class="fa-regular fa-trash-can"></i></button>
          </div>
        </div>
      </li>
      `
      }
      else {
        tareasFinalizadas++;
        ulTareasFinalizadas.innerHTML += `
      <li class="tarea">
        <div class="hecha" id="${list.id}">
          <i class="fa-regular fa-circle-check"></i>
        </div>
        <div class="descripcion">
          <p class="nombre">${textoNormalizado}</p>
          <div class="cambios-estados">
            <button class="change incompleta" id="${list.id}" ><i class="fa-solid fa-rotate-left"></i></button>
            <button class="borrar" id="${list.id}"><i class="fa-regular fa-trash-can"></i></button>
          </div>
        </div>
      </li>
      `
      }

    } )

    cantTareasFinalizas.innerText = tareasFinalizadas;

  };

  /* -------------------------------------------------------------------------- */
  /*                  FUNCIÓN 6 - Cambiar estado de tarea [PUT]                 */
  /* -------------------------------------------------------------------------- */
  function botonesCambioEstado() {

    const realizadas = document.querySelectorAll( ".hecha" );
    const flechaRegreso = document.querySelectorAll( ".change" );
    
    function estadoDeTarea( id, completed ) {
      const data = {
        completed : completed
      }

      const settings = {
        method : 'PUT',
        headers : {
          'authorization' : token,
          'Content-Type' : 'application/json'
        },
        body : JSON.stringify( data )
      }
      fetch( `${urlTasks}/${id}`, settings )
      .then( res => res.json() )
      .then( data => {
        consultarTareas()
      })
      .catch( error => console.log( error ) )

    }

    realizadas.forEach( ok => {

      ok.addEventListener( 'click', () => {

        estadoDeTarea( ok.id, true )

      } )

    } )

    flechaRegreso.forEach( flecha => {
      flecha.addEventListener( 'click', () => {
        estadoDeTarea( flecha.id, false )
      } )
    } )

  }

  /* -------------------------------------------------------------------------- */
  /*                     FUNCIÓN 7 - Eliminar tarea [DELETE]                    */
  /* -------------------------------------------------------------------------- */
  function botonBorrarTarea() {

    const btnBorrar = document.querySelectorAll( ".borrar" )

    btnBorrar.forEach( btn => {

      btn.addEventListener( 'click', () => {
        const idBtn = btn.getAttribute( 'id' )
    
        const settings = {
          method : 'DELETE',
          headers : {
            authorization : token
          }
        }

        fetch( `${urlTasks}/${idBtn}`, settings )
        .then( res => res.json() )
        .then( data => {
          consultarTareas();
        })
        .catch( error => console.log( error ) )

      } )

    })

  };

});