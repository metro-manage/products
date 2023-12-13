import style from "./setting/style.js"
import header from "./components/header.js"
import main from "./components/main.js"

const app =()=>{
    
    ss('api').data('https://api-metro.victor01sp.com').set()

    style()
    document.getElementById('root').append( header(), main() )

    addEventListener('contextmenu', e => e.preventDefault())
}

export default app