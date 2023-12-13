export default (data)=>{

    const api = (uri = '') => ss('api').get() + uri

    const ElementComponent = createHTML(`
        <div class="div_coYHY1d">
            <div class="div_hs8YwzJ"></div>
            <div class="div_NlJ0D2C"> 
                <div class="div_21EH6K7" >
                    
                    <div class="div_Ale0G7A icon-svg">
                        <div class="div_686E97q">
                            <img src="${ api(`/storage/productos/${ data.img }`) }">
                        </div>
                        <div class="div_R77tzMq">
                            <p>${ data.description }</p>
                            <div class="div_7sK416Q">
                                <p>EAN : ${ data.ean }</p>
                                <p>HU : ${ data.sap }</p>
                            </div>
                        </div>
                    </div>

                </div>
                <div class="div_cyKZQ"><img src=""></div>
            </div>
        </div>
    `)

    const query = new findElement(ElementComponent)

    const constainerElementBarcode = query.get('.div_cyKZQ')

    query.get('.div_hs8YwzJ').addEventListener('click', ()=> ElementComponent.remove())

    JsBarcode(constainerElementBarcode.querySelector('img'), data.ean, {
        format: "CODE128",
        width: 2,
        height: 100,
    });

 
    addRemoveEventListener(window, 'hashchange', ()=> {
        ElementComponent.remove()
    })

    return ElementComponent
}