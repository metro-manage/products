import settingTheme from "../setting/theme.js"

export default ()=>{

    const api =(uri = '')=> window.dataApp.api + uri
    const paramQueries = (query = {}) => Object.keys(query).map(key => `${ key }=${ query[key] }`).join('&')

    const Icon = window.dataApp.icon

    const ElementComponent = ele.create(`
        <div class="div_qRE6Ouj">

            <div id="closeElement" class="div_EOQfId0"></div>

            <div class="div_ne1hH6r">

                <div class="div_u7bzq5P">

                    <div class="div_kCRaV9G">

                        <div id="elementUser" href="#" class="div_SHt2V05">
                            <img src="${ api(`/storage/user/avatar.png`) }">
                            <div>
                                <span class="text-ellipsis">-</span>
                                <p class="text-ellipsis">publico</p>
                            </div>
                        </div>
                        <hr>

                        ${ localStorage.getItem('theme') == 'light' ?
                            `<button id="buttonTheme" class="button_0530xdO pointer" data-theme="light">${ Icon.get('fi fi-rr-moon') }</button>`
                            :
                            `<button id="buttonTheme" class="button_0530xdO pointer" data-theme="dark">${ Icon.get('fi fi-rr-sun') }</button>`
                        }

                    </div>
                    <div class="div_211TG0a scroll-y">
                    
                        <div class="div_068U4VO">
                            <a class="a_rx39DYh pointer" href="#/">
                                ${ Icon.get('fi fi-rr-house-blank') }
                                <span class="text-ellipsis">Inicio</span>
                            </a>

                            <a class="a_rx39DYh pointer" href="#/categoria" style="display:none">
                                ${ Icon.get('fi fi-rr-category') }
                                <span class="text-ellipsis">Categoria</span>
                            </a>

                            <a class="a_rx39DYh pointer" href="#/marca" style="display:none">
                                ${ Icon.get('fi fi-rr-boxes') }
                                <span class="text-ellipsis">Marca</span>
                            </a>
                        </div>
                    
                    </div>

                </div>

            </div>

        </div>
    `)

    const { closeElement, buttonTheme } = ele.object( ElementComponent.querySelectorAll('[id]'), 'id', true )

    const icon = {
        sun : Icon.get('fi fi-rr-sun'),
        moon: Icon.get('fi fi-rr-moon')
    }

    closeElement.addEventListener('click', ()=> {
        ElementComponent.remove()
    })

    buttonTheme.addEventListener('click', ()=> {
        const theme = buttonTheme.getAttribute('data-theme')
        buttonTheme.setAttribute('data-theme', theme == 'light' ? 'dark' : 'light')
        buttonTheme.innerHTML = theme == 'light' ? icon.sun : icon.moon

        localStorage.setItem('theme', theme == 'light' ? 'dark' : 'light')
        settingTheme()
    })

    addEventListener('popstate', ()=> ElementComponent.remove())

    return ElementComponent
}