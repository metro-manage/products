import modalProducto from "../components/modalProducto.js"

export default ()=>{

    const api = (uri = '') => sessionStorage.getItem('api') + uri 
    const paramQueries = (query = {}) => Object.keys(query).map(key => `${ key }=${ query[key] }`).join('&')

    const params    = JSON.parse( sessionStorage.getItem('params') )
    const Icon = new iconSVG()
    //<div class="div_04bAm9R"><span class="loader"></span></div>
    const ElementComponent = createHTML(`
        <div class="div_69J38wz scroll-y">
            <header class="header_bqsScS3 icon-svg">
                <a href="#/" class="pointer">${ Icon.get('fi fi-rr-arrow-small-left') }</a>   
            </header>
            <div class="div_hLNFr4G scroll-y">
                <div class="container-loader"><span class="loader"></span></div>
                <div class="div_36Bj2x6"></div>  
            </div>
        </div>
    `)

    const query = new findElement(ElementComponent)
    const root  = document.getElementById('root')

    //document.getElementById('root').append(modalProducto({}))

    const elementItem   = query.get('.div_hLNFr4G')
    const elementItemData = query.get('.div_36Bj2x6')
    elementItemData.remove()

    elementItemData.addEventListener('click', e => {
        const item = e.target.closest('.div_Ale0G7A')
        if(item){
            const data = JSON.parse(item.dataset.data)
            root.append(modalProducto(data))
        }
    })
   
    const dataRender =(Data = [])=>{
        const fragment = document.createDocumentFragment()

        Data.forEach(data => {
            console.log(data);

            const img = data.img != '' ? api(`/storage/productos/${ data.img }`) : './public/img/icons/gallery.png'

            const element = createHTML(`
                <div class="div_Ale0G7A icon-svg pointer" id="a-${ data.id }">
                    <div class="div_686E97q" style="display:flex">
                        <img src="${ img }" ${ data.img == '' ? `style="width:40px;height:40px;margin:auto"` :'' }>
                    </div>
                    <div class="div_R77tzMq">
                        <p>${ data.description }</p>
                        <div class="div_7sK416Q">
                            <p>EAN : ${ data.ean }</p>
                            <p>HU : ${ data.sap }</p>
                        </div>
                    </div>
                    ${ Icon.get('fi fi-rr-angle-small-right') }
                </div>
            `)

            element.setAttribute('data-data', JSON.stringify(data))
            fragment.append(element) 
        })

        
        elementItemData.append(fragment)
        elementItem.innerHTML = ''
        elementItem.append(elementItemData)
    }

    const dataLoad =()=>{

        const queries = {
            query : true,
            id_categoria : params.id_categoria
        }   

        datapi.get(api(`/api/producto?${ paramQueries( queries) }`))
            .then(dataRender)
    }

    dataLoad()

    

    return ElementComponent
}
 