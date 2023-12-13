function addRemoveEventListener (element, event, callback){
    const def_callback =()=>{
        if(typeof callback === 'function') callback()
        element.removeEventListener(event, def_callback)
    }

    element.addEventListener(event, def_callback)
}

function addRemoveEventListenerHashchange (element, type, callback){
    if(typeof callback === 'function') {
        element.addEventListener(type, callback)
        addRemoveEventListener(window, 'hashchange', ()=> element.removeEventListener(type, callback))
    }
}

function trimString(text = '', symbol = '') {
    if(symbol != ''){
        text = text.startsWith(symbol) ? text.slice(1) : text
        text = text.endsWith(symbol) ? text.slice(0, -1) : text
    }
    return text
}

function rand(min, max = false){
    
    if(!max){
        max = min
        min = 0
    }

    return Math.floor(Math.random() * ((max + 1) - min) + min)

}

function ArrayToString (array, callback){
    if(Array.isArray(array)){
        return array.map((...data) => {
            if(typeof callback === 'function') {
                const out = callback(...data)
                return ['string', 'number'].includes(typeof out) ? out : ''
            }
            return ''
        }).join('')
    }
    return '' 
}

function genereteKey (include = {}){
    const permission = {
        upper   : include.upper ?? true,
        lower   : include.lower ?? true,
        number  : include.number ?? true,
        simbol  : include.simbol ?? false,
        length  : include.length ?? 10,
    }

    const contentKey = {}
    contentKey.upper    = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    contentKey.lower    = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.toLocaleLowerCase()
    contentKey.number   = '1234567890'
    contentKey.simbol   = '[{!¿$@#=~?¡}]'

    const contentUse = []
    if(permission.upper) contentUse.push(contentKey.upper)
    if(permission.lower) contentUse.push(contentKey.lower)
    if(permission.number) contentUse.push(contentKey.number)
    if(permission.simbol) contentUse.push(contentKey.simbol)

    return ArrayToString([...Array(permission.length)], key => {
        const firstOption   = contentUse[rand(contentUse.length - 1)]
        const secondOption  = firstOption[rand(firstOption.length - 1)]
        return secondOption
    })
}

function appendElement(element, ...elements) {
    elements = elements.map(element => {
        if(typeof element == 'function') element = element()
        if (element instanceof Element) return element
        else return ''
    })

    element.append(...elements) 
}

function createHTML(html) {
    let elementHTML = document.createElement('div')
    elementHTML.innerHTML = html
    elementHTML = elementHTML.children[0]
    return elementHTML
}

function getTimeBySecond(seconds) {
    return {
        hours   : Math.floor(seconds / 3600),
        minutes : Math.floor((seconds % 3600) / 60),
        seconds : seconds % 60
    }
}

class createCSS {
    constructor (id, root = document) {
        this._id        = id
        this._root      = root
        this._rootClass = ''
        this._rootClassAdd = true

        this._class = ''
        this._elements  = ''
        this._isStyle = false

        this._styleID       = `style-${ this._id }` 
        this._styleIsDOM    = document.getElementById(this._styleID)
        this._styleElement  = this._styleIsDOM ?? document.createElement('style')
        this._styleElement.innerHTML = ''

        if(!this._styleIsDOM){
            this._styleElement.setAttribute('id', this._styleID )
            document.head.append(this._styleElement)
        }

        if(root != document) {
            const id = genereteKey({ length : 18})
            this._rootClass = this._root.tagName + '-' + id
            this._root.classList.add(this._rootClass) 
        }
        
    }

    element(element){

        const code      =  genereteKey({ length : 15}) 
        const listClassName = []

        const dataCSS = element.split(',').map(element => {
            return `[data-css = ${ element }]`
        }).join(', ')

        this._elements  = getElementAll(dataCSS, this._root)

        this._elements.forEach(element => {
            const className = element.tagName + '-' + code
            element.setAttribute('data-css',className)
            element.classList.add(className)

            if(!this._isStyle){
                if(!listClassName.includes(className)) listClassName.push(className)
            }
        })

        this._class = listClassName.map((className, index) => {
            return (index == 0 ? '' : '.') + className.trim()
        }).join(', ')

        this._rootClassAdd = false
        return this  
    }
 
    css(css){
        const one   = /&/g
        const two   = /\s+/g 
        const three = /[\;/\s]+?\;/g
        const four  = /[\;/\s]+?\}/g
        const five  = /\}/g
        const six   = /\)[/\s+]?\{/g

        css = css.replace(one   , '.' + (this._rootClassAdd ? this._rootClass : this._class))
        css = css.replace(two   , ' ') 
        css = css.replace(three , ';'); 
        css = css.replace(four  , ' }'); 
        css = css.replace(five  , '}\n')
        css = css.replace(six   , ') {\n');
        css = css.split('\n').map(css => css.trim()).join('\n')

        this._styleElement.innerHTML += css

        this._rootClassAdd = true
        const elements = [...this._elements].map(element => {

            const res = {
                element,
                className : element.dataset.css
            } 

            element.removeAttribute('data-css')

            return res

        })
        return elements.length == 1 ? elements[0] : elements
    }
}

