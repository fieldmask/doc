import { setBaseUrl } from './base.js'

import { Header } from './components/header.js'
import { Footer } from './components/footer.js'

Header();
Footer();

setBaseUrl();

if(typeof astronaut != 'undefined') astronaut.codeviewer()

document.querySelectorAll('a[hyperlink]').forEach((e) => {
    e.onclick = function () {
        astronaut.copy(e.href)
    }
})

if(typeof fieldmask != 'undefined') fieldmask({
    'real': ['00,00', {prefix: 'R$', reverse: true}],
    'date': '00-00-0000',
    'demo': '',
})