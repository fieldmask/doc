
export const setBaseUrl = () => {
    let base = document.createElement('base')
    base.href = location.origin + (location.origin.includes('github.io') ? '/doc/' : '')
    document.head.appendChild(base)
}