class Hash {
    constructor(){
        this._params = []
        this._routes = []
        this._dispatch = true
    }

    param(route = '', callback = false){

        const dinamic = route.includes('/:')
        route = trimString(route, '/') 
        this._routes.push({route, callback, dinamic }) 

    }

    dispatch(callback){ 

        if( this._dispatch ) {

            this._dispatch = false
            const hashchange =()=>{
                if (typeof callback === 'function') callback( this.__change() )
                else this.__change()
            }

            hashchange()
            window.addEventListener('hashchange', hashchange)
            
        }

    }

    __change(){

        const params = {}
        this._params = trimString(location.hash.slice(1), '/')

        const findRoute = this._routes.find(route => {
            
            if(route.dinamic){

                const splitRoute = route.route.split('/')
                const splitParam = this._params.split('/')

                if(splitRoute.length == splitParam.length){
                    for (let i = 0; i < splitRoute.length; i++){
                        const textRoute = splitRoute[i].trim()
                        if(textRoute.startsWith(':')) params[ textRoute.slice(1) ] = splitParam[i]
                        else if(textRoute !== splitParam[i]) return false
                    }

                    return route
                }
 
            } else if(route.route == this._params) {
                return route
            } else if(route.route == '*'){
                return route
            }
            
            return false
        })

        if(findRoute){
            sessionStorage.setItem('params', JSON.stringify( params ))
            if (typeof findRoute.callback === 'function') return findRoute.callback( params )
            return null
        }

    }
}

class findElement {
    constructor(root = document){
        this._root          = root
        this._element       = null
        this._elementTemp   = document.createElement('div')
        
    }

    get(query, create = false){
        this._element = this._root.querySelector(query)
        if(create) return this._element ?? this._elementTemp
        return this._element
    }

    getAll(query){
        return this._root.querySelectorAll(query)
    }
}

function ls(item) {
    this._item = item
    this._data = ''

    const _this = {
        data: (data) => { 
            this._data = data 
            return _this;
        },
        put: (json = false, string = false) => { 
            const data = localStorage.getItem(this._item)

            if(data){
                this._data = data
                return json ? JSON.parse(this._data) : this._data
            }

            localStorage.setItem(this._item, string ? JSON.stringify(this._data) : this._data)
            return this._data;
        },
        set: (string = false) => { 
            localStorage.setItem(this._item, string ? JSON.stringify(this._data) : this._data)
            return this._data;
        },
        get: (json = false) => { 
            this._data  = localStorage.getItem(this._item, this._data) 
            return json ? JSON.parse(this._data) : this._data;
        },
        remove: () => { 
            localStorage.removeItem(this._item)
            return !localStorage.getItem(this._item);
        }
    }

    return _this
}

function ss(item) {
    this._item = item
    this._data = ''

    const _this = {
        data: (data) => { 
            this._data = data 
            return _this;
        },
        put: (json = false, string = false) => { 
            const data = sessionStorage.getItem(this._item)

            if(data){
                this._data = data
                return json ? JSON.parse(this._data) : this._data
            }

            sessionStorage.setItem(this._item, string ? JSON.stringify(this._data) : this._data)
            return this._data;
        },
        set: (string = false) => { 
            sessionStorage.setItem(this._item, string ? JSON.stringify(this._data) : this._data)
            return this._data;
        },
        get: (json = false) => { 
            this._data  = sessionStorage.getItem(this._item, this._data) 
            return json ? JSON.parse(this._data) : this._data;
        },
        remove: () => { 
            sessionStorage.removeItem(this._item)
            return !sessionStorage.getItem(this._item);
        }
    }

    return _this
}

