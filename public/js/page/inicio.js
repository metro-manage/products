export default ()=>{

    const api = (uri = '') => ss('api').get() + uri 
    const Icon = new iconSVG()

    const ElementComponent = createHTML(`
        <div class="div_3e74G17 scroll-y">
            <div class="div_hoql5qe icon-svg"></div>
        </div>
    `)

    const query = new findElement(ElementComponent)

    const containerItemLoad = query.get('.div_04bAm9R')
    const containerItemData = query.get('.div_hoql5qe')
    
    const dataRender =(Data = [])=>{
        const fragment = document.createDocumentFragment()

        Data.forEach(data => {
            const element = createHTML(`
                <a href="#/producto/${ data.id }" class="a_xqTcWPJ pointer">
                    <span>${ data.name }</span>
                    ${ Icon.get('fi fi-rr-angle-small-right') }
                </a>
            `)

            fragment.append(element)
        })

        //containerItemLoad.remove()
        containerItemData.innerHTML = ''
        containerItemData.append(fragment)
        ElementComponent.append(containerItemData)
    }

    const dataLoad =()=>{
        datapi.get(api('/api/categoria'))
            .then(dataRender)
    }

    dataLoad()
    return ElementComponent
}