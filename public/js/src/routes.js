import inicio from "../page/inicio.js";
import productoIdCategoria from "../page/productoIdCategoria.js";

export default ()=>{

    const main =  document.getElementById('main')

    const Route = new Hash()

    Route.param('/', inicio)
    Route.param('/producto', inicio)
    Route.param('/producto/:id_categoria', productoIdCategoria)

    Route.dispatch((page)=> {
        main.innerHTML = ''
        main.append( page ) 
    })
}