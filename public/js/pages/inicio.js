
export default ()=>{
    const api =(uri = '')=> window.dataApp.api + uri
    const paramQueries = (query = {}) => Object.keys(query).map(key => `${ key }=${ query[key] }`).join('&') 

    const Icon = window.dataApp.icon
    const user = window.dataApp.user

    const ElementComponent = ele.create(`
        <div class="div_f0Au33C scroll-y">
            <div class="div_gZrdl0h">             
                <div class="div_1fG5J8C">
                    <h4>Categoria</h4>
                    <div id="elementCategoria" class="div_RS2MULC  scroll-x" data-id=""> 
                        <button class="button_4M64DUo pointer focus" data-id="">TODOS</button>
                        <div id="elementCategoriaData" class="div_RS2MULC"></div>
                    </div>
                </div>
                <div class="div_1fG5J8C">
                    <h4>Marca</h4>
                    <div id="elementMarca" class="div_RS2MULC  scroll-x" data-id=""> 
                        <button class="button_4M64DUo pointer focus" data-id="">TODOS</button>
                        <div id="elementMarcaData" class="div_RS2MULC"></div>
                    </div>
                </div>
                <div id="elementProducto" class="div_1fG5J8C">
                    <h4>Productos</h4>
                    <div id="elementProductoLoad" class="element-loader" style="--color:var(--color-letter); padding:50px"></div>
                    <div id="elementProductoNull" class="div_CgtrSP7">
                        ${ Icon.get('icon-light box-empty') }
                        <h3>Lista vacia</h3>
                    </div>
                    <div id="elementProductoData" class="div_H46a676"></div>
                </div>
            </div>
        </div>
    `)

    const { elementCategoria, elementMarca, elementCategoriaData, elementMarcaData, elementProducto, elementProductoLoad, elementProductoNull, elementProductoData } = ele.object( ElementComponent.querySelectorAll('[id]'), 'id', true )
          
    const observer = new eleObserver()

    elementCategoria.addEventListener('click', e => {
        const button = e.target.closest('button')

        if( button ) {
            elementCategoria.querySelectorAll('button.focus').forEach(element => element.classList.remove('focus'));
            button.classList.add('focus')
            button.scrollIntoView({ block: "center", inline: "center" })

            elementCategoria.setAttribute('data-id', button.getAttribute('data-id'))
            
            dataRenderElementProducto(0)
            dataLoadElementProducto()
        }
    })

    elementMarca.addEventListener('click', e => {
        const button = e.target.closest('button')

        if( button ) {
            elementMarca.querySelectorAll('button.focus').forEach(element => element.classList.remove('focus'));
            button.classList.add('focus')
            button.scrollIntoView({ block: "center", inline: "center" })

            elementMarca.setAttribute('data-id', button.getAttribute('data-id'))

            dataRenderElementProducto(0)
            dataLoadElementProducto()
        }
    })
    
    const dataRenderElementCategoria =( Data = [] )=>{

        elementCategoriaData.innerHTML = Data === 0 ? '<div class="element-loader" style="--color:var(--color-letter); --pixel:20px;"></div>' 
                                        : Array.isArray(Data) ? Data.map( data => `<button class="button_4M64DUo pointer text-ellipsis" data-id="${ data.id }">${ data.name }</button>`).join('') : '' 
       
    }

    const dataLoadElementCategoria  =()=>{
        const queries = {
            query_limit : 'all',
        }
    
        fetch(api(`/api/categoria?${ paramQueries( queries ) }`))
            .then( res => res.json() )
            .then( dataRenderElementCategoria )
    }

    const dataRenderElementMarca =( Data = [] )=>{

        elementMarcaData.innerHTML = Data === 0 ? '<div class="element-loader" style="--color:var(--color-letter); --pixel:20px;"></div>' 
                                        : Array.isArray(Data) ? Data.map( data => `<button class="button_4M64DUo pointer text-ellipsis" data-id="${ data.id }">${ data.name }</button>`).join('') : '' 
    }

    const dataLoadElementMarca  =()=>{
        const queries = {
            query_limit : 'all',
        }
    
        fetch(api(`/api/marca?${ paramQueries( queries ) }`))
            .then( res => res.json() )
            .then( dataRenderElementMarca )
    }

    const dataRenderElementProductoData =(Data = [], clear = false)=>{

        if( !Data.length ) return
        if( clear ) elementProductoData.innerHTML = ''

        elementProductoData.insertAdjacentHTML('beforeend', Data.map(data => {
            return `
                <a href="#/producto/${ data.id }" class="a_LQ37e49 pointer">
                    <img src="${ data.img ? api(`/storage/productos/${ data.img }`) : '' }">
                    <p style="font-size:13px">${ data.description }</p>
                </a>
            `
        }).join(''))

        const children = Array.from(elementProductoData.children).slice(-1)[0]

        if( children ) {
            observer.set( children, e => {
                if( e.isIntersecting ) {
                    observer.remove( children )
                    const queries = {
                        query : 3,
                        query_limit : `${ elementProductoData.children.length }, 50`,
                        id_categoria : elementCategoria.getAttribute('data-id'),
                        id_marca : elementMarca.getAttribute('data-id'),
                    }
                
                    fetch(api(`/api/producto?${ paramQueries( queries ) }`))
                        .then( res => res.json() )
                        .then( dataRenderElementProductoData )
                }
            })
        }

        return elementProductoData
    }

    const dataRenderElementProducto =( Data = [] )=>{
        elementProducto.innerHTML = '<h4>Productos</h4>'
        elementProducto.append(
            Data === 0 ? elementProductoLoad : '',
            Array.isArray(Data) && !Data.length ? elementProductoNull : '',
            Array.isArray(Data) && Data.length  ? dataRenderElementProductoData( Data, true ) : ''
        )
        
    }

    const dataLoadElementProducto  =()=>{

        const queries = {
            query : 1,
            query_limit : 50,
            id_categoria : elementCategoria.getAttribute('data-id'),
            id_marca : elementMarca.getAttribute('data-id'),
            status : 1
        }
    
        fetch(api(`/api/producto?${ paramQueries( queries ) }`))
            .then( res => res.json() )
            .then( dataRenderElementProducto )

    }

    dataRenderElementCategoria(0)
    dataRenderElementMarca(0)
    dataRenderElementProducto(0)

    dataLoadElementCategoria()
    dataLoadElementMarca()
    dataLoadElementProducto()

    return ElementComponent
}