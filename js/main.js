// --- MODAL CARRITO ---
function renderizarCarrito() {
    const carritoContenido = document.getElementById('carritoContenido');
    carritoContenido.innerHTML = '';
    if (miCarrito.length === 0) {
        carritoContenido.innerHTML = '<p>El carrito está vacío.</p>';
        return;
    }
    // Agrupar productos por código y contar cantidad
    const resumen = {};
    miCarrito.forEach(prod => {
        if (!resumen[prod.codigo]) {
            resumen[prod.codigo] = { ...prod, cantidad: 1 };
        } else {
            resumen[prod.codigo].cantidad++;
        }
    });
    carritoContenido.innerHTML = '<ul style="list-style:none; padding:0;">' +
        Object.values(resumen).map(item => `
            <li style="margin-bottom:15px; border-bottom:1px solid #eee; padding-bottom:10px;">
                <span style="font-size:2rem;">${item.imagen}</span> <b>${item.nombre}</b><br>
                <span>Cantidad: ${item.cantidad}</span> <br>
                <span>Importe: $${item.importe * item.cantidad}</span><br>
                <button class="sumar" data-codigo="${item.codigo}">+</button>
                <button class="restar" data-codigo="${item.codigo}">-</button>
                <button class="eliminar" data-codigo="${item.codigo}">Quitar</button>
            </li>
        `).join('') + '</ul>';
    // Eventos sumar/restar/eliminar
    carritoContenido.querySelectorAll('.sumar').forEach(btn => {
        btn.onclick = function() {
            let prod = productos.find(p => p.codigo === btn.dataset.codigo);
            miCarrito.push(prod);
            contadorCarrito.textContent = contarProductosDelCarrito();
            renderizarCarrito();
        };
    });
    carritoContenido.querySelectorAll('.restar').forEach(btn => {
        btn.onclick = function() {
            let idx = miCarrito.findIndex(p => p.codigo === btn.dataset.codigo);
            if (idx !== -1) miCarrito.splice(idx, 1);
            contadorCarrito.textContent = contarProductosDelCarrito();
            renderizarCarrito();
        };
    });
    carritoContenido.querySelectorAll('.eliminar').forEach(btn => {
        btn.onclick = function() {
            miCarrito = miCarrito.filter(p => p.codigo !== btn.dataset.codigo);
            contadorCarrito.textContent = contarProductosDelCarrito();
            renderizarCarrito();
        };
    });
}

// Mostrar/ocultar modal
window.addEventListener('DOMContentLoaded', () => {
    const btnCheckout = document.getElementById('btnCheckout');
    const modalCarrito = document.getElementById('modalCarrito');
    const btnCerrarCarrito = document.getElementById('btnCerrarCarrito');
    if (btnCheckout) {
        btnCheckout.style.cursor = 'pointer';
        btnCheckout.addEventListener('click', function() {
            modalCarrito.style.display = 'flex';
            renderizarCarrito();
        });
    }
    if (btnCerrarCarrito) {
        btnCerrarCarrito.addEventListener('click', function() {
            modalCarrito.style.display = 'none';
        });
    }
});
let miCarrito = [];
let productos = [];
const btnCarrito = document.querySelector('div.logo-carrito');
const contadorCarrito = document.querySelector('span#spanContadorCarrito');
const inputBuscar = document.querySelector('input#inputBuscar');
const divContenedor = document.querySelector('div.container');
const URL = 'http://localhost:3000/prendasdevestir';

function contarProductosDelCarrito() {
    return miCarrito.length
}

function agregarClickEnBotones() {
    const botonesAgregar = document.querySelectorAll('button.button.button-outline')

    if (botonesAgregar.length > 0) {
        botonesAgregar.forEach((boton)=> {
            boton.addEventListener('click', ()=> {
                let productoSeleccionado = productos.find((producto)=> producto.codigo === boton.id)
                miCarrito.push(productoSeleccionado)
                contadorCarrito.textContent = contarProductosDelCarrito()
            })
        })
    }
}

function filtrarProductos() {
    let nombreAbuscar = inputBuscar.value.trim().toLowerCase()

    let productosEncontrados = productos.filter((producto)=> producto.nombre.toLowerCase().includes(nombreAbuscar))

    divContenedor.innerHTML = '';
    if (productosEncontrados.length > 0) {
        productosEncontrados.forEach((producto) => {
            divContenedor.innerHTML += retornarCardHTML(producto);
        });
        agregarClickEnBotones();
    } else {
        divContenedor.innerHTML = retornarCardError();
        const btnReintentar = document.getElementById('btnReintentar');
        if (btnReintentar) {
            btnReintentar.addEventListener('click', () => {
                divContenedor.innerHTML = '';
                mostrarProductos();
            });
        }
    }
}

function retornarCardHTML(producto) { // ES6 ` = backtick > ALT + 96
    return `<div class="div-card">
                <div class="imagen">
                    <h1>${producto.imagen}</h1>
                </div>
                <div class="prenda">
                    <p>${producto.nombre}</p>
                </div>
                <div class="importe">
                    <p>$ ${producto.importe}</p>
                </div>
                <div class="comprar"><button id="${producto.codigo}" class="button button-outline">AGREGAR</button></div>
            </div>`
}

function retornarCardError() {
    return `<div class="card-error">
               <h2 id="errorTitle">Se ha producido un error</h2>
               <h3 id="errorDescription">Intenta nuevamente en unos instantes...</h3>
               <p id="errorIcon">🔌</p>
               <button id="btnReintentar" class="button">Reintentar</button>
           </div>`
}

function mostrarProductos() {
    if (productos.length > 0) {
        productos.forEach((producto)=> {
            divContenedor.innerHTML += retornarCardHTML(producto)
        })
        agregarClickEnBotones()
    } else {
        divContenedor.innerHTML = retornarCardError()
        const btnReintentar = document.getElementById('btnReintentar')
        if (btnReintentar) {
            btnReintentar.addEventListener('click', () => {
                divContenedor.innerHTML = ''
                obtenerPrendas()
            })
        }
    }
}

function obtenerPrendas() {
    fetch(URL)
    .then((response)=> {
        if (response.status === 200) {
            return response.json()
        } else {
            throw new Error('Error al obtener productos.')
        }
    })
    .then((data)=> productos.push(...data) )
    .then(()=> mostrarProductos() )
    .catch((error)=> divContenedor.innerHTML = retornarCardError() )
}


function crearProducto() {
    const nuevoProducto = {
        imagen: '😀',
        nombre: 'Producto de prueba',
        importe: 1234,
        categoria: 'Prueba'
    }

    const opciones = {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(nuevoProducto)
    }

    fetch(URL, opciones)
    .then((response)=> {
        if (response.status === 201) {
            return response.json()
        } else {
            // controlamos el error
        }
    })
    .then((data)=> console.log(data))

}

// FUNCION PRINCIPAL JS
obtenerPrendas()


// EVENTOS
inputBuscar.addEventListener('search', filtrarProductos)