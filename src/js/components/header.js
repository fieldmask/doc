
export const Header = () => {
    let header = document.createElement('div')
    header.className = 'header container'
    header.innerHTML = /*html*/`
        <a class="slogan" href="/">
            <h1 aria-label="FieldMask.js">FieldMask.js</h1>
            <span aria-label="Masking for Input">Masking for Input</span>
        </a>
    `
    document.body.querySelector('#header').appendChild(header)
}