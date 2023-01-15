//-----------------------------------------------------------------------//
//                  Astronaut Library.js - Complete                      //
//     Version: 1.0                                                      //
//     Author:  André Malveira.                                          //
//     Github:  https://github.com/andremalveira                         //
//     Repo:    https://github.com/andremalveira/Astronaut.Library.js    //
//     Site:    https://astlibjs.ga/                                     //
//-----------------------------------------------------------------------//

const $astronautType = 'Full Version';
const astronaut = {
  $library:$astronautType,
  $version: '1.0',
  $webSite: 'https://astlibjs.ga',
  $shortName: 'astlibjs',
  create: {
    id() {return (Date.now().toString(36) + Math.random().toString(36).substr(2, 5))},
  },
  check: {isImg(url) {return(url.match(/\.(jpeg|jpg|gif|png|svg|webp|bmp)$/) != null);}},
  insert: {
    css(css, id, currentScript) {
      if(css && id){
        var newStyle = document.createElement('style')
        id = astronaut.$shortName+'-'+id+'-css',
        newStyle.id= id 
        newStyle.textContent = css;
        if(!document.head.querySelector(`style#${id}`)){
          document.head.appendChild(newStyle) 
        } else {
          var styletag = document.head.querySelector(`style#${id}`)
          if(styletag.textContent != css){
            styletag.textContent = css
          }
        }
        if(currentScript){
          document.currentScript.remove()
        }
      } else {
        console.error(`💔 ${astronaut.$shortName}.insert.css()! Error when inserting css because you did not inform the ${((id == undefined || id == '') ? `second parameter was not defined id! Ex: ${astronaut.$shortName}.insert.css('css', 'id')` : (css == undefined || css == '') ? `the first parameter was not defined or the first parameter is empty css! Ex: ${astronaut.$shortName}.insert.css('css', 'id')` : '')}`)
      }
    },
    script(script, id){
      newDiv = document.createElement('div'), 
      newScript = document.createElement('script');
      newScript.id = id
      newDiv.id ="scripts_inserted"
      newScript.textContent = script

      if(document.querySelector('#scripts_inserted')){
        var scriptag = scripts_inserted.querySelector(`script#${id}`)
        if(!scriptag || scriptag.textContent != script){
          if(scriptag) scriptag.remove()
          scripts_inserted.appendChild(newScript)
        }
      } else {
        document.body.appendChild(newDiv)
        scripts_inserted.appendChild(newScript)
      }
    }
  },
  copy(value, selector)  {
    //var selector = (selector) ? selector : document.body

    function clipboard(textToCopy) {
      if (navigator.clipboard && window.isSecureContext) {
          // navigator clipboard api method'
          return navigator.clipboard.writeText(textToCopy);
      } else {
          // text area method
          let textArea = document.createElement("textarea");
          textArea.value = textToCopy;
          // make the textarea out of viewport
          textArea.style.position = "fixed";
          textArea.style.left = "-999999px";
          textArea.style.top = "-999999px";
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          return new Promise((res, rej) => {
              // here the magic happens
              document.execCommand('copy') ? res() : rej();
              textArea.remove();
          });
      }
    }
    clipboard(value)
    .then(() => {
      astronaut.warning({text: 'Copied!', selector})
    })
    .catch(err => {
      astronaut.warning({text: 'Error when Copying!', selector})
    })
  },
  warning(params)  {
    var text = (params.text) ? params.text : false, selector = (params.selector) ;
    this.insert.css(`
/*Astronaut Library.js - Warning*/
.ast-warning {
  position: absolute;
  padding: 0.2rem 0.8rem;
  border-radius: 0.3rem;
  background: #2d333b;
  color: #eee;
  box-shadow: 0px 0px 0px 0.03rem #00000030;
  animation: show_ast_warning 0.3s ease forwards;
  left: 50%;
  transform: translate(-50%, -50%);
  bottom: 0;
  z-index: 1;
}
.ast-warning.fixed {
    position: fixed;
}
@keyframes show_ast_warning {
  0% {opacity: 0;transform: translate(-50%, -50%) scale(0.7);}
  40% {opacity: 1;transform: translate(-50%, -50%) scale(1.2);}
  100% {opacity: 1;transform: translate(-50%, -50%) scale(1);}
}
@keyframes hide_ast_warning {
  0% {opacity: 1;transform: translate(-50%, -50%) scale(1);}
  40% {opacity: 1;transform: translate(-50%, -50%) scale(1.2);}
  100% {opacity: 0;transform: translate(-50%, -50%) scale(0.7);}
}
    `, 'warning')

   let element = () => selector ?? document.body
    element().insertAdjacentHTML('beforeend', `<div class="ast-warning ${!selector ? 'fixed' : ''}">${text}</div>`)

    var astWarn = element().querySelector('.ast-warning');
    setTimeout(() => {
      astWarn.style.animationName='hide_ast_warning'
      setTimeout(() => {
        astWarn.remove()
      }, 500); 
    }, 1500);
  },
  notify(params) {
    if(params){
      var ID = astronaut.create.id(),
        message = (params.message) ? params.message : false,  
        icon = (params.icon) ? params.icon : '',
        link = (params.link) ? params.link : false, 
        style = (params.style) ? params.style : false, 
        theme = (params.theme) ? params.theme : false, 
        autoClose = (params.autoClose) ? params.autoClose : false
        type = (params.type) ? params.type : false, 
        ok = (message) ? true : false,
        targetBlank = (link && link.target) ? link.target : false;
      //selector
      var selector = (params.selector) ? params.selector : document;
      if(selector.constructor.name === 'String') {
        selector = document.querySelector(`${selector}`)
        selector.style.position='relative'
      }


      //message
      if(message){
        message = message.split('->') 
        var mfirst = (message[0]) ? message[0] : '', msecond = message[1] ? message[1] : '',
        linkMessage = (link && link.message) ? link.message : false;
        message =  `<div class="details"><span title="${mfirst}">${mfirst}</span><p title="${msecond}">${msecond}</p></div>`,
        message = (link && linkMessage) ? `<a ${(targetBlank == '_blank') ? 'target="_blank"' : ''} href="${linkMessage}">${message}</a>` : message;
      } else {
        console.warn(`😊 Please enter at least one message! Ex: ${this.$shortName}.notify({message: 'you message'})`)
      }
      //type
      if(type){
        type_props = ['info','warn','error','off','success'];
        if(type_props.indexOf(type) == -1) {
          ok = false; 
          console.error(`${this.$shortName}.notify(type:'${type}'), The value informed is incorrect!`)}
      }
      //position
      position = (style.position) ? style.position : false;
      var l='-', r='', posone = 'top', postwo = 'left', 
      position_propsy = ['top','bottom'],
      position_propsx = ['left','right'];
      if(position){ position = position.split('->') 
        posone = position[0].trim()
        if(position[1]){postwo = position[1].trim()}
        if(position_propsy.indexOf(posone) == -1 || position_propsx.indexOf(postwo) == -1){ 
          ok = false; 
          console.error(`${this.$shortName}.notify(position:'${posone}->${postwo}' ), One of the values informed is incorrect!`)
        }
        if(posone == postwo) {
          ok = false; 
          console.error(`${this.$shortName}.notify(position:'${posone}->${postwo}'), You informed equal values!`)
        }
        if(posone == 'right' || postwo == 'right') {l='', r='-';}
      }
      //style
      var mdy = '2rem', mdx = '2rem';
      var bg              = (style.background)      ? style.background      : '#fff' ,
          color           = (style.color)           ? style.color           : '#878787' ,
          closeColor      = (style.closeColor)      ? style.closeColor      : '#878787' ,
          closeBackground = (style.closeBackground) ? style.closeBackground : '#f2f2f2' ,
          iconColor       = (style.iconColor)       ? style.iconColor       : '#fff' ,
          iconBackground  = (style.iconBackground)  ? style.iconBackground  : false ,
          border          = (style.border)          ? style.border          : '#2ecc71' ,
          iconSize        = (style.iconSize)        ? style.iconSize        : '2.2rem',
          closeSize       = (style.closeSize)       ? style.closeSize       : '0.8rem',
          margin          = (style.margin)          ? style.margin          : `${mdy} ${mdx}`,
          filter          = (style.filter)          ? style.filter          : 'none',
          timeout         = (style.timeout)         ? style.timeout         : '0.5s',
          bgBlur          = false;

      var s = style;
      if(s.background || s.color || s.closeColor || s.closeBackground || s.iconColor || s.border) {
        theme = false;
      }
      if(s.background && s.background.indexOf('->')){
        bg = s.background.split('->')[0]
        bgBlur = s.background.split('->')[1]
      }

      //icon
      if(icon && icon != ''){
        linkIcon = (link && link.icon) ? link.icon : false;
        isImg = (icon) ? this.check.isImg(icon) : false,
        icon = (icon) ? (isImg) 
        ? `<div class="icon" style="${(iconBackground) ? `background: ${iconBackground};` : ''}"><img ${(style.iconSize) ? `style="width:${style.iconSize}"` : ''} src="${icon}"></div>`  
        : `<div class="icon" style="${(iconBackground) ? `background: ${iconBackground};` : ''}"><i>${icon}</i></div>` : ''
        icon = (linkIcon) ? `<a ${(targetBlank == '_blank') ? 'target="_blank"' : ''} href="${linkIcon}">${icon}</a>` : icon
      }

      //margin
      if(margin.split(' ').length >= 3){
        ok = false; 
        console.error(`${this.$shortName}.notify(margin:'${margin}'), Margin property accepts only 2 arguments, eg 'arg1 arg2'!`)
      } margin = margin.split(' ')

      var 
      notifyContainer = `
        <div class="${this.$shortName}_notify"><div class="all_notify"></div></div>
      `,
      newNotifyHTML = `
        <div ${(autoClose) ? `id=${ID}` : ''} class="new_notify ${(type) ? type : ''} ${(theme && !style.background || theme && !style.color || theme && !style.iconColor || theme && !style.closeBackground || theme && !style.closeColor) ? theme : ''}">
          <div class="content">
            ${icon}
            ${message}
          </div>
          <div class="close-icon"><i>${icons.close}</i></div>
        </div>
      `
      css = `
        /*Astronaut Library.js - Notify*/
        .${this.$shortName}_notify {
          z-index: 99;
          position: absolute;
          max-height: 100%;
          ${posone}: ${(margin[0] == 'default') ? mdy : (posone == 'bottom') ? margin[0].split('rem')[0]-1+'rem' : margin[0]};
          ${postwo}: ${(margin[1] == undefined) ? mdx : margin[1]};
          display: flex;
          flex-direction: column;
  
          --dark-bg: #2d333b;
          --dark-font: #adbac7;
          --dark-icon: #fff;
          --dark-close-background: #22272e94;
          --dark-close-icon: #adbac7;

          --info:    #74ace6;
          --warn:    #f8cc51;
          --error:   #eb6161;
          --off:     #7a7b7a;
          --success: #2ecc71;
        }
        .${this.$shortName}_notify .all_notify::-webkit-scrollbar {
          width: 8px;
          border-radius: 0.4rem;
          background: #22272e94;
        }
        .${this.$shortName}_notify .all_notify::-webkit-scrollbar-thumb {
          height: 8px;
          border-radius: 0.4rem;
          background: #2d333b;
        }
        .${this.$shortName}_notify .all_notify::-webkit-scrollbar-track {
          border-radius: 0.4rem;
        }
        .new_notify {
          animation: show_notify ${timeout} ease forwards;
          filter: ${filter};
          display: grid;
          grid-template-columns: 1fr auto;
          background: ${bg};
          ${(bgBlur) ? `backdrop-filter: blur(${bgBlur});` : ''}
          border-radius: 10px;
          border-left: 5px solid ${border};
          box-shadow: 1px 7px 14px -5px rgba(0,0,0,0.35);
          align-items: center;
          overflow: hidden;
          transition: ease 0.2s;
          min-height: 3.5rem;
          height: 3.5rem;
          margin-bottom: 1rem;
          padding: 16px 15px 16px 16px;
          gap: 1rem;
          opacity: 1;
        }
        .new_notify.minimize {
          min-height: 0;
          height: 0rem;
          padding: 0px 15px 0px 16px;
          margin-bottom: 0rem;
        }
        .new_notify.dark {background: var(--dark-bg);}
        .new_notify.info {border-color: var(--info);}
        .new_notify.warn {border-color: var(--warn);}
        .new_notify.error {border-color: var(--error);}
        .new_notify.off {border-color: var(--off);}
        .new_notify.success {border-color: var(--success);}

        @keyframes show_notify {
          0%{ opacity: 0; height: 0rem;padding: 0px 15px 0px 16px;margin-bottom: 0rem;transform: translateX(${l}100%)}
          25%{height: 3.5rem;margin-bottom: 1rem;padding: 16px 15px 16px 16px;}
          40%{opacity: 1; transform: translateX(${r}10%);}
          80%, 100%{transform: translateX(${r}0rem);}
        }
        
        .new_notify.hide {
          animation: hide_notify ${timeout} ease forwards;
        }
        @keyframes hide_notify {
          0%{transform: translateX(${r}0rem);}
          40%{transform: translateX(${r}10%);}
          80%, 100%{
            opacity: 0;
            pointer-events: none;
            transform: translateX(${l}100%);
          }
        }
        .new_notify .content {
          display: flex;
          align-items: center;
          user-select: none;
          gap: 1rem;
        }
        .new_notify .content a {
          text-decoration: none;
        }
        .new_notify .content .icon {
          font-size: 25px;
          color: ${iconColor};
          height: 50px;
          width: 50px;
          text-align: center;
          line-height: 50px;
          border-radius: 50%;
          background: ${border};
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }        

        .new_notify.dark .content .icon {color: var(--dark-icon);}
        .new_notify.info .content .icon {background: var(--info);}
        .new_notify.warn .content .icon {background: var(--warn);}
        .new_notify.error .content .icon {background: var(--error);}
        .new_notify.off .content .icon {background: var(--off);}
        .new_notify.success .content .icon {background: var(--success);}

        .new_notify .content .icon.bg-none {
          background: transparent;
        }
        .new_notify .content .icon i svg {
          width: ${iconSize};
          height: ${iconSize};
        }
        .new_notify.off .content .icon {
          filter: grayscale(1);
        }
        .new_notify.off .content .icon i {
          opacity: 0.5;
        }
        .new_notify .content .icon img {
          border-radius: 50%;
          width: 100%;
        }
        .new_notify .content .details{
          width: 21rem;
          overflow: hidden;
          height: 3.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .new_notify .details span{
          font-size: 20px;
          font-weight: 500;
        }
        .new_notify .details p,
        .new_notify .details span {
          color: ${color};
          margin: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          display: block;
        }
        .new_notify.dark .details p, 
        .new_notify.dark .details span {
          color: var(--dark-font);
        }
        .new_notify .details p {
          opacity: 0.8
        }
        .new_notify .close-icon {
          color: ${closeColor};
          font-size: 23px;
          cursor: pointer;
          height: 40px;
          width: 40px;
          text-align: center;
          line-height: 40px;
          border-radius: 50%;
          background: ${closeBackground};
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .new_notify.dark .close-icon {
          color: var(--dark-close-icon);
          background: var(--dark-close-background);
        }
        .new_notify :is(.icon, .close-icon) i {
          display: flex;
        }
        .new_notify .close-icon i svg {
          width: ${closeSize};
          height: ${closeSize};
        }
        .new_notify .close-icon:hover{
          filter: brightness(0.9);
        }
      `;

      if(message || !message && style){
        this.insert.css(css, 'notify')
      }
      //function notifyClose
      HTMLElement.prototype.notifyClose=function(e){
        var _notify = this.closest('.new_notify')
        _notify.classList.add('hide')
        setTimeout(() => {
          _notify.classList.add('minimize')
          setTimeout(() => {
            _notify.remove()
          }, 500);

        }, timeout.split('s')[0]*1000-100);
      }
      function isNumber(variable) {
        if (variable instanceof Number || typeof variable ==='number') {
            return true;
        }
        return false;
      }
      //insert css and html
      if(ok){
        var _notify = selector.querySelector(`.${this.$shortName}_notify`);

        if(_notify){
          _notify.querySelector(`.all_notify`).insertAdjacentHTML('beforeend', newNotifyHTML)
        } else {
          ((selector.body) ? selector.body : selector).insertAdjacentHTML('beforeend', notifyContainer)
          selector.querySelector(`.${this.$shortName}_notify .all_notify`).insertAdjacentHTML('beforeend', newNotifyHTML)
        }
        
        var all_notify = selector.querySelector(`.${this.$shortName}_notify .all_notify`) ;
        if(all_notify.querySelectorAll(`div.new_notify`).length >= 7){
          setTimeout(() => {
            all_notify.querySelector(`div.new_notify`).notifyClose()
          }, 200);
        }
        //btnClose
        var close = false;
        var _btnClose = selector.querySelectorAll(`.${this.$shortName}_notify .close-icon`);
        _btnClose.forEach(btnClose => {
          btnClose.addEventListener('click', () => {
            btnClose.notifyClose()
            close = true;
          })
        })
        if(autoClose){
          setTimeout(() => {
            if(!close){
              selector.getElementById(ID).notifyClose()
            }
          }, (isNumber(autoClose)) ? autoClose : 5000);
        }

      }
    } else {
      console.warn(`😊 Please inform the parameters! Ex: ${this.$shortName}.notify({parameters})`)
    }
  },
  table(params) {
    var selector  = (params.selector)   ? params.selector   : false,
        thead     = (params.thead)      ? params.thead      : false,
        tbody     = (params.tbody)      ? params.tbody      : false,
        s         = (params.style)      ? params.style      : false,

        fontSize      = (s && s.fontSize)             ? s.fontSize           : false,
        theadColor    = (s && s.theadColor)           ? s.theadColor         : false,
        tbodyColor    = (s && s.tbodyColor)           ? s.tbodyColor         : false,
        theadBg       = (s && s.theadBackground)      ? s.theadBackground    : false,
        tbodyBg       = (s && s.tbodyBackground)      ? s.tbodyBackground    : false,
        blur          = (s && s.blur)                 ? s.blur               : false,
        borderInside  = (s && s.borderInside)         ? s.borderInside       : false,
        borderOutside = (s && s.borderOutside)        ? s.borderOutside      : false,
        borderRadius  = (s && s.borderRadius)         ? s.borderRadius       : false,
        boxShadow     = (s && s.boxShadow)            ? s.boxShadow          : false,
        trowHover     = (s && s.trowHover)            ? s.trowHover          : false,
        theadHTML     = '', tbodyHTML = '',
        borderInSize    = '1px',borderInX = true, borderInY = true, borderInColor = '#1f262b';

      if(borderInside){
       var borderray = s.borderInside.split(' ');
           borderInSize = (borderray[0] && borderray[0] != 'default') ? borderray[0] : borderInSize;
           borderInColor = (borderray[1] && borderray[1] != 'default') ? borderray[1] : borderInColor;
           borderInX = (borderray[2] && borderray[2] === 'false' && borderray[2] != 'true') ? false : borderInX
           borderInY = (borderray[3] && borderray[3] === 'false' && borderray[3] != 'true') ? false : borderInY
      }
      if(borderOutside){
        var borderOutrray = s.borderOutside.split(' '),
            borderOutSize = (borderOutrray[0]) ? borderOutrray[0] : '',
            borderOutColor = (borderOutrray[1]) ? borderOutrray[1] : 'currentColor';
       }


    this.insert.css(`
/*Astronaut Library.js - Table*/
.ast-table  {
  margin: 0.5rem 0;
  overflow: hidden;
  border-radius: 0.6rem;
  color: #939da5;
}
.ast-table table {
  width: 100%;
  border-spacing: 0;
  background: #232A2F;
}
.ast-table thead {
  background: #1a202363;
}
.ast-table :is(th, td) {
  text-align: left;
  padding: 0.4rem 0.8rem;
  height: 1.5rem;
  font-weight: normal;
}
.ast-table :is(th, td):last-child {
  border-right: none!important;
}
.ast-table tr:last-child :is(td) {
  border-bottom: none!important;
}
.ast-table :is(td) a {
  position: relative;
  color: #539bf5;
}
.ast-table :is(td) a:hover {
  text-decoration: underline;
}
.ast-table :is(td) a::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translate(-50%, -50%);
}

.ast-table tr {
  height: 2rem;
}
.ast-table [fira] {
  font-family: Fira Code, 'system-ui';
}
.ast-table [attr] {
  color: #9cdcfe;
}
.ast-table [boolean] {
  color: #36a3f0!important;
}
.ast-table [text] {
  color: #ce915b;
}
.ast-table [number] {
  color: #94cea8;
}
.ast-table [obj] {
  color: #4ec9b0;
}
.ast-table [opacity] {
  opacity: 0.6;
}
      `, 'table')

    function tableHTML(params) { 
      var thead = (params.thead) ? params.thead : false,
          tbody = (params.tbody) ? params.tbody : false;
      return `
        <div class="ast-table" 
        ${(borderRadius || blur || borderOutside || fontSize || boxShadow) ? `style="
        ${(blur) ? `backdrop-filter:blur(${blur});` : ''} 
        ${(borderOutside) ? `border: solid ${borderOutSize} ${borderOutColor};`: ''}
        ${(borderRadius) ? `border-radius: ${borderRadius};` : ''}
        ${(fontSize) ? `font-size: ${fontSize};` : ''}
        ${(boxShadow) ? `box-shadow: ${boxShadow};` : ''}
        "`: ''}
        >
          <table ${(blur) ? `style="background:#232a2f73;"` : ''}>
            <thead ${(theadBg || theadColor) ? `style="${(theadBg) ? `background:${theadBg};` : ''} ${(theadColor) ? `color:${theadColor}` : ''} "` : ''}>
              ${thead}
            </thead>
            <tbody ${(tbodyBg || tbodyColor) ? `style="${(tbodyBg) ? `background:${tbodyBg};` : ''} ${(tbodyColor) ? `color:${tbodyColor}` : ''} "` : ''}>
              ${tbody}
            </tbody>
          </table>
        </div>
      `
    }

    thead.forEach(th => {
      var prop = '';

      if(th.includes('->')){
        var thOld = th,
            param = th.split('->')[1].trim();

        if(param != ''){
          if(param.includes('width:') || param.includes('class:') || param.includes('attr:')){
            var name = param.split(':')[0],
                value = param.split(':')[1];
            if(name == 'width'){
              prop = `style="width:${value};"`
            } else if(name == 'class') {
              prop = `class="${value}"`
            } else if(name == 'attr') {
              prop = `${value}`
            }

          } else {
            console.error(`💔 ${astronaut.$shortName}.table()! Error in the parameter entered in '${thOld}', the parameter '${param.split(':')[0]}' is not color: `)
          }
        }
        th = th.split('->')[0].trim()

      }
      theadHTML += `<th 
      ${
        (borderInside) ? `style="
        ${(borderInX) ? `border-bottom: solid ${borderInSize} ${borderInColor};` : ''} 
        ${(borderInY) ? `border-right: solid ${borderInSize} ${borderInColor};` : ''}"` : ''
      }
      ${prop} >${th}</th>\n`
    });

    tbody.forEach(tr => {
      var tdHTML = '';

      tr.forEach(td => {
        var prop = '';

        if(td.includes('->')){
          var tdOld = td,
              param = td.split('->')[1].trim();

          if(param != ''){
            if(param.includes('color:') || param.includes('class:') || param.includes('attr:')){
              var name = param.split(':')[0],
                  value = param.split(':')[1];
              if(name == 'color'){
                prop = `style="color:${value};"`
              } else if(name == 'class') {
                prop = `class="${value}"`
              } else if(name == 'attr') {
                prop = `${value}`
              }

            } else {
              console.error(`💔 ${astronaut.$shortName}.table()! Error in the parameter entered in '${tdOld}', the parameter '${param.split(':')[0]}' is not color: `)
            }
          }
          td = td.split('->')[0].trim()

        }

        tdHTML += `<td
        ${
          (borderInside) ? `style="
          ${(borderInX) ? `border-bottom: solid ${borderInSize} ${borderInColor};` : ''} 
          ${(borderInY) ? `border-right: solid ${borderInSize} ${borderInColor};` : ''}"` : ''
        }
        ${prop}>${td}</td>\n`
      });
      tbodyHTML += `<tr>\n${tdHTML}</tr>\n`
    });

    var newTable = tableHTML({
      thead: theadHTML,
      tbody: tbodyHTML
    })

    
    if(selector){
      if(selector.constructor.name == 'String') {selector = document.querySelector(selector)}
      selector.innerHTML = newTable;
    } else {console.error('Astronaut.table(), selector: not defined!')}
    
    if(trowHover){
      var trowHoverArray = trowHover.split(' '),
          trowHoverColor = trowHoverArray[0],
          trowHoverTime = trowHoverArray[1];

      selector.querySelectorAll('.ast-table table tbody tr').forEach(e => {
        e.addEventListener('mouseover', () => {
          e.style.transition=`ease ${(trowHoverTime) ? trowHoverTime : '0.2s'}`
          e.style.background=`${(trowHoverColor) ? trowHoverColor : ''}`
        })
        e.addEventListener('mouseout', () => {
          e.style.transition=``
          e.style.background=``
        })
      })
    }
  },
  codeviewer(params = {}) {
    var e = params,
        s = e.style,
        lineNumber   = (e && e.lineNumber)        ? e.lineNumber         : false,
        fontSize     = (s && s.fontSize)          ? s.fontSize           : '0.9rem',
        fontFamily   = (s && s.fontFamily)        ? s.fontFamily         : 'Fira Code, "system-ui"',
        theme        = (s && s.theme)             ? s.theme              : 'copilot',
        background   = (s && s.background)        ? s.background         : false,
        color        = (s && s.color)             ? s.color              : false,
        blurFilter   = (s && s.blur)              ? s.blur               : false,
        width        = (s && s.width)             ? s.width              : '100%',
        height       = (s && s.height)            ? s.height             : 'auto',
        buttons      = (e && e.buttons)           ? e.buttons            : false,
        boxShadow    = (s && s.boxShadow)         ? s.boxShadow          : false,
        borderRadius = (s && s.borderRadius)      ? s.borderRadius       : '0.6rem',

        b           = buttons,
        opHyperlink = (b && b.hyperlink)    ? b.hyperlink    : false,
        opCopy      = (b && b.copy)         ? b.copy         : false,
        opPosition  = (b && b.position)     ? b.position     : 'window',
        opColor     = (b && b.color)        ? b.color        : '#939da5',
        opBg        = (b && b.backgroundHover )  ? b.backgroundHover   : '#adbac74a',

        windowBar   =  (s && s.windowBar == false || s && s.windowBar != undefined) 
        ? s.windowBar : true;
        if(!windowBar){opPosition = 'right'}


    //insertCSS
    function codeviewcss(params) {
      var ln = (params) ? params.lineNumber : false;
          lnColor     = (ln && ln.color)      ? ln.color      : '#adbac74a',
          lnSeparator = (ln && ln.separator)  ? ln.separator  : true,
          lnOpacity   = (ln && ln.opacity)    ? ln.opacity    : false,
  
          ff = params.fontFamily,
          fs = params.fontSize,
          th = params.theme,
          wb = params.windowBar,
  
    astronaut.insert.css(`
  /*Astronaut Library.js - CodeViewer*/
  .ast-codeviewer {
    width: ${width};
    height: ${height};
    border-radius: ${borderRadius};
    color: transparent; 
    margin: 0.5rem 0;
    position: relative;
    display: flex;
    ${(boxShadow) ? `box-shadow: ${boxShadow};` : ''}
  }
  .ast-codeviewer[data-blur] {
    backdrop-filter: blur(2rem);
  }
  .ast-codeviewer .astcw-window {
    width: 100%;
    display: grid;
    grid-template-rows: ${(wb) ? 'auto' : ''} 1fr;
    border-radius: ${borderRadius};
    position: relative;
  }
  script[type="text/plain"].ast-codeviewer,
  .ast-codeviewer i, .ast-codeviewer a {
    display: flex;
  }
  .ast-codeviewer :is(.astcw-container, .astch-y)::-webkit-scrollbar {
    width: 8px;
    height: 0px;
    border-radius: ${borderRadius};
    background: transparent;
  }
  .ast-codeviewer :is(.astcw-container, .astch-y)::-webkit-scrollbar-thumb {
    height: 5px;
    border-radius: ${borderRadius};
    margin: 1rem;
  }
  .ast-codeviewer :is(.astcw-container, .astch-y)::-webkit-scrollbar-track {
    border-radius: ${borderRadius};
  }
  .ast-codeviewer :is(.astcw-container, .astch-y)::-webkit-scrollbar-corner {
    background: transparent;
  }
  .ast-codeviewer .astch-y {
    display: grid;
    grid-template-columns: auto 1fr;
    overflow-y: auto;
    overflow-x: hidden;
    position: relative;
  }
  .ast-codeviewer .astcw-container {
    position: relative;
    padding: 1rem 0;
    margin: 0 0.5rem;
    overflow-x: auto;
    overflow-y: hidden;
  }
  .ast-codeviewer .astch-y:not(.line-numbers) .astcw-container {
    margin: 0 1rem;
  }
  .ast-codeviewer :is(.astvw-options) {
    ${(opPosition && opPosition == 'window' ) 
    ? '' : 'position: absolute;display: flex;flex-direction: column;'}
    ${(opPosition && opPosition == 'left' || opPosition == 'right') ? opPosition : 'right'}: -35px;
    top: 3px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: ease 0.2s;
    opacity: 0;
  }
  .ast-codeviewer :is(.op) {
    ${(opPosition && opPosition == 'window' ) 
    ? 'width: 20px;height:20px;border-radius: 0.3rem;padding: 0.1rem;' 
    : 'border-radius: 0.3rem;width: 25px;height:25px;'}
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }
  .ast-codeviewer :is(.op):hover {
    background: ${opBg};
  }
  .ast-codeviewer:hover .astvw-options {
    opacity: 1;
  }
  .ast-codeviewer :is(.op) a {
    color: ${opColor};
    ${(opPosition && opPosition == 'window' ) ? '' : 'padding: 0.3rem;'}
  }
  .ast-codeviewer .op.hyperlink a svg {
    margin-top: 1px;
  }
  .ast-codeviewer .op.run a svg {
    margin: 2px 0px 0px 2px;
  }
  .code-nav-bar {
    padding: 0.4rem 0.8rem;
    height: 2.5rem;
    display: grid;
    grid-template-columns: 5rem 1fr 5rem;
    align-items: center;
    border-radius: ${borderRadius} ${borderRadius} 0 0;
    font-family: system-ui;
  }
  .code-nav-bar .windowControl { 
    display: flex;
    align-items: center;
    gap: 0.3rem;
  }
  .code-nav-bar .windowControl [dot] { 
    width: 12px;
    height: 12px;
    border-radius: 50%;
  }
  .code-nav-bar .windowControl [dot="E0443E"] {background: #E0443E;}
  .code-nav-bar .windowControl [dot="DEA123"] {background: #DEA123;}
  .code-nav-bar .windowControl [dot="1AAB29"] {background: #1AAB29;}

  .code-nav-bar .title { 
    display: flex;
    align-items: center;
    justify-content: center;
    user-select: none;
  }
  .code-nav-bar .options { 
    display: flex;
    justify-content: flex-end;
  }
  .ast-codeviewer :is(pre, code, .line-numbers .line-numbers-rows) {
    font-family: ${ff};
    font-size: ${fs};
    outline: none;
    line-height: 1.5;
  }
  /*LINE-NUMBERS*/
  .ast-codeviewer .line-numbers .line-numbers-rows {
    ${(lnSeparator) ? 'border-right: 1px solid currentColor;' : ''}
    ${(lnOpacity) ? `opacity: ${lnOpacity};` : ''}
    color: ${lnColor};
  
  }
  .ast-codeviewer .line-numbers-rows>span {
    counter-increment: linenumber;
    display: flex;
    align-items: center;
    justify-content: end;
  }
  
  /*PRISM.JS STYLE DEFAULT*/
  
  code[class*=language-], pre[class*=language-] {
    background: 0 0;
    text-align: left;
    white-space: pre;
    word-spacing: normal;
    word-break: normal;
    word-wrap: normal;
    line-height: 1.5;
    -moz-tab-size: 4;
    -o-tab-size: 4;
    tab-size: 4;
    -webkit-hyphens: none;
    -moz-hyphens: none;
    -ms-hyphens: none;
    hyphens: none
  }
  :not(pre)>code[class*=language-], pre[class*=language-] {
      background: transparent
  }
  :not(pre)>code[class*=language-] {
      padding: .1em;
      border-radius: .3em;
      white-space: normal
  }
  pre[class*="language-"].line-numbers {
      margin: 0;
      counter-reset: linenumber;
      grid-column: 2;
  }

  pre[class*="language-"]:not(.line-numbers) {
    margin: 0;
  }
  pre[class*="language-"].line-numbers>code {
      white-space: inherit;
  }
  .line-numbers .line-numbers-rows {
    margin: 1rem 0 1rem 1rem;
    width: 2em;
    height: max-content;
    pointer-events: none;
    top: 1rem;
    font-size: 100%;
    left: 0.8em;
    /* works for line-numbers below 1000 lines */
    letter-spacing: -1px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
  .line-numbers-rows>span:before {
    content: counter(linenumber);
    display: block;
    padding-right: 0.8em;
    text-align: right;
  }
  .token:is(.bold, .important) {font-weight: 700}
  .token:is(.italic) {font-style: italic}
  .token:is(.entity) {cursor: help}
  .token:is(.inserted) {color: green}
  
  /*THEME COLOR*/
  ${
    (th == 'copilot') 
    ? `
  /*blur */
  [data-theme="copilot"][data-blur].ast-codeviewer                                   {background: #232a2f73}
  [data-theme="copilot"][data-blur].ast-codeviewer[visible],
  [data-theme="copilot"][data-blur] .token:is(.punctuation)                          {color: #939da5}
  [data-theme="copilot"][data-blur].ast-codeviewer .line-numbers-rows                {background: transparent}
  [data-theme="copilot"][data-blur].ast-codeviewer .code-nav-bar                     {background: #1a202363}

  [data-theme="copilot"].ast-codeviewer, .ast-codeviewer .line-numbers-rows                {background: ${(background) ? background : (blurFilter) ? '#232a2f73' : '#232A2F'}}
  [data-theme="copilot"].ast-codeviewer .code-nav-bar                                      {background: ${(wb.constructor.name === 'String') ? wb : '#1a202363'}}
  [data-theme="copilot"].ast-codeviewer :is(.astcw-container, .astch-y)::-webkit-scrollbar-thumb  {background: #444267}
  [data-theme="copilot"].ast-codeviewer :is(pre, code, span) ::selection                   {background: #204062}
  [data-theme="copilot"].ast-codeviewer[visible]                                           {color: ${(color) ? color : '#939da5'}}
  
  [data-theme="copilot"] .token:is(.block-comment, .cdata, .comment, .doctype, .prolog)    {color: #707a84}
  [data-theme="copilot"] .token:is(.punctuation)                                           {color: ${(color) ? color : '#939da5'}}
  [data-theme="copilot"] .token:is(.attr-name)                                             {color: #ffa763}
  [data-theme="copilot"] .token:is(.deleted, .namespace, .tag)                             {color: #ff6a80}
  [data-theme="copilot"] .token:is(.function-name)                                         {color: #82aaff}
  [data-theme="copilot"] .token:is(.boolean, .function, .number)                           {color: #e8d358}
  [data-theme="copilot"] .token:is(.class-name, .constant, .property, .symbol)             {color: #f8c555}
  [data-theme="copilot"] .token:is(.literal-property.property)                             {color: #ffa763}
  [data-theme="copilot"] .token:is(.atrule, .builtin, .important, .keyword, .selector)     {color: #ba8ef7}
  [data-theme="copilot"] .token:is(.selector)                                              {color: #ffa763}
  [data-theme="copilot"] .token:is(.attr-value, .char, .regex, .string, .variable)         {color: #54cc84}
  [data-theme="copilot"] .token:is(.entity, .operator, .url)                               {color: #67cdcc}
    `:''}`, 'codeviewer')
    }
    codeviewcss({lineNumber, fontSize, fontFamily, windowBar, theme})

    function codeviewHTML(params) {
      var lang = params.lang, title = (params.title) ? params.title : '';



      let html = /*html*/`
      <div class="astcw-window">
      ${(windowBar) ? `
        <div class="code-nav-bar">
          <div class="windowControl">
            <span dot="E0443E"></span>        
            <span dot="DEA123"></span>
            <span dot="1AAB29"></span>
          </div>
          <div class="title">${title}</div>
          <div class="options">
          
          </div>
        </div>
      ` : ''}
        <div class="astch-y">
          <div class="astcw-container">
            ${ `<pre><code class="language-${lang} ${(lineNumber) ? 'line-numbers' : ''}"></code></pre>`}
          </div>
        </div>
      </div>
      `
   
      return html
    }
    function setCodeViewText(selector, lang, codeViewText) {
        selector.querySelector('pre code').textContent = codeViewText
      return selector
    }
    function regex(text) {

      let spaceCount = text.search(/\S/) - 1;
      const regex = new RegExp(`(?:^|\\G)( {${spaceCount}}|\\t)`, 'gm');

      var substr = [
        [/&amp;/g, '&'],
        [/&lt;/g, '<'],
        [/&gt;/g, '>']
      ];
      Object.keys(substr).forEach(function(key) {
        text =  text.replace(substr[key][0], substr[key][1])
      });
      text = text.replace(regex, "")
      text = text.trim()
      return text
    }
    function setCodeViewTheme(theme, codeview) {
      if(!codeview.dataset.theme){
        codeview.setAttribute('data-theme', theme)
      }

    }
    function codeViewEach(e) {
      Array.prototype.forEach.call(document.querySelectorAll('.ast-codeviewer'), codeview => {
        e(codeview)
      })
    }
    function init() {
    
      codeViewEach((e) => {
        var codeview = e, codeViewText = regex(codeview.innerHTML);
        var lang = codeview.dataset.lang, 
            title = codeview.dataset.title;

        if(codeview.tagName == 'SCRIPT' && codeview.type == 'text/plain'){
          var attributes = codeview.attributes,
              newCodeView = document.createElement('div');

          Array.prototype.forEach.call(attributes, attr  => {
            if(attr.name != 'type'){
              newCodeView.setAttribute(attr.name, attr.value)
            }
          })

          newCodeView.innerHTML = codeviewHTML({lang, title})
          codeview.insertAdjacentHTML('afterend', setCodeViewText(newCodeView, lang, codeViewText).outerHTML)
          codeview.remove()
        } else {
          codeview.innerHTML = codeviewHTML({lang, title})
          setCodeViewText(codeview, lang, codeViewText)
        }
  
      })
      codeViewEach((e) => {
       /*  if(blurFilter) {e.setAttribute('data-blur', `${blurFilter}`)} */
        var width = e.dataset.width,
            height = e.dataset.height,
            blur = (e.dataset.blur != '') ? e.dataset.blur : false,
            lang = e.dataset.lang, 
            hyperlink = (e.dataset.hyperlink == 'false') ? false : (e.dataset.hyperlink == 'true') ? true : undefined,
            run = (e.dataset.run) ? e.dataset.run : false,
            isCopy = (e.dataset.copy === 'false') ? false : true;


        if(width){e.style.width=width} 
        if(height){e.style.height=height}
        if(blur) {e.style.backdropFilter=`blur(${blur})`}
        e.setAttribute('visible','')
        setCodeViewTheme(theme, e)

        //------options---------//
          var optionsHTML = `
          <div class="astvw-options">
            ${(run && lang == 'js') ? `
              <div class="op run" title="Run Code">
                <a>
                  <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" fill="#54cc84" class="bi bi-play-fill" viewBox="0 0 16 16">
                    <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/>
                  </svg>
                </a>
              </div>
            ` : ''}
            ${(!opCopy && isCopy || opCopy && isCopy) ? `
              <div class="op copy" title="Copy Code">
                <a>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-clipboard" viewBox="0 0 16 16">
                    <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>
                    <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/>
                  </svg>
                </a>
              </div>
            ` : ''}
            ${(opHyperlink && hyperlink == undefined && e.id != '' || hyperlink && e.id != '') ? `
              <div class="op hyperlink" title="Copy Hash">
                <a href="${'#'+e.id}" >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-link-45deg" viewBox="0 0 16 16">
                    <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z"/>
                    <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z"/>
                  </svg>
                </a>
              </div>
            ` : ''}
          </div>
          `

          if(opPosition && windowBar){
            e.querySelector('.code-nav-bar .options').insertAdjacentHTML('beforeend', optionsHTML)
          } else {
            e.insertAdjacentHTML('beforeend', optionsHTML)
          }

          if(opHyperlink && hyperlink == undefined || hyperlink){
            if(e.id == '') {
              console.warn(`😊 ${astronaut.$shortName}.codeview({hyperLink:})! Warning ! You enabled hyperlinking but did not provide an id attribute, enter an id="" in <div class="ast-codeviewer"> </div>. ')}`)
            } else {
              e.querySelector('.astvw-options .hyperlink a').addEventListener('click', a => {
                a.preventDefault()
                var href = e.querySelector('.astvw-options .hyperlink a').href
                astronaut.copy(href, e.querySelector('.astcw-window'))
              })
            }

          }
          if(!opCopy && isCopy || opCopy && isCopy){
            var btnCopy = e.querySelector('.astvw-options .copy');
            btnCopy.addEventListener('click', a => {
              a.preventDefault()
              var codeText = btnCopy.closest('.ast-codeviewer').querySelector('pre code').textContent
              astronaut.copy(codeText, e.querySelector('.astcw-window'))
            
            })
          }
          if(run && lang == 'js'){
            var btnRun = e.querySelector('.astvw-options .run'), 
                scriptID = astronaut.create.id();

            btnRun.addEventListener('click', a => {
              a.preventDefault()
              var codeText = btnRun.closest('.ast-codeviewer').querySelector('pre code').textContent,
                  newDiv = document.createElement('div'), 
                  newScript = document.createElement('script');

                  newScript.id = scriptID
                  newDiv.id ="scripts_run_codeviewer"
                  newScript.textContent = codeText

                  if(document.querySelector('#scripts_run_codeviewer')){
                    var scriptag = scripts_run_codeviewer.querySelector(`script#${scriptID}`)
                    if(!scriptag || scriptag.textContent != codeText){
                      if(scriptag) scriptag.remove()
                      scripts_run_codeviewer.appendChild(newScript)
                    }
                  } else {
                    document.body.appendChild(newDiv)
                    scripts_run_codeviewer.appendChild(newScript)
                  }
            })
          }
      })

    }
  //==================================START PRISM.JS=========================================//
    const prismjs = () => {
 /* PrismJS 1.29.0
https://prismjs.com/download.html#themes=prism-twilight&languages=markup+css+clike+javascript+bash+handlebars+json+js-templates+markup-templating+php+powershell+jsx+tsx+regex+typescript+vim+visual-basic+yaml */
var _self =
"undefined" != typeof window
    ? window
    : "undefined" != typeof WorkerGlobalScope &&
      self instanceof WorkerGlobalScope
    ? self
    : {},
Prism = (function (e) {
var n = /(?:^|\s)lang(?:uage)?-([\w-]+)(?=\s|$)/i,
    t = 0,
    r = {},
    a = {
        manual: e.Prism && e.Prism.manual,
        disableWorkerMessageHandler:
            e.Prism && e.Prism.disableWorkerMessageHandler,
        util: {
            encode: function e(n) {
                return n instanceof i
                    ? new i(n.type, e(n.content), n.alias)
                    : Array.isArray(n)
                    ? n.map(e)
                    : n
                          .replace(/&/g, "&amp;")
                          .replace(/</g, "&lt;")
                          .replace(/\u00a0/g, " ");
            },
            type: function (e) {
                return Object.prototype.toString.call(e).slice(8, -1);
            },
            objId: function (e) {
                return (
                    e.__id ||
                        Object.defineProperty(e, "__id", {
                            value: ++t,
                        }),
                    e.__id
                );
            },
            clone: function e(n, t) {
                var r, i;
                switch (((t = t || {}), a.util.type(n))) {
                    case "Object":
                        if (((i = a.util.objId(n)), t[i])) return t[i];
                        for (var l in ((r = {}), (t[i] = r), n))
                            n.hasOwnProperty(l) && (r[l] = e(n[l], t));
                        return r;
                    case "Array":
                        return (
                            (i = a.util.objId(n)),
                            t[i]
                                ? t[i]
                                : ((r = []),
                                  (t[i] = r),
                                  n.forEach(function (n, a) {
                                      r[a] = e(n, t);
                                  }),
                                  r)
                        );
                    default:
                        return n;
                }
            },
            getLanguage: function (e) {
                for (; e; ) {
                    var t = n.exec(e.className);
                    if (t) return t[1].toLowerCase();
                    e = e.parentElement;
                }
                return "none";
            },
            setLanguage: function (e, t) {
                (e.className = e.className.replace(
                    RegExp(n, "gi"),
                    ""
                )),
                    e.classList.add("language-" + t);
            },
            currentScript: function () {
                if ("undefined" == typeof document) return null;
                if ("currentScript" in document)
                    return document.currentScript;
                try {
                    throw new Error();
                } catch (r) {
                    var e = (/at [^(\r\n]*\((.*):[^:]+:[^:]+\)$/i.exec(
                        r.stack
                    ) || [])[1];
                    if (e) {
                        var n = document.getElementsByTagName("script");
                        for (var t in n) if (n[t].src == e) return n[t];
                    }
                    return null;
                }
            },
            isActive: function (e, n, t) {
                for (var r = "no-" + n; e; ) {
                    var a = e.classList;
                    if (a.contains(n)) return !0;
                    if (a.contains(r)) return !1;
                    e = e.parentElement;
                }
                return !!t;
            },
        },
        languages: {
            plain: r,
            plaintext: r,
            text: r,
            txt: r,
            extend: function (e, n) {
                var t = a.util.clone(a.languages[e]);
                for (var r in n) t[r] = n[r];
                return t;
            },
            insertBefore: function (e, n, t, r) {
                var i = (r = r || a.languages)[e],
                    l = {};
                for (var o in i)
                    if (i.hasOwnProperty(o)) {
                        if (o == n)
                            for (var s in t)
                                t.hasOwnProperty(s) && (l[s] = t[s]);
                        t.hasOwnProperty(o) || (l[o] = i[o]);
                    }
                var u = r[e];
                return (
                    (r[e] = l),
                    a.languages.DFS(a.languages, function (n, t) {
                        t === u && n != e && (this[n] = l);
                    }),
                    l
                );
            },
            DFS: function e(n, t, r, i) {
                i = i || {};
                var l = a.util.objId;
                for (var o in n)
                    if (n.hasOwnProperty(o)) {
                        t.call(n, o, n[o], r || o);
                        var s = n[o],
                            u = a.util.type(s);
                        "Object" !== u || i[l(s)]
                            ? "Array" !== u ||
                              i[l(s)] ||
                              ((i[l(s)] = !0), e(s, t, o, i))
                            : ((i[l(s)] = !0), e(s, t, null, i));
                    }
            },
        },
        plugins: {},
        highlightAll: function (e, n) {
            a.highlightAllUnder(document, e, n);
        },
        highlightAllUnder: function (e, n, t) {
            var r = {
                callback: t,
                container: e,
                selector:
                    'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code',
            };
            a.hooks.run("before-highlightall", r),
                (r.elements = Array.prototype.slice.apply(
                    r.container.querySelectorAll(r.selector)
                )),
                a.hooks.run("before-all-elements-highlight", r);
            for (var i, l = 0; (i = r.elements[l++]); )
                a.highlightElement(i, !0 === n, r.callback);
        },
        highlightElement: function (n, t, r) {
            var i = a.util.getLanguage(n),
                l = a.languages[i];
            a.util.setLanguage(n, i);
            var o = n.parentElement;
            o &&
                "pre" === o.nodeName.toLowerCase() &&
                a.util.setLanguage(o, i);
            var s = {
                element: n,
                language: i,
                grammar: l,
                code: n.textContent,
            };
            function u(e) {
                (s.highlightedCode = e),
                    a.hooks.run("before-insert", s),
                    (s.element.innerHTML = s.highlightedCode),
                    a.hooks.run("after-highlight", s),
                    a.hooks.run("complete", s),
                    r && r.call(s.element);
            }
            if (
                (a.hooks.run("before-sanity-check", s),
                (o = s.element.parentElement) &&
                    "pre" === o.nodeName.toLowerCase() &&
                    !o.hasAttribute("tabindex") &&
                    o.setAttribute("tabindex", "0"),
                !s.code)
            )
                return (
                    a.hooks.run("complete", s),
                    void (r && r.call(s.element))
                );
            if ((a.hooks.run("before-highlight", s), s.grammar))
                if (t && e.Worker) {
                    var c = new Worker(a.filename);
                    (c.onmessage = function (e) {
                        u(e.data);
                    }),
                        c.postMessage(
                            JSON.stringify({
                                language: s.language,
                                code: s.code,
                                immediateClose: !0,
                            })
                        );
                } else u(a.highlight(s.code, s.grammar, s.language));
            else u(a.util.encode(s.code));
        },
        highlight: function (e, n, t) {
            var r = { code: e, grammar: n, language: t };
            if ((a.hooks.run("before-tokenize", r), !r.grammar))
                throw new Error(
                    'The language "' + r.language + '" has no grammar.'
                );
            return (
                (r.tokens = a.tokenize(r.code, r.grammar)),
                a.hooks.run("after-tokenize", r),
                i.stringify(a.util.encode(r.tokens), r.language)
            );
        },
        tokenize: function (e, n) {
            var t = n.rest;
            if (t) {
                for (var r in t) n[r] = t[r];
                delete n.rest;
            }
            var a = new s();
            return (
                u(a, a.head, e),
                o(e, a, n, a.head, 0),
                (function (e) {
                    for (var n = [], t = e.head.next; t !== e.tail; )
                        n.push(t.value), (t = t.next);
                    return n;
                })(a)
            );
        },
        hooks: {
            all: {},
            add: function (e, n) {
                var t = a.hooks.all;
                (t[e] = t[e] || []), t[e].push(n);
            },
            run: function (e, n) {
                var t = a.hooks.all[e];
                if (t && t.length)
                    for (var r, i = 0; (r = t[i++]); ) r(n);
            },
        },
        Token: i,
    };
function i(e, n, t, r) {
    (this.type = e),
        (this.content = n),
        (this.alias = t),
        (this.length = 0 | (r || "").length);
}
function l(e, n, t, r) {
    e.lastIndex = n;
    var a = e.exec(t);
    if (a && r && a[1]) {
        var i = a[1].length;
        (a.index += i), (a[0] = a[0].slice(i));
    }
    return a;
}
function o(e, n, t, r, s, g) {
    for (var f in t)
        if (t.hasOwnProperty(f) && t[f]) {
            var h = t[f];
            h = Array.isArray(h) ? h : [h];
            for (var d = 0; d < h.length; ++d) {
                if (g && g.cause == f + "," + d) return;
                var v = h[d],
                    p = v.inside,
                    m = !!v.lookbehind,
                    y = !!v.greedy,
                    k = v.alias;
                if (y && !v.pattern.global) {
                    var x = v.pattern.toString().match(/[imsuy]*$/)[0];
                    v.pattern = RegExp(v.pattern.source, x + "g");
                }
                for (
                    var b = v.pattern || v, w = r.next, A = s;
                    w !== n.tail && !(g && A >= g.reach);
                    A += w.value.length, w = w.next
                ) {
                    var E = w.value;
                    if (n.length > e.length) return;
                    if (!(E instanceof i)) {
                        var P,
                            L = 1;
                        if (y) {
                            if (
                                !(P = l(b, A, e, m)) ||
                                P.index >= e.length
                            )
                                break;
                            var S = P.index,
                                O = P.index + P[0].length,
                                j = A;
                            for (j += w.value.length; S >= j; )
                                j += (w = w.next).value.length;
                            if (
                                ((A = j -= w.value.length),
                                w.value instanceof i)
                            )
                                continue;
                            for (
                                var C = w;
                                C !== n.tail &&
                                (j < O || "string" == typeof C.value);
                                C = C.next
                            )
                                L++, (j += C.value.length);
                            L--, (E = e.slice(A, j)), (P.index -= A);
                        } else if (!(P = l(b, 0, E, m))) continue;
                        S = P.index;
                        var N = P[0],
                            _ = E.slice(0, S),
                            M = E.slice(S + N.length),
                            W = A + E.length;
                        g && W > g.reach && (g.reach = W);
                        var z = w.prev;
                        if (
                            (_ && ((z = u(n, z, _)), (A += _.length)),
                            c(n, z, L),
                            (w = u(
                                n,
                                z,
                                new i(f, p ? a.tokenize(N, p) : N, k, N)
                            )),
                            M && u(n, w, M),
                            L > 1)
                        ) {
                            var I = { cause: f + "," + d, reach: W };
                            o(e, n, t, w.prev, A, I),
                                g &&
                                    I.reach > g.reach &&
                                    (g.reach = I.reach);
                        }
                    }
                }
            }
        }
}
function s() {
    var e = { value: null, prev: null, next: null },
        n = { value: null, prev: e, next: null };
    (e.next = n), (this.head = e), (this.tail = n), (this.length = 0);
}
function u(e, n, t) {
    var r = n.next,
        a = { value: t, prev: n, next: r };
    return (n.next = a), (r.prev = a), e.length++, a;
}
function c(e, n, t) {
    for (var r = n.next, a = 0; a < t && r !== e.tail; a++) r = r.next;
    (n.next = r), (r.prev = n), (e.length -= a);
}
if (
    ((e.Prism = a),
    (i.stringify = function e(n, t) {
        if ("string" == typeof n) return n;
        if (Array.isArray(n)) {
            var r = "";
            return (
                n.forEach(function (n) {
                    r += e(n, t);
                }),
                r
            );
        }
        var i = {
                type: n.type,
                content: e(n.content, t),
                tag: "span",
                classes: ["token", n.type],
                attributes: {},
                language: t,
            },
            l = n.alias;
        l &&
            (Array.isArray(l)
                ? Array.prototype.push.apply(i.classes, l)
                : i.classes.push(l)),
            a.hooks.run("wrap", i);
        var o = "";
        for (var s in i.attributes)
            o +=
                " " +
                s +
                '="' +
                (i.attributes[s] || "").replace(/"/g, "&quot;") +
                '"';
        return (
            "<" +
            i.tag +
            ' class="' +
            i.classes.join(" ") +
            '"' +
            o +
            ">" +
            i.content +
            "</" +
            i.tag +
            ">"
        );
    }),
    !e.document)
)
    return e.addEventListener
        ? (a.disableWorkerMessageHandler ||
              e.addEventListener(
                  "message",
                  function (n) {
                      var t = JSON.parse(n.data),
                          r = t.language,
                          i = t.code,
                          l = t.immediateClose;
                      e.postMessage(a.highlight(i, a.languages[r], r)),
                          l && e.close();
                  },
                  !1
              ),
          a)
        : a;
var g = a.util.currentScript();
function f() {
    a.manual || a.highlightAll();
}
if (
    (g &&
        ((a.filename = g.src),
        g.hasAttribute("data-manual") && (a.manual = !0)),
    !a.manual)
) {
    var h = document.readyState;
    "loading" === h || ("interactive" === h && g && g.defer)
        ? document.addEventListener("DOMContentLoaded", f)
        : window.requestAnimationFrame
        ? window.requestAnimationFrame(f)
        : window.setTimeout(f, 16);
}
return a;
})(_self);
"undefined" != typeof module && module.exports && (module.exports = Prism),
"undefined" != typeof global && (global.Prism = Prism);
(Prism.languages.markup = {
comment: { pattern: /<!--(?:(?!<!--)[\s\S])*?-->/, greedy: !0 },
prolog: { pattern: /<\?[\s\S]+?\?>/, greedy: !0 },
doctype: {
pattern:
    /<!DOCTYPE(?:[^>"'[\]]|"[^"]*"|'[^']*')+(?:\[(?:[^<"'\]]|"[^"]*"|'[^']*'|<(?!!--)|<!--(?:[^-]|-(?!->))*-->)*\]\s*)?>/i,
greedy: !0,
inside: {
    "internal-subset": {
        pattern: /(^[^\[]*\[)[\s\S]+(?=\]>$)/,
        lookbehind: !0,
        greedy: !0,
        inside: null,
    },
    string: { pattern: /"[^"]*"|'[^']*'/, greedy: !0 },
    punctuation: /^<!|>$|[[\]]/,
    "doctype-tag": /^DOCTYPE/i,
    name: /[^\s<>'"]+/,
},
},
cdata: { pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i, greedy: !0 },
tag: {
pattern:
    /<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/,
greedy: !0,
inside: {
    tag: {
        pattern: /^<\/?[^\s>\/]+/,
        inside: { punctuation: /^<\/?/, namespace: /^[^\s>\/:]+:/ },
    },
    "special-attr": [],
    "attr-value": {
        pattern: /=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/,
        inside: {
            punctuation: [
                { pattern: /^=/, alias: "attr-equals" },
                { pattern: /^(\s*)["']|["']$/, lookbehind: !0 },
            ],
        },
    },
    punctuation: /\/?>/,
    "attr-name": {
        pattern: /[^\s>\/]+/,
        inside: { namespace: /^[^\s>\/:]+:/ },
    },
},
},
entity: [
{ pattern: /&[\da-z]{1,8};/i, alias: "named-entity" },
/&#x?[\da-f]{1,8};/i,
],
}),
(Prism.languages.markup.tag.inside["attr-value"].inside.entity =
Prism.languages.markup.entity),
(Prism.languages.markup.doctype.inside["internal-subset"].inside =
Prism.languages.markup),
Prism.hooks.add("wrap", function (a) {
"entity" === a.type &&
    (a.attributes.title = a.content.replace(/&amp;/, "&"));
}),
Object.defineProperty(Prism.languages.markup.tag, "addInlined", {
value: function (a, e) {
    var s = {};
    (s["language-" + e] = {
        pattern: /(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,
        lookbehind: !0,
        inside: Prism.languages[e],
    }),
        (s.cdata = /^<!\[CDATA\[|\]\]>$/i);
    var t = {
        "included-cdata": {
            pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i,
            inside: s,
        },
    };
    t["language-" + e] = {
        pattern: /[\s\S]+/,
        inside: Prism.languages[e],
    };
    var n = {};
    (n[a] = {
        pattern: RegExp(
            "(<__[^>]*>)(?:<!\\[CDATA\\[(?:[^\\]]|\\](?!\\]>))*\\]\\]>|(?!<!\\[CDATA\\[)[^])*?(?=</__>)".replace(
                /__/g,
                function () {
                    return a;
                }
            ),
            "i"
        ),
        lookbehind: !0,
        greedy: !0,
        inside: t,
    }),
        Prism.languages.insertBefore("markup", "cdata", n);
},
}),
Object.defineProperty(Prism.languages.markup.tag, "addAttribute", {
value: function (a, e) {
    Prism.languages.markup.tag.inside["special-attr"].push({
        pattern: RegExp(
            "(^|[\"'\\s])(?:" +
                a +
                ")\\s*=\\s*(?:\"[^\"]*\"|'[^']*'|[^\\s'\">=]+(?=[\\s>]))",
            "i"
        ),
        lookbehind: !0,
        inside: {
            "attr-name": /^[^\s=]+/,
            "attr-value": {
                pattern: /=[\s\S]+/,
                inside: {
                    value: {
                        pattern:
                            /(^=\s*(["']|(?!["'])))\S[\s\S]*(?=\2$)/,
                        lookbehind: !0,
                        alias: [e, "language-" + e],
                        inside: Prism.languages[e],
                    },
                    punctuation: [
                        { pattern: /^=/, alias: "attr-equals" },
                        /"|'/,
                    ],
                },
            },
        },
    });
},
}),
(Prism.languages.html = Prism.languages.markup),
(Prism.languages.mathml = Prism.languages.markup),
(Prism.languages.svg = Prism.languages.markup),
(Prism.languages.xml = Prism.languages.extend("markup", {})),
(Prism.languages.ssml = Prism.languages.xml),
(Prism.languages.atom = Prism.languages.xml),
(Prism.languages.rss = Prism.languages.xml);
!(function (s) {
var e =
/(?:"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"|'(?:\\(?:\r\n|[\s\S])|[^'\\\r\n])*')/;
(s.languages.css = {
comment: /\/\*[\s\S]*?\*\//,
atrule: {
    pattern: RegExp(
        "@[\\w-](?:[^;{\\s\"']|\\s+(?!\\s)|" +
            e.source +
            ")*?(?:;|(?=\\s*\\{))"
    ),
    inside: {
        rule: /^@[\w-]+/,
        "selector-function-argument": {
            pattern:
                /(\bselector\s*\(\s*(?![\s)]))(?:[^()\s]|\s+(?![\s)])|\((?:[^()]|\([^()]*\))*\))+(?=\s*\))/,
            lookbehind: !0,
            alias: "selector",
        },
        keyword: {
            pattern: /(^|[^\w-])(?:and|not|only|or)(?![\w-])/,
            lookbehind: !0,
        },
    },
},
url: {
    pattern: RegExp(
        "\\burl\\((?:" +
            e.source +
            "|(?:[^\\\\\r\n()\"']|\\\\[^])*)\\)",
        "i"
    ),
    greedy: !0,
    inside: {
        function: /^url/i,
        punctuation: /^\(|\)$/,
        string: { pattern: RegExp("^" + e.source + "$"), alias: "url" },
    },
},
selector: {
    pattern: RegExp(
        "(^|[{}\\s])[^{}\\s](?:[^{};\"'\\s]|\\s+(?![\\s{])|" +
            e.source +
            ")*(?=\\s*\\{)"
    ),
    lookbehind: !0,
},
string: { pattern: e, greedy: !0 },
property: {
    pattern:
        /(^|[^-\w\xA0-\uFFFF])(?!\s)[-_a-z\xA0-\uFFFF](?:(?!\s)[-\w\xA0-\uFFFF])*(?=\s*:)/i,
    lookbehind: !0,
},
important: /!important\b/i,
function: {
    pattern: /(^|[^-a-z0-9])[-a-z0-9]+(?=\()/i,
    lookbehind: !0,
},
punctuation: /[(){};:,]/,
}),
(s.languages.css.atrule.inside.rest = s.languages.css);
var t = s.languages.markup;
t && (t.tag.addInlined("style", "css"), t.tag.addAttribute("style", "css"));
})(Prism);
Prism.languages.clike = {
comment: [
{
    pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,
    lookbehind: !0,
    greedy: !0,
},
{ pattern: /(^|[^\\:])\/\/.*/, lookbehind: !0, greedy: !0 },
],
string: {
pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
greedy: !0,
},
"class-name": {
pattern:
    /(\b(?:class|extends|implements|instanceof|interface|new|trait)\s+|\bcatch\s+\()[\w.\\]+/i,
lookbehind: !0,
inside: { punctuation: /[.\\]/ },
},
keyword:
/\b(?:break|catch|continue|do|else|finally|for|function|if|in|instanceof|new|null|return|throw|try|while)\b/,
boolean: /\b(?:false|true)\b/,
function: /\b\w+(?=\()/,
number: /\b0x[\da-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?/i,
operator: /[<>]=?|[!=]=?=?|--?|\+\+?|&&?|\|\|?|[?*/~^%]/,
punctuation: /[{}[\];(),.:]/,
};
(Prism.languages.javascript = Prism.languages.extend("clike", {
"class-name": [
Prism.languages.clike["class-name"],
{
    pattern:
        /(^|[^$\w\xA0-\uFFFF])(?!\s)[_$A-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\.(?:constructor|prototype))/,
    lookbehind: !0,
},
],
keyword: [
{ pattern: /((?:^|\})\s*)catch\b/, lookbehind: !0 },
{
    pattern:
        /(^|[^.]|\.\.\.\s*)\b(?:as|assert(?=\s*\{)|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally(?=\s*(?:\{|$))|for|from(?=\s*(?:['"]|$))|function|(?:get|set)(?=\s*(?:[#\[$\w\xA0-\uFFFF]|$))|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,
    lookbehind: !0,
},
],
function:
/#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,
number: {
pattern: RegExp(
    "(^|[^\\w$])(?:NaN|Infinity|0[bB][01]+(?:_[01]+)*n?|0[oO][0-7]+(?:_[0-7]+)*n?|0[xX][\\dA-Fa-f]+(?:_[\\dA-Fa-f]+)*n?|\\d+(?:_\\d+)*n|(?:\\d+(?:_\\d+)*(?:\\.(?:\\d+(?:_\\d+)*)?)?|\\.\\d+(?:_\\d+)*)(?:[Ee][+-]?\\d+(?:_\\d+)*)?)(?![\\w$])"
),
lookbehind: !0,
},
operator:
/--|\+\+|\*\*=?|=>|&&=?|\|\|=?|[!=]==|<<=?|>>>?=?|[-+*/%&|^!=<>]=?|\.{3}|\?\?=?|\?\.?|[~:]/,
})),
(Prism.languages.javascript["class-name"][0].pattern =
/(\b(?:class|extends|implements|instanceof|interface|new)\s+)[\w.\\]+/),
Prism.languages.insertBefore("javascript", "keyword", {
regex: {
    pattern: RegExp(
        "((?:^|[^$\\w\\xA0-\\uFFFF.\"'\\])\\s]|\\b(?:return|yield))\\s*)/(?:(?:\\[(?:[^\\]\\\\\r\n]|\\\\.)*\\]|\\\\.|[^/\\\\\\[\r\n])+/[dgimyus]{0,7}|(?:\\[(?:[^[\\]\\\\\r\n]|\\\\.|\\[(?:[^[\\]\\\\\r\n]|\\\\.|\\[(?:[^[\\]\\\\\r\n]|\\\\.)*\\])*\\])*\\]|\\\\.|[^/\\\\\\[\r\n])+/[dgimyus]{0,7}v[dgimyus]{0,7})(?=(?:\\s|/\\*(?:[^*]|\\*(?!/))*\\*/)*(?:$|[\r\n,.;:})\\]]|//))"
    ),
    lookbehind: !0,
    greedy: !0,
    inside: {
        "regex-source": {
            pattern: /^(\/)[\s\S]+(?=\/[a-z]*$)/,
            lookbehind: !0,
            alias: "language-regex",
            inside: Prism.languages.regex,
        },
        "regex-delimiter": /^\/|\/$/,
        "regex-flags": /^[a-z]+$/,
    },
},
"function-variable": {
    pattern:
        /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)\s*=>))/,
    alias: "function",
},
parameter: [
    {
        pattern:
            /(function(?:\s+(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)?\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\))/,
        lookbehind: !0,
        inside: Prism.languages.javascript,
    },
    {
        pattern:
            /(^|[^$\w\xA0-\uFFFF])(?!\s)[_$a-z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*=>)/i,
        lookbehind: !0,
        inside: Prism.languages.javascript,
    },
    {
        pattern:
            /(\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*=>)/,
        lookbehind: !0,
        inside: Prism.languages.javascript,
    },
    {
        pattern:
            /((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*)\(\s*|\]\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*\{)/,
        lookbehind: !0,
        inside: Prism.languages.javascript,
    },
],
constant: /\b[A-Z](?:[A-Z_]|\dx?)*\b/,
}),
Prism.languages.insertBefore("javascript", "string", {
hashbang: { pattern: /^#!.*/, greedy: !0, alias: "comment" },
"template-string": {
    pattern:
        /`(?:\\[\s\S]|\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}|(?!\$\{)[^\\`])*`/,
    greedy: !0,
    inside: {
        "template-punctuation": { pattern: /^`|`$/, alias: "string" },
        interpolation: {
            pattern:
                /((?:^|[^\\])(?:\\{2})*)\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}/,
            lookbehind: !0,
            inside: {
                "interpolation-punctuation": {
                    pattern: /^\$\{|\}$/,
                    alias: "punctuation",
                },
                rest: Prism.languages.javascript,
            },
        },
        string: /[\s\S]+/,
    },
},
"string-property": {
    pattern:
        /((?:^|[,{])[ \t]*)(["'])(?:\\(?:\r\n|[\s\S])|(?!\2)[^\\\r\n])*\2(?=\s*:)/m,
    lookbehind: !0,
    greedy: !0,
    alias: "property",
},
}),
Prism.languages.insertBefore("javascript", "operator", {
"literal-property": {
    pattern:
        /((?:^|[,{])[ \t]*)(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*:)/m,
    lookbehind: !0,
    alias: "property",
},
}),
Prism.languages.markup &&
(Prism.languages.markup.tag.addInlined("script", "javascript"),
Prism.languages.markup.tag.addAttribute(
    "on(?:abort|blur|change|click|composition(?:end|start|update)|dblclick|error|focus(?:in|out)?|key(?:down|up)|load|mouse(?:down|enter|leave|move|out|over|up)|reset|resize|scroll|select|slotchange|submit|unload|wheel)",
    "javascript"
)),
(Prism.languages.js = Prism.languages.javascript);
!(function (e) {
var t =
    "\\b(?:BASH|BASHOPTS|BASH_ALIASES|BASH_ARGC|BASH_ARGV|BASH_CMDS|BASH_COMPLETION_COMPAT_DIR|BASH_LINENO|BASH_REMATCH|BASH_SOURCE|BASH_VERSINFO|BASH_VERSION|COLORTERM|COLUMNS|COMP_WORDBREAKS|DBUS_SESSION_BUS_ADDRESS|DEFAULTS_PATH|DESKTOP_SESSION|DIRSTACK|DISPLAY|EUID|GDMSESSION|GDM_LANG|GNOME_KEYRING_CONTROL|GNOME_KEYRING_PID|GPG_AGENT_INFO|GROUPS|HISTCONTROL|HISTFILE|HISTFILESIZE|HISTSIZE|HOME|HOSTNAME|HOSTTYPE|IFS|INSTANCE|JOB|LANG|LANGUAGE|LC_ADDRESS|LC_ALL|LC_IDENTIFICATION|LC_MEASUREMENT|LC_MONETARY|LC_NAME|LC_NUMERIC|LC_PAPER|LC_TELEPHONE|LC_TIME|LESSCLOSE|LESSOPEN|LINES|LOGNAME|LS_COLORS|MACHTYPE|MAILCHECK|MANDATORY_PATH|NO_AT_BRIDGE|OLDPWD|OPTERR|OPTIND|ORBIT_SOCKETDIR|OSTYPE|PAPERSIZE|PATH|PIPESTATUS|PPID|PS1|PS2|PS3|PS4|PWD|RANDOM|REPLY|SECONDS|SELINUX_INIT|SESSION|SESSIONTYPE|SESSION_MANAGER|SHELL|SHELLOPTS|SHLVL|SSH_AUTH_SOCK|TERM|UID|UPSTART_EVENTS|UPSTART_INSTANCE|UPSTART_JOB|UPSTART_SESSION|USER|WINDOWID|XAUTHORITY|XDG_CONFIG_DIRS|XDG_CURRENT_DESKTOP|XDG_DATA_DIRS|XDG_GREETER_DATA_DIR|XDG_MENU_PREFIX|XDG_RUNTIME_DIR|XDG_SEAT|XDG_SEAT_PATH|XDG_SESSION_DESKTOP|XDG_SESSION_ID|XDG_SESSION_PATH|XDG_SESSION_TYPE|XDG_VTNR|XMODIFIERS)\\b",
a = {
    pattern: /(^(["']?)\w+\2)[ \t]+\S.*/,
    lookbehind: !0,
    alias: "punctuation",
    inside: null,
},
n = {
    bash: a,
    environment: { pattern: RegExp("\\$" + t), alias: "constant" },
    variable: [
        {
            pattern: /\$?\(\([\s\S]+?\)\)/,
            greedy: !0,
            inside: {
                variable: [
                    { pattern: /(^\$\(\([\s\S]+)\)\)/, lookbehind: !0 },
                    /^\$\(\(/,
                ],
                number: /\b0x[\dA-Fa-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:[Ee]-?\d+)?/,
                operator:
                    /--|\+\+|\*\*=?|<<=?|>>=?|&&|\|\||[=!+\-*/%<>^&|]=?|[?~:]/,
                punctuation: /\(\(?|\)\)?|,|;/,
            },
        },
        {
            pattern: /\$\((?:\([^)]+\)|[^()])+\)|`[^`]+`/,
            greedy: !0,
            inside: { variable: /^\$\(|^`|\)$|`$/ },
        },
        {
            pattern: /\$\{[^}]+\}/,
            greedy: !0,
            inside: {
                operator: /:[-=?+]?|[!\/]|##?|%%?|\^\^?|,,?/,
                punctuation: /[\[\]]/,
                environment: {
                    pattern: RegExp("(\\{)" + t),
                    lookbehind: !0,
                    alias: "constant",
                },
            },
        },
        /\$(?:\w+|[#?*!@$])/,
    ],
    entity: /\\(?:[abceEfnrtv\\"]|O?[0-7]{1,3}|U[0-9a-fA-F]{8}|u[0-9a-fA-F]{4}|x[0-9a-fA-F]{1,2})/,
};
(e.languages.bash = {
shebang: { pattern: /^#!\s*\/.*/, alias: "important" },
comment: { pattern: /(^|[^"{\\$])#.*/, lookbehind: !0 },
"function-name": [
    {
        pattern: /(\bfunction\s+)[\w-]+(?=(?:\s*\(?:\s*\))?\s*\{)/,
        lookbehind: !0,
        alias: "function",
    },
    { pattern: /\b[\w-]+(?=\s*\(\s*\)\s*\{)/, alias: "function" },
],
"for-or-select": {
    pattern: /(\b(?:for|select)\s+)\w+(?=\s+in\s)/,
    alias: "variable",
    lookbehind: !0,
},
"assign-left": {
    pattern: /(^|[\s;|&]|[<>]\()\w+(?:\.\w+)*(?=\+?=)/,
    inside: {
        environment: {
            pattern: RegExp("(^|[\\s;|&]|[<>]\\()" + t),
            lookbehind: !0,
            alias: "constant",
        },
    },
    alias: "variable",
    lookbehind: !0,
},
parameter: {
    pattern: /(^|\s)-{1,2}(?:\w+:[+-]?)?\w+(?:\.\w+)*(?=[=\s]|$)/,
    alias: "variable",
    lookbehind: !0,
},
string: [
    {
        pattern: /((?:^|[^<])<<-?\s*)(\w+)\s[\s\S]*?(?:\r?\n|\r)\2/,
        lookbehind: !0,
        greedy: !0,
        inside: n,
    },
    {
        pattern:
            /((?:^|[^<])<<-?\s*)(["'])(\w+)\2\s[\s\S]*?(?:\r?\n|\r)\3/,
        lookbehind: !0,
        greedy: !0,
        inside: { bash: a },
    },
    {
        pattern:
            /(^|[^\\](?:\\\\)*)"(?:\\[\s\S]|\$\([^)]+\)|\$(?!\()|`[^`]+`|[^"\\`$])*"/,
        lookbehind: !0,
        greedy: !0,
        inside: n,
    },
    { pattern: /(^|[^$\\])'[^']*'/, lookbehind: !0, greedy: !0 },
    {
        pattern: /\$'(?:[^'\\]|\\[\s\S])*'/,
        greedy: !0,
        inside: { entity: n.entity },
    },
],
environment: { pattern: RegExp("\\$?" + t), alias: "constant" },
variable: n.variable,
function: {
    pattern:
        /(^|[\s;|&]|[<>]\()(?:add|apropos|apt|apt-cache|apt-get|aptitude|aspell|automysqlbackup|awk|basename|bash|bc|bconsole|bg|bzip2|cal|cargo|cat|cfdisk|chgrp|chkconfig|chmod|chown|chroot|cksum|clear|cmp|column|comm|composer|cp|cron|crontab|csplit|curl|cut|date|dc|dd|ddrescue|debootstrap|df|diff|diff3|dig|dir|dircolors|dirname|dirs|dmesg|docker|docker-compose|du|egrep|eject|env|ethtool|expand|expect|expr|fdformat|fdisk|fg|fgrep|file|find|fmt|fold|format|free|fsck|ftp|fuser|gawk|git|gparted|grep|groupadd|groupdel|groupmod|groups|grub-mkconfig|gzip|halt|head|hg|history|host|hostname|htop|iconv|id|ifconfig|ifdown|ifup|import|install|ip|java|jobs|join|kill|killall|less|link|ln|locate|logname|logrotate|look|lpc|lpr|lprint|lprintd|lprintq|lprm|ls|lsof|lynx|make|man|mc|mdadm|mkconfig|mkdir|mke2fs|mkfifo|mkfs|mkisofs|mknod|mkswap|mmv|more|most|mount|mtools|mtr|mutt|mv|nano|nc|netstat|nice|nl|node|nohup|notify-send|npm|nslookup|op|open|parted|passwd|paste|pathchk|ping|pkill|pnpm|podman|podman-compose|popd|pr|printcap|printenv|ps|pushd|pv|quota|quotacheck|quotactl|ram|rar|rcp|reboot|remsync|rename|renice|rev|rm|rmdir|rpm|rsync|scp|screen|sdiff|sed|sendmail|seq|service|sftp|sh|shellcheck|shuf|shutdown|sleep|slocate|sort|split|ssh|stat|strace|su|sudo|sum|suspend|swapon|sync|sysctl|tac|tail|tar|tee|time|timeout|top|touch|tr|traceroute|tsort|tty|umount|uname|unexpand|uniq|units|unrar|unshar|unzip|update-grub|uptime|useradd|userdel|usermod|users|uudecode|uuencode|v|vcpkg|vdir|vi|vim|virsh|vmstat|wait|watch|wc|wget|whereis|which|who|whoami|write|xargs|xdg-open|yarn|yes|zenity|zip|zsh|zypper)(?=$|[)\s;|&])/,
    lookbehind: !0,
},
keyword: {
    pattern:
        /(^|[\s;|&]|[<>]\()(?:case|do|done|elif|else|esac|fi|for|function|if|in|select|then|until|while)(?=$|[)\s;|&])/,
    lookbehind: !0,
},
builtin: {
    pattern:
        /(^|[\s;|&]|[<>]\()(?:\.|:|alias|bind|break|builtin|caller|cd|command|continue|declare|echo|enable|eval|exec|exit|export|getopts|hash|help|let|local|logout|mapfile|printf|pwd|read|readarray|readonly|return|set|shift|shopt|source|test|times|trap|type|typeset|ulimit|umask|unalias|unset)(?=$|[)\s;|&])/,
    lookbehind: !0,
    alias: "class-name",
},
boolean: {
    pattern: /(^|[\s;|&]|[<>]\()(?:false|true)(?=$|[)\s;|&])/,
    lookbehind: !0,
},
"file-descriptor": { pattern: /\B&\d\b/, alias: "important" },
operator: {
    pattern:
        /\d?<>|>\||\+=|=[=~]?|!=?|<<[<-]?|[&\d]?>>|\d[<>]&?|[<>][&=]?|&[>&]?|\|[&|]?/,
    inside: {
        "file-descriptor": { pattern: /^\d/, alias: "important" },
    },
},
punctuation: /\$?\(\(?|\)\)?|\.\.|[{}[\];\\]/,
number: {
    pattern: /(^|\s)(?:[1-9]\d*|0)(?:[.,]\d+)?\b/,
    lookbehind: !0,
},
}),
(a.inside = e.languages.bash);
for (
var s = [
        "comment",
        "function-name",
        "for-or-select",
        "assign-left",
        "parameter",
        "string",
        "environment",
        "function",
        "keyword",
        "builtin",
        "boolean",
        "file-descriptor",
        "operator",
        "punctuation",
        "number",
    ],
    o = n.variable[1].inside,
    i = 0;
i < s.length;
i++
)
o[s[i]] = e.languages.bash[s[i]];
(e.languages.sh = e.languages.bash), (e.languages.shell = e.languages.bash);
})(Prism);
!(function (e) {
function n(e, n) {
return "___" + e.toUpperCase() + n + "___";
}
Object.defineProperties((e.languages["markup-templating"] = {}), {
buildPlaceholders: {
    value: function (t, a, r, o) {
        if (t.language === a) {
            var c = (t.tokenStack = []);
            (t.code = t.code.replace(r, function (e) {
                if ("function" == typeof o && !o(e)) return e;
                for (
                    var r, i = c.length;
                    -1 !== t.code.indexOf((r = n(a, i)));

                )
                    ++i;
                return (c[i] = e), r;
            })),
                (t.grammar = e.languages.markup);
        }
    },
},
tokenizePlaceholders: {
    value: function (t, a) {
        if (t.language === a && t.tokenStack) {
            t.grammar = e.languages[a];
            var r = 0,
                o = Object.keys(t.tokenStack);
            !(function c(i) {
                for (var u = 0; u < i.length && !(r >= o.length); u++) {
                    var g = i[u];
                    if (
                        "string" == typeof g ||
                        (g.content && "string" == typeof g.content)
                    ) {
                        var l = o[r],
                            s = t.tokenStack[l],
                            f = "string" == typeof g ? g : g.content,
                            p = n(a, l),
                            k = f.indexOf(p);
                        if (k > -1) {
                            ++r;
                            var m = f.substring(0, k),
                                d = new e.Token(
                                    a,
                                    e.tokenize(s, t.grammar),
                                    "language-" + a,
                                    s
                                ),
                                h = f.substring(k + p.length),
                                v = [];
                            m && v.push.apply(v, c([m])),
                                v.push(d),
                                h && v.push.apply(v, c([h])),
                                "string" == typeof g
                                    ? i.splice.apply(
                                          i,
                                          [u, 1].concat(v)
                                      )
                                    : (g.content = v);
                        }
                    } else g.content && c(g.content);
                }
                return i;
            })(t.tokens);
        }
    },
},
});
})(Prism);
!(function (a) {
(a.languages.handlebars = {
comment: /\{\{![\s\S]*?\}\}/,
delimiter: { pattern: /^\{\{\{?|\}\}\}?$/, alias: "punctuation" },
string: /(["'])(?:\\.|(?!\1)[^\\\r\n])*\1/,
number: /\b0x[\dA-Fa-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:[Ee][+-]?\d+)?/,
boolean: /\b(?:false|true)\b/,
block: {
    pattern: /^(\s*(?:~\s*)?)[#\/]\S+?(?=\s*(?:~\s*)?$|\s)/,
    lookbehind: !0,
    alias: "keyword",
},
brackets: {
    pattern: /\[[^\]]+\]/,
    inside: { punctuation: /\[|\]/, variable: /[\s\S]+/ },
},
punctuation: /[!"#%&':()*+,.\/;<=>@\[\\\]^`{|}~]/,
variable: /[^!"#%&'()*+,\/;<=>@\[\\\]^`{|}~\s]+/,
}),
a.hooks.add("before-tokenize", function (e) {
    a.languages["markup-templating"].buildPlaceholders(
        e,
        "handlebars",
        /\{\{\{[\s\S]+?\}\}\}|\{\{[\s\S]+?\}\}/g
    );
}),
a.hooks.add("after-tokenize", function (e) {
    a.languages["markup-templating"].tokenizePlaceholders(
        e,
        "handlebars"
    );
}),
(a.languages.hbs = a.languages.handlebars),
(a.languages.mustache = a.languages.handlebars);
})(Prism);
(Prism.languages.json = {
property: {
pattern: /(^|[^\\])"(?:\\.|[^\\"\r\n])*"(?=\s*:)/,
lookbehind: !0,
greedy: !0,
},
string: {
pattern: /(^|[^\\])"(?:\\.|[^\\"\r\n])*"(?!\s*:)/,
lookbehind: !0,
greedy: !0,
},
comment: { pattern: /\/\/.*|\/\*[\s\S]*?(?:\*\/|$)/, greedy: !0 },
number: /-?\b\d+(?:\.\d+)?(?:e[+-]?\d+)?\b/i,
punctuation: /[{}[\],]/,
operator: /:/,
boolean: /\b(?:false|true)\b/,
null: { pattern: /\bnull\b/, alias: "keyword" },
}),
(Prism.languages.webmanifest = Prism.languages.json);
!(function (e) {
var t = e.languages.javascript["template-string"],
n = t.pattern.source,
r = t.inside.interpolation,
a = r.inside["interpolation-punctuation"],
i = r.pattern.source;
function o(t, r) {
if (e.languages[t])
    return {
        pattern: RegExp("((?:" + r + ")\\s*)" + n),
        lookbehind: !0,
        greedy: !0,
        inside: {
            "template-punctuation": {
                pattern: /^`|`$/,
                alias: "string",
            },
            "embedded-code": { pattern: /[\s\S]+/, alias: t },
        },
    };
}
function s(e, t) {
return "___" + t.toUpperCase() + "_" + e + "___";
}
function p(t, n, r) {
var a = { code: t, grammar: n, language: r };
return (
    e.hooks.run("before-tokenize", a),
    (a.tokens = e.tokenize(a.code, a.grammar)),
    e.hooks.run("after-tokenize", a),
    a.tokens
);
}
function l(t) {
var n = {};
n["interpolation-punctuation"] = a;
var i = e.tokenize(t, n);
if (3 === i.length) {
    var o = [1, 1];
    o.push.apply(o, p(i[1], e.languages.javascript, "javascript")),
        i.splice.apply(i, o);
}
return new e.Token("interpolation", i, r.alias, t);
}
function g(t, n, r) {
var a = e.tokenize(t, {
        interpolation: { pattern: RegExp(i), lookbehind: !0 },
    }),
    o = 0,
    g = {},
    u = p(
        a
            .map(function (e) {
                if ("string" == typeof e) return e;
                for (
                    var n, a = e.content;
                    -1 !== t.indexOf((n = s(o++, r)));

                );
                return (g[n] = a), n;
            })
            .join(""),
        n,
        r
    ),
    c = Object.keys(g);
return (
    (o = 0),
    (function e(t) {
        for (var n = 0; n < t.length; n++) {
            if (o >= c.length) return;
            var r = t[n];
            if ("string" == typeof r || "string" == typeof r.content) {
                var a = c[o],
                    i = "string" == typeof r ? r : r.content,
                    s = i.indexOf(a);
                if (-1 !== s) {
                    ++o;
                    var p = i.substring(0, s),
                        u = l(g[a]),
                        f = i.substring(s + a.length),
                        y = [];
                    if ((p && y.push(p), y.push(u), f)) {
                        var v = [f];
                        e(v), y.push.apply(y, v);
                    }
                    "string" == typeof r
                        ? (t.splice.apply(t, [n, 1].concat(y)),
                          (n += y.length - 1))
                        : (r.content = y);
                }
            } else {
                var d = r.content;
                Array.isArray(d) ? e(d) : e([d]);
            }
        }
    })(u),
    new e.Token(r, u, "language-" + r, t)
);
}
e.languages.javascript["template-string"] = [
o(
    "css",
    "\\b(?:styled(?:\\([^)]*\\))?(?:\\s*\\.\\s*\\w+(?:\\([^)]*\\))*)*|css(?:\\s*\\.\\s*(?:global|resolve))?|createGlobalStyle|keyframes)"
),
o("html", "\\bhtml|\\.\\s*(?:inner|outer)HTML\\s*\\+?="),
o("svg", "\\bsvg"),
o("markdown", "\\b(?:markdown|md)"),
o("graphql", "\\b(?:gql|graphql(?:\\s*\\.\\s*experimental)?)"),
o("sql", "\\bsql"),
t,
].filter(Boolean);
var u = {
javascript: !0,
js: !0,
typescript: !0,
ts: !0,
jsx: !0,
tsx: !0,
};
function c(e) {
return "string" == typeof e
    ? e
    : Array.isArray(e)
    ? e.map(c).join("")
    : c(e.content);
}
e.hooks.add("after-tokenize", function (t) {
t.language in u &&
    (function t(n) {
        for (var r = 0, a = n.length; r < a; r++) {
            var i = n[r];
            if ("string" != typeof i) {
                var o = i.content;
                if (Array.isArray(o))
                    if ("template-string" === i.type) {
                        var s = o[1];
                        if (
                            3 === o.length &&
                            "string" != typeof s &&
                            "embedded-code" === s.type
                        ) {
                            var p = c(s),
                                l = s.alias,
                                u = Array.isArray(l) ? l[0] : l,
                                f = e.languages[u];
                            if (!f) continue;
                            o[1] = g(p, f, u);
                        }
                    } else t(o);
                else "string" != typeof o && t([o]);
            }
        }
    })(t.tokens);
});
})(Prism);
!(function (e) {
var a = /\/\*[\s\S]*?\*\/|\/\/.*|#(?!\[).*/,
t = [
    { pattern: /\b(?:false|true)\b/i, alias: "boolean" },
    {
        pattern: /(::\s*)\b[a-z_]\w*\b(?!\s*\()/i,
        greedy: !0,
        lookbehind: !0,
    },
    {
        pattern: /(\b(?:case|const)\s+)\b[a-z_]\w*(?=\s*[;=])/i,
        greedy: !0,
        lookbehind: !0,
    },
    /\b(?:null)\b/i,
    /\b[A-Z_][A-Z0-9_]*\b(?!\s*\()/,
],
i =
    /\b0b[01]+(?:_[01]+)*\b|\b0o[0-7]+(?:_[0-7]+)*\b|\b0x[\da-f]+(?:_[\da-f]+)*\b|(?:\b\d+(?:_\d+)*\.?(?:\d+(?:_\d+)*)?|\B\.\d+)(?:e[+-]?\d+)?/i,
n =
    /<?=>|\?\?=?|\.{3}|\??->|[!=]=?=?|::|\*\*=?|--|\+\+|&&|\|\||<<|>>|[?~]|[/^|%*&<>.+-]=?/,
s = /[{}\[\](),:;]/;
e.languages.php = {
delimiter: {
    pattern: /\?>$|^<\?(?:php(?=\s)|=)?/i,
    alias: "important",
},
comment: a,
variable: /\$+(?:\w+\b|(?=\{))/,
package: {
    pattern:
        /(namespace\s+|use\s+(?:function\s+)?)(?:\\?\b[a-z_]\w*)+\b(?!\\)/i,
    lookbehind: !0,
    inside: { punctuation: /\\/ },
},
"class-name-definition": {
    pattern:
        /(\b(?:class|enum|interface|trait)\s+)\b[a-z_]\w*(?!\\)\b/i,
    lookbehind: !0,
    alias: "class-name",
},
"function-definition": {
    pattern: /(\bfunction\s+)[a-z_]\w*(?=\s*\()/i,
    lookbehind: !0,
    alias: "function",
},
keyword: [
    {
        pattern:
            /(\(\s*)\b(?:array|bool|boolean|float|int|integer|object|string)\b(?=\s*\))/i,
        alias: "type-casting",
        greedy: !0,
        lookbehind: !0,
    },
    {
        pattern:
            /([(,?]\s*)\b(?:array(?!\s*\()|bool|callable|(?:false|null)(?=\s*\|)|float|int|iterable|mixed|object|self|static|string)\b(?=\s*\$)/i,
        alias: "type-hint",
        greedy: !0,
        lookbehind: !0,
    },
    {
        pattern:
            /(\)\s*:\s*(?:\?\s*)?)\b(?:array(?!\s*\()|bool|callable|(?:false|null)(?=\s*\|)|float|int|iterable|mixed|never|object|self|static|string|void)\b/i,
        alias: "return-type",
        greedy: !0,
        lookbehind: !0,
    },
    {
        pattern:
            /\b(?:array(?!\s*\()|bool|float|int|iterable|mixed|object|string|void)\b/i,
        alias: "type-declaration",
        greedy: !0,
    },
    {
        pattern: /(\|\s*)(?:false|null)\b|\b(?:false|null)(?=\s*\|)/i,
        alias: "type-declaration",
        greedy: !0,
        lookbehind: !0,
    },
    {
        pattern: /\b(?:parent|self|static)(?=\s*::)/i,
        alias: "static-context",
        greedy: !0,
    },
    { pattern: /(\byield\s+)from\b/i, lookbehind: !0 },
    /\bclass\b/i,
    {
        pattern:
            /((?:^|[^\s>:]|(?:^|[^-])>|(?:^|[^:]):)\s*)\b(?:abstract|and|array|as|break|callable|case|catch|clone|const|continue|declare|default|die|do|echo|else|elseif|empty|enddeclare|endfor|endforeach|endif|endswitch|endwhile|enum|eval|exit|extends|final|finally|fn|for|foreach|function|global|goto|if|implements|include|include_once|instanceof|insteadof|interface|isset|list|match|namespace|never|new|or|parent|print|private|protected|public|readonly|require|require_once|return|self|static|switch|throw|trait|try|unset|use|var|while|xor|yield|__halt_compiler)\b/i,
        lookbehind: !0,
    },
],
"argument-name": {
    pattern: /([(,]\s*)\b[a-z_]\w*(?=\s*:(?!:))/i,
    lookbehind: !0,
},
"class-name": [
    {
        pattern:
            /(\b(?:extends|implements|instanceof|new(?!\s+self|\s+static))\s+|\bcatch\s*\()\b[a-z_]\w*(?!\\)\b/i,
        greedy: !0,
        lookbehind: !0,
    },
    {
        pattern: /(\|\s*)\b[a-z_]\w*(?!\\)\b/i,
        greedy: !0,
        lookbehind: !0,
    },
    { pattern: /\b[a-z_]\w*(?!\\)\b(?=\s*\|)/i, greedy: !0 },
    {
        pattern: /(\|\s*)(?:\\?\b[a-z_]\w*)+\b/i,
        alias: "class-name-fully-qualified",
        greedy: !0,
        lookbehind: !0,
        inside: { punctuation: /\\/ },
    },
    {
        pattern: /(?:\\?\b[a-z_]\w*)+\b(?=\s*\|)/i,
        alias: "class-name-fully-qualified",
        greedy: !0,
        inside: { punctuation: /\\/ },
    },
    {
        pattern:
            /(\b(?:extends|implements|instanceof|new(?!\s+self\b|\s+static\b))\s+|\bcatch\s*\()(?:\\?\b[a-z_]\w*)+\b(?!\\)/i,
        alias: "class-name-fully-qualified",
        greedy: !0,
        lookbehind: !0,
        inside: { punctuation: /\\/ },
    },
    {
        pattern: /\b[a-z_]\w*(?=\s*\$)/i,
        alias: "type-declaration",
        greedy: !0,
    },
    {
        pattern: /(?:\\?\b[a-z_]\w*)+(?=\s*\$)/i,
        alias: ["class-name-fully-qualified", "type-declaration"],
        greedy: !0,
        inside: { punctuation: /\\/ },
    },
    {
        pattern: /\b[a-z_]\w*(?=\s*::)/i,
        alias: "static-context",
        greedy: !0,
    },
    {
        pattern: /(?:\\?\b[a-z_]\w*)+(?=\s*::)/i,
        alias: ["class-name-fully-qualified", "static-context"],
        greedy: !0,
        inside: { punctuation: /\\/ },
    },
    {
        pattern: /([(,?]\s*)[a-z_]\w*(?=\s*\$)/i,
        alias: "type-hint",
        greedy: !0,
        lookbehind: !0,
    },
    {
        pattern: /([(,?]\s*)(?:\\?\b[a-z_]\w*)+(?=\s*\$)/i,
        alias: ["class-name-fully-qualified", "type-hint"],
        greedy: !0,
        lookbehind: !0,
        inside: { punctuation: /\\/ },
    },
    {
        pattern: /(\)\s*:\s*(?:\?\s*)?)\b[a-z_]\w*(?!\\)\b/i,
        alias: "return-type",
        greedy: !0,
        lookbehind: !0,
    },
    {
        pattern: /(\)\s*:\s*(?:\?\s*)?)(?:\\?\b[a-z_]\w*)+\b(?!\\)/i,
        alias: ["class-name-fully-qualified", "return-type"],
        greedy: !0,
        lookbehind: !0,
        inside: { punctuation: /\\/ },
    },
],
constant: t,
function: {
    pattern: /(^|[^\\\w])\\?[a-z_](?:[\w\\]*\w)?(?=\s*\()/i,
    lookbehind: !0,
    inside: { punctuation: /\\/ },
},
property: { pattern: /(->\s*)\w+/, lookbehind: !0 },
number: i,
operator: n,
punctuation: s,
};
var l = {
    pattern:
        /\{\$(?:\{(?:\{[^{}]+\}|[^{}]+)\}|[^{}])+\}|(^|[^\\{])\$+(?:\w+(?:\[[^\r\n\[\]]+\]|->\w+)?)/,
    lookbehind: !0,
    inside: e.languages.php,
},
r = [
    {
        pattern: /<<<'([^']+)'[\r\n](?:.*[\r\n])*?\1;/,
        alias: "nowdoc-string",
        greedy: !0,
        inside: {
            delimiter: {
                pattern: /^<<<'[^']+'|[a-z_]\w*;$/i,
                alias: "symbol",
                inside: { punctuation: /^<<<'?|[';]$/ },
            },
        },
    },
    {
        pattern:
            /<<<(?:"([^"]+)"[\r\n](?:.*[\r\n])*?\1;|([a-z_]\w*)[\r\n](?:.*[\r\n])*?\2;)/i,
        alias: "heredoc-string",
        greedy: !0,
        inside: {
            delimiter: {
                pattern: /^<<<(?:"[^"]+"|[a-z_]\w*)|[a-z_]\w*;$/i,
                alias: "symbol",
                inside: { punctuation: /^<<<"?|[";]$/ },
            },
            interpolation: l,
        },
    },
    {
        pattern: /`(?:\\[\s\S]|[^\\`])*`/,
        alias: "backtick-quoted-string",
        greedy: !0,
    },
    {
        pattern: /'(?:\\[\s\S]|[^\\'])*'/,
        alias: "single-quoted-string",
        greedy: !0,
    },
    {
        pattern: /"(?:\\[\s\S]|[^\\"])*"/,
        alias: "double-quoted-string",
        greedy: !0,
        inside: { interpolation: l },
    },
];
e.languages.insertBefore("php", "variable", {
string: r,
attribute: {
    pattern:
        /#\[(?:[^"'\/#]|\/(?![*/])|\/\/.*$|#(?!\[).*$|\/\*(?:[^*]|\*(?!\/))*\*\/|"(?:\\[\s\S]|[^\\"])*"|'(?:\\[\s\S]|[^\\'])*')+\](?=\s*[a-z$#])/im,
    greedy: !0,
    inside: {
        "attribute-content": {
            pattern: /^(#\[)[\s\S]+(?=\]$)/,
            lookbehind: !0,
            inside: {
                comment: a,
                string: r,
                "attribute-class-name": [
                    {
                        pattern: /([^:]|^)\b[a-z_]\w*(?!\\)\b/i,
                        alias: "class-name",
                        greedy: !0,
                        lookbehind: !0,
                    },
                    {
                        pattern: /([^:]|^)(?:\\?\b[a-z_]\w*)+/i,
                        alias: [
                            "class-name",
                            "class-name-fully-qualified",
                        ],
                        greedy: !0,
                        lookbehind: !0,
                        inside: { punctuation: /\\/ },
                    },
                ],
                constant: t,
                number: i,
                operator: n,
                punctuation: s,
            },
        },
        delimiter: { pattern: /^#\[|\]$/, alias: "punctuation" },
    },
},
}),
e.hooks.add("before-tokenize", function (a) {
    /<\?/.test(a.code) &&
        e.languages["markup-templating"].buildPlaceholders(
            a,
            "php",
            /<\?(?:[^"'/#]|\/(?![*/])|("|')(?:\\[\s\S]|(?!\1)[^\\])*\1|(?:\/\/|#(?!\[))(?:[^?\n\r]|\?(?!>))*(?=$|\?>|[\r\n])|#\[|\/\*(?:[^*]|\*(?!\/))*(?:\*\/|$))*?(?:\?>|$)/g
        );
}),
e.hooks.add("after-tokenize", function (a) {
    e.languages["markup-templating"].tokenizePlaceholders(a, "php");
});
})(Prism);
!(function (e) {
var i = (e.languages.powershell = {
comment: [
    { pattern: /(^|[^`])<#[\s\S]*?#>/, lookbehind: !0 },
    { pattern: /(^|[^`])#.*/, lookbehind: !0 },
],
string: [
    { pattern: /"(?:`[\s\S]|[^`"])*"/, greedy: !0, inside: null },
    { pattern: /'(?:[^']|'')*'/, greedy: !0 },
],
namespace: /\[[a-z](?:\[(?:\[[^\]]*\]|[^\[\]])*\]|[^\[\]])*\]/i,
boolean: /\$(?:false|true)\b/i,
variable: /\$\w+\b/,
function: [
    /\b(?:Add|Approve|Assert|Backup|Block|Checkpoint|Clear|Close|Compare|Complete|Compress|Confirm|Connect|Convert|ConvertFrom|ConvertTo|Copy|Debug|Deny|Disable|Disconnect|Dismount|Edit|Enable|Enter|Exit|Expand|Export|Find|ForEach|Format|Get|Grant|Group|Hide|Import|Initialize|Install|Invoke|Join|Limit|Lock|Measure|Merge|Move|New|Open|Optimize|Out|Ping|Pop|Protect|Publish|Push|Read|Receive|Redo|Register|Remove|Rename|Repair|Request|Reset|Resize|Resolve|Restart|Restore|Resume|Revoke|Save|Search|Select|Send|Set|Show|Skip|Sort|Split|Start|Step|Stop|Submit|Suspend|Switch|Sync|Tee|Test|Trace|Unblock|Undo|Uninstall|Unlock|Unprotect|Unpublish|Unregister|Update|Use|Wait|Watch|Where|Write)-[a-z]+\b/i,
    /\b(?:ac|cat|chdir|clc|cli|clp|clv|compare|copy|cp|cpi|cpp|cvpa|dbp|del|diff|dir|ebp|echo|epal|epcsv|epsn|erase|fc|fl|ft|fw|gal|gbp|gc|gci|gcs|gdr|gi|gl|gm|gp|gps|group|gsv|gu|gv|gwmi|iex|ii|ipal|ipcsv|ipsn|irm|iwmi|iwr|kill|lp|ls|measure|mi|mount|move|mp|mv|nal|ndr|ni|nv|ogv|popd|ps|pushd|pwd|rbp|rd|rdr|ren|ri|rm|rmdir|rni|rnp|rp|rv|rvpa|rwmi|sal|saps|sasv|sbp|sc|select|set|shcm|si|sl|sleep|sls|sort|sp|spps|spsv|start|sv|swmi|tee|trcm|type|write)\b/i,
],
keyword:
    /\b(?:Begin|Break|Catch|Class|Continue|Data|Define|Do|DynamicParam|Else|ElseIf|End|Exit|Filter|Finally|For|ForEach|From|Function|If|InlineScript|Parallel|Param|Process|Return|Sequence|Switch|Throw|Trap|Try|Until|Using|Var|While|Workflow)\b/i,
operator: {
    pattern:
        /(^|\W)(?:!|-(?:b?(?:and|x?or)|as|(?:Not)?(?:Contains|In|Like|Match)|eq|ge|gt|is(?:Not)?|Join|le|lt|ne|not|Replace|sh[lr])\b|-[-=]?|\+[+=]?|[*\/%]=?)/i,
    lookbehind: !0,
},
punctuation: /[|{}[\];(),.]/,
});
i.string[0].inside = {
function: {
    pattern: /(^|[^`])\$\((?:\$\([^\r\n()]*\)|(?!\$\()[^\r\n)])*\)/,
    lookbehind: !0,
    inside: i,
},
boolean: i.boolean,
variable: i.variable,
};
})(Prism);
!(function (t) {
var n = t.util.clone(t.languages.javascript),
e = "(?:\\{<S>*\\.{3}(?:[^{}]|<BRACES>)*\\})";
function a(t, n) {
return (
    (t = t
        .replace(/<S>/g, function () {
            return "(?:\\s|//.*(?!.)|/\\*(?:[^*]|\\*(?!/))\\*/)";
        })
        .replace(/<BRACES>/g, function () {
            return "(?:\\{(?:\\{(?:\\{[^{}]*\\}|[^{}])*\\}|[^{}])*\\})";
        })
        .replace(/<SPREAD>/g, function () {
            return e;
        })),
    RegExp(t, n)
);
}
(e = a(e).source),
(t.languages.jsx = t.languages.extend("markup", n)),
(t.languages.jsx.tag.pattern = a(
    "</?(?:[\\w.:-]+(?:<S>+(?:[\\w.:$-]+(?:=(?:\"(?:\\\\[^]|[^\\\\\"])*\"|'(?:\\\\[^]|[^\\\\'])*'|[^\\s{'\"/>=]+|<BRACES>))?|<SPREAD>))*<S>*/?)?>"
)),
(t.languages.jsx.tag.inside.tag.pattern = /^<\/?[^\s>\/]*/),
(t.languages.jsx.tag.inside["attr-value"].pattern =
    /=(?!\{)(?:"(?:\\[\s\S]|[^\\"])*"|'(?:\\[\s\S]|[^\\'])*'|[^\s'">]+)/),
(t.languages.jsx.tag.inside.tag.inside["class-name"] =
    /^[A-Z]\w*(?:\.[A-Z]\w*)*$/),
(t.languages.jsx.tag.inside.comment = n.comment),
t.languages.insertBefore(
    "inside",
    "attr-name",
    { spread: { pattern: a("<SPREAD>"), inside: t.languages.jsx } },
    t.languages.jsx.tag
),
t.languages.insertBefore(
    "inside",
    "special-attr",
    {
        script: {
            pattern: a("=<BRACES>"),
            alias: "language-javascript",
            inside: {
                "script-punctuation": {
                    pattern: /^=(?=\{)/,
                    alias: "punctuation",
                },
                rest: t.languages.jsx,
            },
        },
    },
    t.languages.jsx.tag
);
var s = function (t) {
    return t
        ? "string" == typeof t
            ? t
            : "string" == typeof t.content
            ? t.content
            : t.content.map(s).join("")
        : "";
},
g = function (n) {
    for (var e = [], a = 0; a < n.length; a++) {
        var o = n[a],
            i = !1;
        if (
            ("string" != typeof o &&
                ("tag" === o.type &&
                o.content[0] &&
                "tag" === o.content[0].type
                    ? "</" === o.content[0].content[0].content
                        ? e.length > 0 &&
                          e[e.length - 1].tagName ===
                              s(o.content[0].content[1]) &&
                          e.pop()
                        : "/>" ===
                              o.content[o.content.length - 1].content ||
                          e.push({
                              tagName: s(o.content[0].content[1]),
                              openedBraces: 0,
                          })
                    : e.length > 0 &&
                      "punctuation" === o.type &&
                      "{" === o.content
                    ? e[e.length - 1].openedBraces++
                    : e.length > 0 &&
                      e[e.length - 1].openedBraces > 0 &&
                      "punctuation" === o.type &&
                      "}" === o.content
                    ? e[e.length - 1].openedBraces--
                    : (i = !0)),
            (i || "string" == typeof o) &&
                e.length > 0 &&
                0 === e[e.length - 1].openedBraces)
        ) {
            var r = s(o);
            a < n.length - 1 &&
                ("string" == typeof n[a + 1] ||
                    "plain-text" === n[a + 1].type) &&
                ((r += s(n[a + 1])), n.splice(a + 1, 1)),
                a > 0 &&
                    ("string" == typeof n[a - 1] ||
                        "plain-text" === n[a - 1].type) &&
                    ((r = s(n[a - 1]) + r), n.splice(a - 1, 1), a--),
                (n[a] = new t.Token("plain-text", r, null, r));
        }
        o.content && "string" != typeof o.content && g(o.content);
    }
};
t.hooks.add("after-tokenize", function (t) {
("jsx" !== t.language && "tsx" !== t.language) || g(t.tokens);
});
})(Prism);
!(function (e) {
(e.languages.typescript = e.languages.extend("javascript", {
"class-name": {
    pattern:
        /(\b(?:class|extends|implements|instanceof|interface|new|type)\s+)(?!keyof\b)(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?:\s*<(?:[^<>]|<(?:[^<>]|<[^<>]*>)*>)*>)?/,
    lookbehind: !0,
    greedy: !0,
    inside: null,
},
builtin:
    /\b(?:Array|Function|Promise|any|boolean|console|never|number|string|symbol|unknown)\b/,
})),
e.languages.typescript.keyword.push(
    /\b(?:abstract|declare|is|keyof|readonly|require)\b/,
    /\b(?:asserts|infer|interface|module|namespace|type)\b(?=\s*(?:[{_$a-zA-Z\xA0-\uFFFF]|$))/,
    /\btype\b(?=\s*(?:[\{*]|$))/
),
delete e.languages.typescript.parameter,
delete e.languages.typescript["literal-property"];
var s = e.languages.extend("typescript", {});
delete s["class-name"],
(e.languages.typescript["class-name"].inside = s),
e.languages.insertBefore("typescript", "function", {
    decorator: {
        pattern: /@[$\w\xA0-\uFFFF]+/,
        inside: {
            at: { pattern: /^@/, alias: "operator" },
            function: /^[\s\S]+/,
        },
    },
    "generic-function": {
        pattern:
            /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*<(?:[^<>]|<(?:[^<>]|<[^<>]*>)*>)*>(?=\s*\()/,
        greedy: !0,
        inside: {
            function:
                /^#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*/,
            generic: {
                pattern: /<[\s\S]+/,
                alias: "class-name",
                inside: s,
            },
        },
    },
}),
(e.languages.ts = e.languages.typescript);
})(Prism);
!(function (e) {
var a = e.util.clone(e.languages.typescript);
(e.languages.tsx = e.languages.extend("jsx", a)),
delete e.languages.tsx.parameter,
delete e.languages.tsx["literal-property"];
var t = e.languages.tsx.tag;
(t.pattern = RegExp(
"(^|[^\\w$]|(?=</))(?:" + t.pattern.source + ")",
t.pattern.flags
)),
(t.lookbehind = !0);
})(Prism);
!(function (a) {
var e = { pattern: /\\[\\(){}[\]^$+*?|.]/, alias: "escape" },
n =
    /\\(?:x[\da-fA-F]{2}|u[\da-fA-F]{4}|u\{[\da-fA-F]+\}|0[0-7]{0,2}|[123][0-7]{2}|c[a-zA-Z]|.)/,
t = "(?:[^\\\\-]|" + n.source + ")",
s = RegExp(t + "-" + t),
i = {
    pattern: /(<|')[^<>']+(?=[>']$)/,
    lookbehind: !0,
    alias: "variable",
};
a.languages.regex = {
"char-class": {
    pattern: /((?:^|[^\\])(?:\\\\)*)\[(?:[^\\\]]|\\[\s\S])*\]/,
    lookbehind: !0,
    inside: {
        "char-class-negation": {
            pattern: /(^\[)\^/,
            lookbehind: !0,
            alias: "operator",
        },
        "char-class-punctuation": {
            pattern: /^\[|\]$/,
            alias: "punctuation",
        },
        range: {
            pattern: s,
            inside: {
                escape: n,
                "range-punctuation": {
                    pattern: /-/,
                    alias: "operator",
                },
            },
        },
        "special-escape": e,
        "char-set": {
            pattern: /\\[wsd]|\\p\{[^{}]+\}/i,
            alias: "class-name",
        },
        escape: n,
    },
},
"special-escape": e,
"char-set": {
    pattern: /\.|\\[wsd]|\\p\{[^{}]+\}/i,
    alias: "class-name",
},
backreference: [
    { pattern: /\\(?![123][0-7]{2})[1-9]/, alias: "keyword" },
    {
        pattern: /\\k<[^<>']+>/,
        alias: "keyword",
        inside: { "group-name": i },
    },
],
anchor: { pattern: /[$^]|\\[ABbGZz]/, alias: "function" },
escape: n,
group: [
    {
        pattern:
            /\((?:\?(?:<[^<>']+>|'[^<>']+'|[>:]|<?[=!]|[idmnsuxU]+(?:-[idmnsuxU]+)?:?))?/,
        alias: "punctuation",
        inside: { "group-name": i },
    },
    { pattern: /\)/, alias: "punctuation" },
],
quantifier: {
    pattern: /(?:[+*?]|\{\d+(?:,\d*)?\})[?+]?/,
    alias: "number",
},
alternation: { pattern: /\|/, alias: "keyword" },
};
})(Prism);
Prism.languages.vim = {
string: /"(?:[^"\\\r\n]|\\.)*"|'(?:[^'\r\n]|'')*'/,
comment: /".*/,
function: /\b\w+(?=\()/,
keyword:
/\b(?:N|Next|P|Print|X|XMLent|XMLns|ab|abbreviate|abc|abclear|abo|aboveleft|al|all|ar|arga|argadd|argd|argdelete|argdo|arge|argedit|argg|argglobal|argl|arglocal|args|argu|argument|as|ascii|b|bN|bNext|ba|bad|badd|ball|bd|bdelete|be|bel|belowright|bf|bfirst|bl|blast|bm|bmodified|bn|bnext|bo|botright|bp|bprevious|br|brea|break|breaka|breakadd|breakd|breakdel|breakl|breaklist|brewind|bro|browse|bufdo|buffer|buffers|bun|bunload|bw|bwipeout|c|cN|cNext|cNfcNfile|ca|cabbrev|cabc|cabclear|cad|caddb|caddbuffer|caddexpr|caddf|caddfile|cal|call|cat|catch|cb|cbuffer|cc|ccl|cclose|cd|ce|center|cex|cexpr|cf|cfile|cfir|cfirst|cg|cgetb|cgetbuffer|cgete|cgetexpr|cgetfile|change|changes|chd|chdir|che|checkpath|checkt|checktime|cl|cla|clast|clist|clo|close|cmapc|cmapclear|cn|cnew|cnewer|cnext|cnf|cnfile|cnorea|cnoreabbrev|co|col|colder|colo|colorscheme|comc|comclear|comp|compiler|con|conf|confirm|continue|cope|copen|copy|cp|cpf|cpfile|cprevious|cq|cquit|cr|crewind|cu|cuna|cunabbrev|cunmap|cw|cwindow|d|debugg|debuggreedy|delc|delcommand|delete|delf|delfunction|delm|delmarks|di|diffg|diffget|diffoff|diffpatch|diffpu|diffput|diffsplit|diffthis|diffu|diffupdate|dig|digraphs|display|dj|djump|dl|dlist|dr|drop|ds|dsearch|dsp|dsplit|e|earlier|echoe|echoerr|echom|echomsg|echon|edit|el|else|elsei|elseif|em|emenu|en|endf|endfo|endfor|endfun|endfunction|endif|endt|endtry|endw|endwhile|ene|enew|ex|exi|exit|exu|exusage|f|file|files|filetype|fin|fina|finally|find|fini|finish|fir|first|fix|fixdel|fo|fold|foldc|foldclose|foldd|folddoc|folddoclosed|folddoopen|foldo|foldopen|for|fu|fun|function|go|goto|gr|grep|grepa|grepadd|h|ha|hardcopy|help|helpf|helpfind|helpg|helpgrep|helpt|helptags|hid|hide|his|history|ia|iabbrev|iabc|iabclear|if|ij|ijump|il|ilist|imapc|imapclear|in|inorea|inoreabbrev|isearch|isp|isplit|iu|iuna|iunabbrev|iunmap|j|join|ju|jumps|k|kee|keepalt|keepj|keepjumps|keepmarks|l|lN|lNext|lNf|lNfile|la|lad|laddb|laddbuffer|laddexpr|laddf|laddfile|lan|language|last|later|lb|lbuffer|lc|lcd|lch|lchdir|lcl|lclose|left|lefta|leftabove|let|lex|lexpr|lf|lfile|lfir|lfirst|lg|lgetb|lgetbuffer|lgete|lgetexpr|lgetfile|lgr|lgrep|lgrepa|lgrepadd|lh|lhelpgrep|list|ll|lla|llast|lli|llist|lm|lmak|lmake|lmap|lmapc|lmapclear|ln|lne|lnew|lnewer|lnext|lnf|lnfile|lnoremap|lo|loadview|loc|lockmarks|lockv|lockvar|lol|lolder|lop|lopen|lp|lpf|lpfile|lprevious|lr|lrewind|ls|lt|ltag|lu|lunmap|lv|lvimgrep|lvimgrepa|lvimgrepadd|lw|lwindow|m|ma|mak|make|mark|marks|mat|match|menut|menutranslate|mk|mkexrc|mks|mksession|mksp|mkspell|mkv|mkvie|mkview|mkvimrc|mod|mode|move|mz|mzf|mzfile|mzscheme|n|nbkey|new|next|nmapc|nmapclear|noh|nohlsearch|norea|noreabbrev|nu|number|nun|nunmap|o|omapc|omapclear|on|only|open|opt|options|ou|ounmap|p|pc|pclose|pe|ped|pedit|perl|perld|perldo|po|pop|popu|popup|pp|ppop|pre|preserve|prev|previous|print|prof|profd|profdel|profile|promptf|promptfind|promptr|promptrepl|ps|psearch|ptN|ptNext|pta|ptag|ptf|ptfirst|ptj|ptjump|ptl|ptlast|ptn|ptnext|ptp|ptprevious|ptr|ptrewind|pts|ptselect|pu|put|pw|pwd|py|pyf|pyfile|python|q|qa|qall|quit|quita|quitall|r|read|rec|recover|red|redi|redir|redo|redr|redraw|redraws|redrawstatus|reg|registers|res|resize|ret|retab|retu|return|rew|rewind|ri|right|rightb|rightbelow|ru|rub|ruby|rubyd|rubydo|rubyf|rubyfile|runtime|rv|rviminfo|sN|sNext|sa|sal|sall|san|sandbox|sargument|sav|saveas|sb|sbN|sbNext|sba|sball|sbf|sbfirst|sbl|sblast|sbm|sbmodified|sbn|sbnext|sbp|sbprevious|sbr|sbrewind|sbuffer|scrip|scripte|scriptencoding|scriptnames|se|set|setf|setfiletype|setg|setglobal|setl|setlocal|sf|sfind|sfir|sfirst|sh|shell|sign|sil|silent|sim|simalt|sl|sla|slast|sleep|sm|smagic|smap|smapc|smapclear|sme|smenu|sn|snext|sni|sniff|sno|snomagic|snor|snoremap|snoreme|snoremenu|so|sor|sort|source|sp|spe|spelld|spelldump|spellgood|spelli|spellinfo|spellr|spellrepall|spellu|spellundo|spellw|spellwrong|split|spr|sprevious|sre|srewind|st|sta|stag|star|startg|startgreplace|startinsert|startr|startreplace|stj|stjump|stop|stopi|stopinsert|sts|stselect|sun|sunhide|sunm|sunmap|sus|suspend|sv|sview|syncbind|t|tN|tNext|ta|tab|tabN|tabNext|tabc|tabclose|tabd|tabdo|tabe|tabedit|tabf|tabfind|tabfir|tabfirst|tabl|tablast|tabm|tabmove|tabn|tabnew|tabnext|tabo|tabonly|tabp|tabprevious|tabr|tabrewind|tabs|tag|tags|tc|tcl|tcld|tcldo|tclf|tclfile|te|tearoff|tf|tfirst|th|throw|tj|tjump|tl|tlast|tm|tmenu|tn|tnext|to|topleft|tp|tprevious|tr|trewind|try|ts|tselect|tu|tunmenu|u|una|unabbreviate|undo|undoj|undojoin|undol|undolist|unh|unhide|unlet|unlo|unlockvar|unm|unmap|up|update|ve|verb|verbose|version|vert|vertical|vi|vie|view|vim|vimgrep|vimgrepa|vimgrepadd|visual|viu|viusage|vmapc|vmapclear|vne|vnew|vs|vsplit|vu|vunmap|w|wN|wNext|wa|wall|wh|while|win|winc|wincmd|windo|winp|winpos|winsize|wn|wnext|wp|wprevious|wq|wqa|wqall|write|ws|wsverb|wv|wviminfo|x|xa|xall|xit|xm|xmap|xmapc|xmapclear|xme|xmenu|xn|xnoremap|xnoreme|xnoremenu|xu|xunmap|y|yank)\b/,
builtin:
/\b(?:acd|ai|akm|aleph|allowrevins|altkeymap|ambiwidth|ambw|anti|antialias|arab|arabic|arabicshape|ari|arshape|autochdir|autocmd|autoindent|autoread|autowrite|autowriteall|aw|awa|background|backspace|backup|backupcopy|backupdir|backupext|backupskip|balloondelay|ballooneval|balloonexpr|bdir|bdlay|beval|bex|bexpr|bg|bh|bin|binary|biosk|bioskey|bk|bkc|bomb|breakat|brk|browsedir|bs|bsdir|bsk|bt|bufhidden|buflisted|buftype|casemap|ccv|cdpath|cedit|cfu|ch|charconvert|ci|cin|cindent|cink|cinkeys|cino|cinoptions|cinw|cinwords|clipboard|cmdheight|cmdwinheight|cmp|cms|columns|com|comments|commentstring|compatible|complete|completefunc|completeopt|consk|conskey|copyindent|cot|cpo|cpoptions|cpt|cscopepathcomp|cscopeprg|cscopequickfix|cscopetag|cscopetagorder|cscopeverbose|cspc|csprg|csqf|cst|csto|csverb|cuc|cul|cursorcolumn|cursorline|cwh|debug|deco|def|define|delcombine|dex|dg|dict|dictionary|diff|diffexpr|diffopt|digraph|dip|dir|directory|dy|ea|ead|eadirection|eb|ed|edcompatible|ef|efm|ei|ek|enc|encoding|endofline|eol|ep|equalalways|equalprg|errorbells|errorfile|errorformat|esckeys|et|eventignore|expandtab|exrc|fcl|fcs|fdc|fde|fdi|fdl|fdls|fdm|fdn|fdo|fdt|fen|fenc|fencs|fex|ff|ffs|fileencoding|fileencodings|fileformat|fileformats|fillchars|fk|fkmap|flp|fml|fmr|foldcolumn|foldenable|foldexpr|foldignore|foldlevel|foldlevelstart|foldmarker|foldmethod|foldminlines|foldnestmax|foldtext|formatexpr|formatlistpat|formatoptions|formatprg|fp|fs|fsync|ft|gcr|gd|gdefault|gfm|gfn|gfs|gfw|ghr|gp|grepformat|grepprg|gtl|gtt|guicursor|guifont|guifontset|guifontwide|guiheadroom|guioptions|guipty|guitablabel|guitabtooltip|helpfile|helpheight|helplang|hf|hh|hi|hidden|highlight|hk|hkmap|hkmapp|hkp|hl|hlg|hls|hlsearch|ic|icon|iconstring|ignorecase|im|imactivatekey|imak|imc|imcmdline|imd|imdisable|imi|iminsert|ims|imsearch|inc|include|includeexpr|incsearch|inde|indentexpr|indentkeys|indk|inex|inf|infercase|insertmode|invacd|invai|invakm|invallowrevins|invaltkeymap|invanti|invantialias|invar|invarab|invarabic|invarabicshape|invari|invarshape|invautochdir|invautoindent|invautoread|invautowrite|invautowriteall|invaw|invawa|invbackup|invballooneval|invbeval|invbin|invbinary|invbiosk|invbioskey|invbk|invbl|invbomb|invbuflisted|invcf|invci|invcin|invcindent|invcompatible|invconfirm|invconsk|invconskey|invcopyindent|invcp|invcscopetag|invcscopeverbose|invcst|invcsverb|invcuc|invcul|invcursorcolumn|invcursorline|invdeco|invdelcombine|invdg|invdiff|invdigraph|invdisable|invea|inveb|inved|invedcompatible|invek|invendofline|inveol|invequalalways|inverrorbells|invesckeys|invet|invex|invexpandtab|invexrc|invfen|invfk|invfkmap|invfoldenable|invgd|invgdefault|invguipty|invhid|invhidden|invhk|invhkmap|invhkmapp|invhkp|invhls|invhlsearch|invic|invicon|invignorecase|invim|invimc|invimcmdline|invimd|invincsearch|invinf|invinfercase|invinsertmode|invis|invjoinspaces|invjs|invlazyredraw|invlbr|invlinebreak|invlisp|invlist|invloadplugins|invlpl|invlz|invma|invmacatsui|invmagic|invmh|invml|invmod|invmodeline|invmodifiable|invmodified|invmore|invmousef|invmousefocus|invmousehide|invnu|invnumber|invodev|invopendevice|invpaste|invpi|invpreserveindent|invpreviewwindow|invprompt|invpvw|invreadonly|invremap|invrestorescreen|invrevins|invri|invrightleft|invrightleftcmd|invrl|invrlc|invro|invrs|invru|invruler|invsb|invsc|invscb|invscrollbind|invscs|invsecure|invsft|invshellslash|invshelltemp|invshiftround|invshortname|invshowcmd|invshowfulltag|invshowmatch|invshowmode|invsi|invsm|invsmartcase|invsmartindent|invsmarttab|invsmd|invsn|invsol|invspell|invsplitbelow|invsplitright|invspr|invsr|invssl|invsta|invstartofline|invstmp|invswapfile|invswf|invta|invtagbsearch|invtagrelative|invtagstack|invtbi|invtbidi|invtbs|invtermbidi|invterse|invtextauto|invtextmode|invtf|invtgst|invtildeop|invtimeout|invtitle|invto|invtop|invtr|invttimeout|invttybuiltin|invttyfast|invtx|invvb|invvisualbell|invwa|invwarn|invwb|invweirdinvert|invwfh|invwfw|invwildmenu|invwinfixheight|invwinfixwidth|invwiv|invwmnu|invwrap|invwrapscan|invwrite|invwriteany|invwritebackup|invws|isf|isfname|isi|isident|isk|iskeyword|isprint|joinspaces|js|key|keymap|keymodel|keywordprg|km|kmp|kp|langmap|langmenu|laststatus|lazyredraw|lbr|lcs|linebreak|lines|linespace|lisp|lispwords|listchars|loadplugins|lpl|lsp|lz|macatsui|magic|makeef|makeprg|matchpairs|matchtime|maxcombine|maxfuncdepth|maxmapdepth|maxmem|maxmempattern|maxmemtot|mco|mef|menuitems|mfd|mh|mis|mkspellmem|ml|mls|mm|mmd|mmp|mmt|modeline|modelines|modifiable|modified|more|mouse|mousef|mousefocus|mousehide|mousem|mousemodel|mouses|mouseshape|mouset|mousetime|mp|mps|msm|mzq|mzquantum|nf|noacd|noai|noakm|noallowrevins|noaltkeymap|noanti|noantialias|noar|noarab|noarabic|noarabicshape|noari|noarshape|noautochdir|noautoindent|noautoread|noautowrite|noautowriteall|noaw|noawa|nobackup|noballooneval|nobeval|nobin|nobinary|nobiosk|nobioskey|nobk|nobl|nobomb|nobuflisted|nocf|noci|nocin|nocindent|nocompatible|noconfirm|noconsk|noconskey|nocopyindent|nocp|nocscopetag|nocscopeverbose|nocst|nocsverb|nocuc|nocul|nocursorcolumn|nocursorline|nodeco|nodelcombine|nodg|nodiff|nodigraph|nodisable|noea|noeb|noed|noedcompatible|noek|noendofline|noeol|noequalalways|noerrorbells|noesckeys|noet|noex|noexpandtab|noexrc|nofen|nofk|nofkmap|nofoldenable|nogd|nogdefault|noguipty|nohid|nohidden|nohk|nohkmap|nohkmapp|nohkp|nohls|noic|noicon|noignorecase|noim|noimc|noimcmdline|noimd|noincsearch|noinf|noinfercase|noinsertmode|nois|nojoinspaces|nojs|nolazyredraw|nolbr|nolinebreak|nolisp|nolist|noloadplugins|nolpl|nolz|noma|nomacatsui|nomagic|nomh|noml|nomod|nomodeline|nomodifiable|nomodified|nomore|nomousef|nomousefocus|nomousehide|nonu|nonumber|noodev|noopendevice|nopaste|nopi|nopreserveindent|nopreviewwindow|noprompt|nopvw|noreadonly|noremap|norestorescreen|norevins|nori|norightleft|norightleftcmd|norl|norlc|noro|nors|noru|noruler|nosb|nosc|noscb|noscrollbind|noscs|nosecure|nosft|noshellslash|noshelltemp|noshiftround|noshortname|noshowcmd|noshowfulltag|noshowmatch|noshowmode|nosi|nosm|nosmartcase|nosmartindent|nosmarttab|nosmd|nosn|nosol|nospell|nosplitbelow|nosplitright|nospr|nosr|nossl|nosta|nostartofline|nostmp|noswapfile|noswf|nota|notagbsearch|notagrelative|notagstack|notbi|notbidi|notbs|notermbidi|noterse|notextauto|notextmode|notf|notgst|notildeop|notimeout|notitle|noto|notop|notr|nottimeout|nottybuiltin|nottyfast|notx|novb|novisualbell|nowa|nowarn|nowb|noweirdinvert|nowfh|nowfw|nowildmenu|nowinfixheight|nowinfixwidth|nowiv|nowmnu|nowrap|nowrapscan|nowrite|nowriteany|nowritebackup|nows|nrformats|numberwidth|nuw|odev|oft|ofu|omnifunc|opendevice|operatorfunc|opfunc|osfiletype|pa|para|paragraphs|paste|pastetoggle|patchexpr|patchmode|path|pdev|penc|pex|pexpr|pfn|ph|pheader|pi|pm|pmbcs|pmbfn|popt|preserveindent|previewheight|previewwindow|printdevice|printencoding|printexpr|printfont|printheader|printmbcharset|printmbfont|printoptions|prompt|pt|pumheight|pvh|pvw|qe|quoteescape|readonly|remap|report|restorescreen|revins|rightleft|rightleftcmd|rl|rlc|ro|rs|rtp|ruf|ruler|rulerformat|runtimepath|sbo|sc|scb|scr|scroll|scrollbind|scrolljump|scrolloff|scrollopt|scs|sect|sections|secure|sel|selection|selectmode|sessionoptions|sft|shcf|shellcmdflag|shellpipe|shellquote|shellredir|shellslash|shelltemp|shelltype|shellxquote|shiftround|shiftwidth|shm|shortmess|shortname|showbreak|showcmd|showfulltag|showmatch|showmode|showtabline|shq|si|sidescroll|sidescrolloff|siso|sj|slm|smartcase|smartindent|smarttab|smc|smd|softtabstop|sol|spc|spell|spellcapcheck|spellfile|spelllang|spellsuggest|spf|spl|splitbelow|splitright|sps|sr|srr|ss|ssl|ssop|stal|startofline|statusline|stl|stmp|su|sua|suffixes|suffixesadd|sw|swapfile|swapsync|swb|swf|switchbuf|sws|sxq|syn|synmaxcol|syntax|t_AB|t_AF|t_AL|t_CS|t_CV|t_Ce|t_Co|t_Cs|t_DL|t_EI|t_F1|t_F2|t_F3|t_F4|t_F5|t_F6|t_F7|t_F8|t_F9|t_IE|t_IS|t_K1|t_K3|t_K4|t_K5|t_K6|t_K7|t_K8|t_K9|t_KA|t_KB|t_KC|t_KD|t_KE|t_KF|t_KG|t_KH|t_KI|t_KJ|t_KK|t_KL|t_RI|t_RV|t_SI|t_Sb|t_Sf|t_WP|t_WS|t_ZH|t_ZR|t_al|t_bc|t_cd|t_ce|t_cl|t_cm|t_cs|t_da|t_db|t_dl|t_fs|t_k1|t_k2|t_k3|t_k4|t_k5|t_k6|t_k7|t_k8|t_k9|t_kB|t_kD|t_kI|t_kN|t_kP|t_kb|t_kd|t_ke|t_kh|t_kl|t_kr|t_ks|t_ku|t_le|t_mb|t_md|t_me|t_mr|t_ms|t_nd|t_op|t_se|t_so|t_sr|t_te|t_ti|t_ts|t_ue|t_us|t_ut|t_vb|t_ve|t_vi|t_vs|t_xs|tabline|tabpagemax|tabstop|tagbsearch|taglength|tagrelative|tagstack|tal|tb|tbi|tbidi|tbis|tbs|tenc|term|termbidi|termencoding|terse|textauto|textmode|textwidth|tgst|thesaurus|tildeop|timeout|timeoutlen|title|titlelen|titleold|titlestring|toolbar|toolbariconsize|top|tpm|tsl|tsr|ttimeout|ttimeoutlen|ttm|tty|ttybuiltin|ttyfast|ttym|ttymouse|ttyscroll|ttytype|tw|tx|uc|ul|undolevels|updatecount|updatetime|ut|vb|vbs|vdir|verbosefile|vfile|viewdir|viewoptions|viminfo|virtualedit|visualbell|vop|wak|warn|wb|wc|wcm|wd|weirdinvert|wfh|wfw|whichwrap|wi|wig|wildchar|wildcharm|wildignore|wildmenu|wildmode|wildoptions|wim|winaltkeys|window|winfixheight|winfixwidth|winheight|winminheight|winminwidth|winwidth|wiv|wiw|wm|wmh|wmnu|wmw|wop|wrap|wrapmargin|wrapscan|writeany|writebackup|writedelay|ww)\b/,
number: /\b(?:0x[\da-f]+|\d+(?:\.\d+)?)\b/i,
operator:
/\|\||&&|[-+.]=?|[=!](?:[=~][#?]?)?|[<>]=?[#?]?|[*\/%?]|\b(?:is(?:not)?)\b/,
punctuation: /[{}[\](),;:]/,
};
(Prism.languages["visual-basic"] = {
comment: {
pattern: /(?:['‘’]|REM\b)(?:[^\r\n_]|_(?:\r\n?|\n)?)*/i,
inside: { keyword: /^REM/i },
},
directive: {
pattern:
    /#(?:Const|Else|ElseIf|End|ExternalChecksum|ExternalSource|If|Region)(?:\b_[ \t]*(?:\r\n?|\n)|.)+/i,
alias: "property",
greedy: !0,
},
string: { pattern: /\$?["“”](?:["“”]{2}|[^"“”])*["“”]C?/i, greedy: !0 },
date: {
pattern:
    /#[ \t]*(?:\d+([/-])\d+\1\d+(?:[ \t]+(?:\d+[ \t]*(?:AM|PM)|\d+:\d+(?::\d+)?(?:[ \t]*(?:AM|PM))?))?|\d+[ \t]*(?:AM|PM)|\d+:\d+(?::\d+)?(?:[ \t]*(?:AM|PM))?)[ \t]*#/i,
alias: "number",
},
number: /(?:(?:\b\d+(?:\.\d+)?|\.\d+)(?:E[+-]?\d+)?|&[HO][\dA-F]+)(?:[FRD]|U?[ILS])?/i,
boolean: /\b(?:False|Nothing|True)\b/i,
keyword:
/\b(?:AddHandler|AddressOf|Alias|And(?:Also)?|As|Boolean|ByRef|Byte|ByVal|Call|Case|Catch|C(?:Bool|Byte|Char|Date|Dbl|Dec|Int|Lng|Obj|SByte|Short|Sng|Str|Type|UInt|ULng|UShort)|Char|Class|Const|Continue|Currency|Date|Decimal|Declare|Default|Delegate|Dim|DirectCast|Do|Double|Each|Else(?:If)?|End(?:If)?|Enum|Erase|Error|Event|Exit|Finally|For|Friend|Function|Get(?:Type|XMLNamespace)?|Global|GoSub|GoTo|Handles|If|Implements|Imports|In|Inherits|Integer|Interface|Is|IsNot|Let|Lib|Like|Long|Loop|Me|Mod|Module|Must(?:Inherit|Override)|My(?:Base|Class)|Namespace|Narrowing|New|Next|Not(?:Inheritable|Overridable)?|Object|Of|On|Operator|Option(?:al)?|Or(?:Else)?|Out|Overloads|Overridable|Overrides|ParamArray|Partial|Private|Property|Protected|Public|RaiseEvent|ReadOnly|ReDim|RemoveHandler|Resume|Return|SByte|Select|Set|Shadows|Shared|short|Single|Static|Step|Stop|String|Structure|Sub|SyncLock|Then|Throw|To|Try|TryCast|Type|TypeOf|U(?:Integer|Long|Short)|Until|Using|Variant|Wend|When|While|Widening|With(?:Events)?|WriteOnly|Xor)\b/i,
operator: /[+\-*/\\^<=>&#@$%!]|\b_(?=[ \t]*[\r\n])/,
punctuation: /[{}().,:?]/,
}),
(Prism.languages.vb = Prism.languages["visual-basic"]),
(Prism.languages.vba = Prism.languages["visual-basic"]);
!(function (e) {
var n = /[*&][^\s[\]{},]+/,
r =
    /!(?:<[\w\-%#;/?:@&=+$,.!~*'()[\]]+>|(?:[a-zA-Z\d-]*!)?[\w\-%#;/?:@&=+$.~*'()]+)?/,
t =
    "(?:" +
    r.source +
    "(?:[ \t]+" +
    n.source +
    ")?|" +
    n.source +
    "(?:[ \t]+" +
    r.source +
    ")?)",
a =
    "(?:[^\\s\\x00-\\x08\\x0e-\\x1f!\"#%&'*,\\-:>?@[\\]`{|}\\x7f-\\x84\\x86-\\x9f\\ud800-\\udfff\\ufffe\\uffff]|[?:-]<PLAIN>)(?:[ \t]*(?:(?![#:])<PLAIN>|:<PLAIN>))*".replace(
        /<PLAIN>/g,
        function () {
            return "[^\\s\\x00-\\x08\\x0e-\\x1f,[\\]{}\\x7f-\\x84\\x86-\\x9f\\ud800-\\udfff\\ufffe\\uffff]";
        }
    ),
d = "\"(?:[^\"\\\\\r\n]|\\\\.)*\"|'(?:[^'\\\\\r\n]|\\\\.)*'";
function o(e, n) {
n = (n || "").replace(/m/g, "") + "m";
var r =
    "([:\\-,[{]\\s*(?:\\s<<prop>>[ \t]+)?)(?:<<value>>)(?=[ \t]*(?:$|,|\\]|\\}|(?:[\r\n]\\s*)?#))"
        .replace(/<<prop>>/g, function () {
            return t;
        })
        .replace(/<<value>>/g, function () {
            return e;
        });
return RegExp(r, n);
}
(e.languages.yaml = {
scalar: {
    pattern: RegExp(
        "([\\-:]\\s*(?:\\s<<prop>>[ \t]+)?[|>])[ \t]*(?:((?:\r?\n|\r)[ \t]+)\\S[^\r\n]*(?:\\2[^\r\n]+)*)".replace(
            /<<prop>>/g,
            function () {
                return t;
            }
        )
    ),
    lookbehind: !0,
    alias: "string",
},
comment: /#.*/,
key: {
    pattern: RegExp(
        "((?:^|[:\\-,[{\r\n?])[ \t]*(?:<<prop>>[ \t]+)?)<<key>>(?=\\s*:\\s)"
            .replace(/<<prop>>/g, function () {
                return t;
            })
            .replace(/<<key>>/g, function () {
                return "(?:" + a + "|" + d + ")";
            })
    ),
    lookbehind: !0,
    greedy: !0,
    alias: "atrule",
},
directive: {
    pattern: /(^[ \t]*)%.+/m,
    lookbehind: !0,
    alias: "important",
},
datetime: {
    pattern: o(
        "\\d{4}-\\d\\d?-\\d\\d?(?:[tT]|[ \t]+)\\d\\d?:\\d{2}:\\d{2}(?:\\.\\d*)?(?:[ \t]*(?:Z|[-+]\\d\\d?(?::\\d{2})?))?|\\d{4}-\\d{2}-\\d{2}|\\d\\d?:\\d{2}(?::\\d{2}(?:\\.\\d*)?)?"
    ),
    lookbehind: !0,
    alias: "number",
},
boolean: {
    pattern: o("false|true", "i"),
    lookbehind: !0,
    alias: "important",
},
null: { pattern: o("null|~", "i"), lookbehind: !0, alias: "important" },
string: { pattern: o(d), lookbehind: !0, greedy: !0 },
number: {
    pattern: o(
        "[+-]?(?:0x[\\da-f]+|0o[0-7]+|(?:\\d+(?:\\.\\d*)?|\\.\\d+)(?:e[+-]?\\d+)?|\\.inf|\\.nan)",
        "i"
    ),
    lookbehind: !0,
},
tag: r,
important: n,
punctuation: /---|[:[\]{}\-,|>?]|\.\.\./,
}),
(e.languages.yml = e.languages.yaml);
})(Prism);

    }
  
  //==================================FINAL PRISM.JS=========================================//
    codeViewEach((e) => {
      if(e.getAttribute('visible') == ''){
        e.textContent = e.querySelector('.astcw-container pre code').textContent
      }
    })

    init(), prismjs()
  }
};const ast=astronaut;const astlibjs=astronaut


 