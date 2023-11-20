import routes from "../src/routes.js"

export default ()=>{
    
    const ElementComponent = createHTML(`
        <main id="main">
            <div class="container-loader">
                <span class="loader"></span>
            </div>
        </main>
    `)

    setTimeout(routes)

    return ElementComponent
    
}