import routesPublic from "./routesPublic.js";

import inicio from "../pages/inicio.js" 
import productoId from "../pages/productoId.js";

export default ()=>{
    const Route = new Hash()

    Route.param('/', ()=> routesPublic( inicio ))
    Route.param('/producto/:id', (params)=> routesPublic( productoId, params )) 
    
    Route.dispatch()
} 