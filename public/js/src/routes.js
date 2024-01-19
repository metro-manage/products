
import inicio from "../pages/inicio.js" 
import productoId from "../pages/productoId.js";

export default ()=>{
    const Route = new Hash()
    
    Route.param('/', inicio)
    Route.param('/producto/:id', ( params )=> productoId( params )) 

    const main  = ele.create('<main class="main" id="main"></main>')
    main.append( Route.dispatch() )

    addEventListener('hashchange', ()=> {
        main.innerHTML = ''
        main.append( Route.dispatch() )
    }) 

    return main
    
} 