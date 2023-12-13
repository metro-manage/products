import style from "../setting/style.js"

export default ()=>{
    const ElementComponent = createHTML(`
        <header class="header_2Nj88 icon-svg">
            <div class="div_i55ej">
                <label class="label_s5nPu">
                    <input type="checkbox" ${ localStorage.getItem('theme') == 'dark' ? 'checked' : ''}>
                    <span></span>
                </label>
            </div>
        </header>
    `) 


    const inputCheckbox = ElementComponent.querySelector('.label_s5nPu input')

    inputCheckbox.addEventListener('change', ()=> {
        const theme = localStorage.getItem('theme') == 'light' ? 'dark' : 'light'
        localStorage.setItem('theme', theme)
        style()
    })

    return ElementComponent
}