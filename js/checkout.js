 function retornarFilaItem(item) {
     return `<tr>
                 <td>${item.imagen}</td>
                 <td>${item.nombre}</td>
                 <td>$ ${item.importe}</td>
                 <td id="${item.codigo}" class="btn-eliminar" title="Quitar este producto">⛔️</td>
             </tr>`
 }
