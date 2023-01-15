
export const setBaseUrl = () => {
    let url = location.origin + (location.origin.includes('github.io') ? '/doc/' : '')
    let base = document.createElement('base')
    base.href = url
    document.head.appendChild(base)

    document.querySelectorAll('a[baseurl]').forEach(e => {
        e.href = url
    })
}

