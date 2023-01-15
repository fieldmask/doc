const section     = document.getElementById('demo');

const prefix     = document.getElementById('prefix');
const mask       = document.getElementById('mask');
const suffix     = document.getElementById('suffix');
const reverse    = document.getElementById('reverse');
const maskformat = document.getElementById('maskformat');
const result     = document.getElementById('result');

const predefinedcheckbox     = document.getElementById('predefinedcheckbox');
const predefinedselect       = document.getElementById('predefinedselect');

let resultFormat = ({prefix, mask, suffix, reverse}) => {
    let resultMaskFormat = ''
    if(mask.value && (prefix.value || suffix.value || reverse.checked)) {

        let objreverse = reverse.checked ? {reverse: reverse.checked} : {}
        let objprefix = prefix.value ? {prefix: prefix.value} : {}
        let objsuffix = suffix.value ? {suffix: suffix.value} : {}

        resultMaskFormat = [`${mask.value}`, {...objreverse, ...objprefix, ...objsuffix}]

    } else {
        resultMaskFormat = mask.value ?? ''
    }
 

    if(resultMaskFormat.length) {
        result.setAttribute('fieldmask', 'demo')
        fieldmask({
            'demo': resultMaskFormat,
        })
    } else {
        result.removeAttribute('fieldmask')
    }

    return JSON.stringify(resultMaskFormat).replace(',{', ', { ').replace('}]', ' }]').replace(',"', ', "')
}

mask.oninput = function () {
    mask.value =  mask.value.replace(/[A-Za-z1-9]*$/g, "");
    maskformat.value = resultFormat({prefix, mask, suffix, reverse})
}
prefix.oninput = function () {
    maskformat.value = resultFormat({prefix, mask, suffix, reverse})
}
suffix.oninput = function () {
    maskformat.value = resultFormat({prefix, mask, suffix, reverse})
}
reverse.onchange = function () {
    maskformat.value = resultFormat({prefix, mask, suffix, reverse})
}

predefinedcheckbox.onchange = function (e) {
    if(e.target.checked) {
        section.setAttribute('data-predefined', e.target.checked)
        if(predefinedselect.value) {
            setMask(predefinedselect.value)
        } 

    } else {
        section.removeAttribute('data-predefined')
        result.setAttribute('fieldmask', 'demo')
        maskformat.value = ''
    }
    localStorage.setItem('predefined', e.target.checked)
}

predefinedselect.onchange = function (e) {
    if(e.target.value) {
        setMask(e.target.value)
    } 
}

const setMask = (value) => {
    result.setAttribute('fieldmask', value)
    fieldmask()
    console.log(value)
    if($formatMask && value) {
        maskformat.value = JSON.stringify($formatMask[value]).replace(',{', ', { ').replace('}]', ' }]').replace(',"', ', "')
    }
}

//init

if(localStorage.getItem('predefined')) {
    let predefined = JSON.parse(localStorage.getItem('predefined'))
    predefinedcheckbox.checked = predefined
    section.setAttribute('data-predefined', predefined)
}