const diffDateBirthday =(Date1, Date2 = Date.now())=>{

    const thisYear = new Date().getFullYear()

    const lastYear = new Date(Date1)
    lastYear.setFullYear(thisYear)
    
    const BirthdayThisYear = new Date(Date1)
    BirthdayThisYear.setFullYear(thisYear)

    if(Date2 > BirthdayThisYear.getTime()) BirthdayThisYear.setFullYear(thisYear + 1)
    else lastYear.setFullYear(thisYear - 1)

    const diffTotal         = BirthdayThisYear.getTime() - lastYear.getTime()
    const diffelapsed       = Date2 - lastYear.getTime() 
    const difdRemaining     = BirthdayThisYear.getTime() - Date2;

    const day = {
        total       : Math.floor(diffTotal / (1000 * 60 * 60 * 24)),
        elapsed     : Math.round(diffelapsed / (1000 * 60 * 60 * 24)),
        remaining   : Math.floor(difdRemaining / (1000 * 60 * 60 * 24))
    }

    const hour = {
        total       : Math.floor((diffTotal / (1000 * 60 * 60))),
        elapsed     : Math.round((diffelapsed / (1000 * 60 * 60))),
        remaining   : Math.floor((difdRemaining / (1000 * 60 * 60)) % 24)
    }

    const minute = {
        total       : Math.floor((diffTotal / 1000 / 60)),
        elapsed     : Math.round((diffelapsed / 1000 / 60) % 60),
        remaining   : Math.floor((difdRemaining / 1000 / 60) % 60)
    }

    const second = {
        total       : Math.floor((diffTotal / 1000)),
        elapsed     : Math.round((diffelapsed / 1000) % 60),
        remaining   : Math.floor((difdRemaining / 1000) % 60)
    }

    const age = (BirthdayThisYear.getFullYear() - 1) - new Date(Date1).getFullYear()

    const complete = {
        total       : 100,
        elapsed     : parseFloat(((day.elapsed / day.total) * 100).toFixed(2)),
        remaining   : parseFloat(((day.remaining / day.total) * 100).toFixed(2))
    } 

    return {
        day,
        hour,
        minute,
        second,
        age,
        complete
    }
}

const datapi = (()=> {
    const method = async (uri = '', method = 'POST', data = {}, options = {})=>{
        const option = {
            method,
        }

        if( Object.keys(data).length ){
            option.body = JSON.stringify(data)
        }

        delete options.method
        delete options.body

        const res = await fetch(uri, {...option, ...options})
        return await res.json()
    }
        
    const get = async (...params)=>{
        return await method(params[0], 'GET', {}, params[1])
    }

    const post = async (...params)=>{
        return await method(params[0], 'POST', params[1], params[2])
    }

    const put = async (...params)=>{
        return await method(params[0], 'PUT', params[1], params[2])
    }

    const _delete = async (...params)=>{
        return await method(params[0], 'DELETE', params[1], params[2])
    }

    const patch = async (...params)=>{
        return await method(params[0], 'PATCH', params[1], params[2])
    }

    return { get, post, put, patch, delete : _delete }
})()


function copyToClipboard(text = '') {
    const textarea = document.createElement('textarea')
    textarea.setAttribute('style', 'position: fixed; top: 0; transform: translateY(-100%);')
    textarea.value = text;

    document.body.append(textarea);

    textarea.select();
    textarea.setSelectionRange(0, text.length);

    document.execCommand('copy');

    textarea.remove()
}

class FileLoad {
    constructor(file = null){
        this.__file = file
        this.__progress
        this.__load
    }

    progress(callback){
        this.__progress = callback
    }

    load(callback) {
        this.__load = callback
    }

    start(){
        const reader = new FileReader()
        reader.addEventListener('progress', e => {
            if(typeof this.__progress == 'function') this.__progress(e)
        })
        reader.addEventListener('load', e => {
            if(typeof this.__load == 'function') this.__load(e)
        })
        reader.readAsDataURL(this.__file)
    }
}

class Alert {
    constructor(element) {
        this.__element = createHTML('<div class="div_1N2Xi0S4ana9y95"></div>')
        element.append(this.__element)
    }

    show(data = {}) {

        const element = createHTML(`<div class="div_3897A2mOM93uOdP">${ data.message ?? '' }</div>`)
        this.__element.prepend(element)

        if(this.__element.children.length > 3) {
            const [elementLast] =[...this.__element.children].slice(-1)
            if(elementLast) elementLast.remove()
        }

        setTimeout(()=> {
            element.remove()
        }, 1500)

    }
}


function setCookie(nombre, valor, diasParaExpirar, httpOnly = false, secure = false) {
    const fechaExpiracion = new Date();
    fechaExpiracion.setTime(fechaExpiracion.getTime() + (diasParaExpirar * 24 * 60 * 60 * 1000));
    const expira = "expires=" + fechaExpiracion.toUTCString();
    
    const httpOnlyString = httpOnly ? "; HttpOnly" : "";
    
    // Agrega "; Secure" solo si secure es verdadero
    const secureString = secure ? "; Secure" : "";
    
    document.cookie = nombre + "=" + valor + "; " + expira + "; path=/" + httpOnlyString + secureString;
}

function getCookie(nombre) {
    const nombreC = nombre + "=";
    const cookies = document.cookie.split(';');
    
    for(let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        while (cookie.charAt(0) == ' ') {
            cookie = cookie.substring(1);
        }
        if (cookie.indexOf(nombreC) == 0) {
            return cookie.substring(nombreC.length, cookie.length);
        }
    }
    
    return "";
}

function objectFormData(data = {}) {
    const formData = new FormData()

    if( typeof data == 'object' ) {
        for (const key in data) {
            formData.append(key, data[key])
        }
    }

    return formData
}
 