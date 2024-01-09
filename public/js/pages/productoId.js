export default ( params )=>{

    const api =(uri = '')=> window.dataApp.api + uri
    const paramQueries = (query = {}) => Object.keys(query).map(key => `${ key }=${ query[key] }`).join('&')

    const Icon = window.dataApp.icon

    const Title = [
        { key : 'img', title : null },
        { key : 'ean', title : 'EAN' },
        { key : 'sap', title : 'SAP' },
        { key : 'description', title : 'Descripcion' },
        { key : 'data_categoria', title : null },
        { key : 'data_marca', title : null },
        { key : 'codigo_barras', title : null },
    ]
  
    const ElementComponent = ele.create(`
        <div class="div_FJZ0jdm">

            <header class="header_N8p7RP6">
                    
                <div class="div_349Zfgp scroll-h">
                    <a href="#/" class="button_0530xdO pointer">${ Icon.get('fi fi-rr-angle-left') }</a>
                    <h4 class="text-ellipsis">Informacion de producto</h4>
                </div>

            </header>

            <div id="elementItem" class="div_f0Au33C scroll-y" style="padding:15px">

                <div id="elementItemLoad" class="element-loader" style="--color:var(--color-letter)"></div>
                <div id="elementItemNull" class="div_CgtrSP7">
                    ${ Icon.get('icon-light box-empty') }
                    <h3>El usuario no existe</h3>
                </div>
                <div id="elementItemData" class="div_k10Bfb0"></div>

            </div>

        </div>

    `)

    const { 
        elementItem, 
        elementItemLoad, 
        elementItemNull, 
        elementItemData, 
    } = ele.object( ElementComponent.querySelectorAll('[id]'), 'id', true )

    const dataRenderElementItemData =(data = null)=>{

        elementItemData.innerHTML = Title.map( title => {

            if( title.key == 'img' ) {
                return `
                    <div class="div_juBP4RD scroll-x" style="padding:15px">
                        <div class="div_5D21Kk4">
                            <img src="${ api(`/storage/productos/${ data[ title.key  ] || 'avatar.png' }`) }">
                        </div>
                    </div>
                `
            }

            else if( title.key == 'data_categoria' ){
                const categoria = JSON.parse( data[ title.key  ] )
                return `
                    <div class="div_juBP4RD scroll-x" style="pointer-events:none">
                        <div class="div_54728o4">
                            <a href="#/categoria/${ categoria.id }" class="a_QRU7rhQ">${ categoria.name }</a>
                        </div>
                    </div>
                `
            }

            else if( title.key == 'data_marca' ){
                const marca = JSON.parse( data[ title.key  ] )
                return `
                    <div class="div_juBP4RD scroll-x" style="pointer-events:none">
                        <div class="div_54728o4">
                            <a href="#/marca/${ marca.id }" class="a_QRU7rhQ">${ marca.name }</a>
                        </div>
                    </div>
                `
            }

            else if( title.key == 'codigo_barras' ){

                const image = document.createElement('img')

                JsBarcode(image, data.ean, {
                    format: "CODE128",
                    width: 2,
                    height: 100,
                });

                return `
                    <div class="div_juBP4RD scroll-x" >
                        <div class="div_pPCNT0A"> ${ image.outerHTML } </div>
                    </div>
                `
            }

            return `
                <div class="div_juBP4RD">
                    <div class="div_20gl6i6">
                        <span>${ title.title }</span>
                        <p>${ data[ title.key  ] }</p>
                    </div>
                </div>
            `

        }).join('')

        return elementItemData
    }

    const dataRenderElementItem =(data = null)=>{

        elementItem.innerHTML = ''
        elementItem.append(
            data === 0 ? elementItemLoad : '',
            data === null ? elementItemNull : '',
            data && Object.keys(data).length ? dataRenderElementItemData(data) : ''
        )

    }

    const dataLoadElementItem =()=>{

        const queries = {
            token : localStorage.getItem( 'auth-token' ),
            query : 2,
            id    : params.id,
            query_limit : 'one',
        }

        fetch( api(`/api/producto?${ paramQueries( queries ) }`) )
            .then( res => res.json() )
            .then( dataRenderElementItem  )

    }

    dataRenderElementItem(0)
    dataLoadElementItem()


    return ElementComponent

}