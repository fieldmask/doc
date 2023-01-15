
export const Footer = () => {
    let header = document.createElement('div')
    header.className = 'footer container'
    header.innerHTML = /*html*/`
        <small>©fieldmask | License MIT</small>
    `
    document.body.querySelector('#footer').appendChild(header)
}