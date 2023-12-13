export default ()=>{

    ls('theme').data('light').put()
 
    const themeLight = {
        'color-background' : '#F7F7F7',
        'color-item'    : '#ffffff',
        'color-letter'  : '#1c1c1e',
        'filter-img'    : 'initial'
    }
  
    const themeDark  = {
        'color-background' : '#1c1c1e',   
        'color-item' : '#2C2C2E',   
        'color-letter' : '#F7F7F7',
        'filter-img'   :'invert(82%) sepia(99%) saturate(0%) hue-rotate(102deg) brightness(111%) contrast(100%)'
    }

    const theme = localStorage.getItem('theme') == 'light' ? themeLight : themeDark

    const style = document.getElementById('style-style')
    const metaThemeColor = document.getElementById('meta-theme-color')

    metaThemeColor.setAttribute('content', theme['color-background'])
    style.innerHTML = `:root {${ ArrayToString(Object.keys(theme), key => `--${ key } : ${ theme[key] };\n`) }}`
    
}