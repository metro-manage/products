export default ( page, ...params )=>{

    const main = document.getElementById( 'main' )
    main.innerHTML = ''
    main.append( page( ...params ) )
 
}   