// Some small essentials. 
const id            = id          => document.getElementById(id);
const irandom_range = (min, max)  => Math.floor(Math.random() * (max - min) ) + min;
const url_slug      = text        => text.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');
const delay         = time        => new Promise(resolve => setTimeout(resolve, time));
const clamp         = (num, min, max) => Math.min(Math.max(num, min), max);

// A list of literals and functional generators for some reuseable html elements

const Elements = {
    sidebar_img:        '<img class="img-round" src="asset/img/phosphora.png">',

    sidebar_img_2:      `<img class="img-round" src="asset/img/fallshrubbie.png">`,

    back_button:        '<a class="back-button" onclick="Site.show_list()"> << Back to list << </a>',

    footer:             '<span class="footer"> Jonny Andino - bow682@gmail.com - (419)-577 3467 </span>',

    navigation:         () => {
                            id('nav-main').innerHTML += Elements.sidebar_img;
                            
                            Site.page.forEach(elem => {
                                let tblank = (elem.new_tab) ? 'target="_blank"' : '';
                                id("nav-main").innerHTML += `<a ${tblank} href="${elem.url}">${elem.name}</a>`
                            });
                        },
    
    contact:            () => {
                            id('nav-secondary').innerHTML = Elements.sidebar_img_2;
                            
                            Site.contact.forEach(elem => {
                              id("nav-secondary").innerHTML += 
                              `<div class="link-section">
                                  <a class="link-icon" target="_blank" href="${elem.url}">${elem.icon}</a>
                                  <span class="link-name">${elem.name}</span>
                               </div>`;
                            })
                        },                      
    article_nav:        article =>{
                            if (screen.width < 700) return;
                            let target  = id('nav-secondary');
                            let list    = article.querySelectorAll("h2,h3,h4,h5");
                        
                            target.innerHTML = `<h3>Article nav:</h3>`
                            list.forEach(elem => target.innerHTML += `<a href="#${elem.id}">${elem.innerText}</a>`);
                        },

    tags_list:          arr => {
                            let [str, mod, hash] = ['','',''];
                            arr.forEach(e => {
                              [mod, hash] = ['',''];
                              switch(e){
                                case 'html':        mod  = ' style="color: cyan;"';       break;
                                case 'css':         mod  = ' style="color: pink;"';       break;
                                case 'svelte':
                                case 'scss':        mod  = ' style="color: red;"';        break;
                                case 'javascript':  mod  = ' style="color: yellow;"';     break;
                                case 'react':       
                                case 'vue':         mod  = ' style="color: aquamarine;"'; break;
                                case 'gml':         mod  = ' style="color: green;"';      break;
                                case 'glsl':        mod  = ' style="color: gray;"';       break;
                                case 'firebase':   
                                case 'p5':          mod  = ' style="color: orange;"';     break;
                                default:            hash = '#';                           break;
                              }
                              str += `<a class="tag"${mod}>${hash}${e}</a>`;
                            });
                            return str;
                          },

    blog_list_item:     obj => { 
                            return `
                            <div class="list-item" id=${url_slug(obj.name)}>
                                <a class="list-title" onclick="Site.show_article('${obj.source}')">${obj.name}</a>
                                <div class="list-footer">
                                    <span class="list-date"> Posted: ${obj.posted}</span>
                                    <span class="list-tags">${(obj.tags)}</span>
                                </div>
                            </div>`;
                        },

    proj_list_item:     obj => { 
                            let path = "asset/md/proj/";
                            let name = url_slug(obj.name);
                            let content_id = name + '-content';
                            return `
                            <div class="list-item" id=${name}>
                                <a  class="list-title" onclick="Projects.open_post('${obj.name}')">
                                    ${obj.name}
                                    <span class="expand-icon" id=${name + '-icon'}>[+]</span>
                                </a>
                                <article class="proj-content" id=${content_id}>
                                    ${Site.fetch_markdown(path + obj.source, content_id)}
                                </article>
                                <div class="list-footer">
                                    <span class="list-date">${obj.posted}</span>
                                    <span class="list-tags">${Elements.tags_list(obj.tags)}</span>
                                </div>
                            </div>`;
                        }
}

//and since it's related to elements, our javascript hack for expanding and collapsing elements can go here
function collapse_section(element) {
    // get the height of the element's inner content, regardless of its actual size
    let section_height = element.scrollHeight;
    
    // temporarily disable all css transitions
    let element_transition = element.style.transition;
    element.style.transition = '';
    
    // on the next frame (as soon as the previous style change has taken effect),
    // explicitly set the element's height to its current pixel height, so we 
    // aren't transitioning out of 'auto'
    requestAnimationFrame(() => {
      element.style.height = section_height + 'px';
      element.style.transition = element_transition;
      
      // on the next frame (as soon as the previous style change has taken effect),
      // have the element transition to height: 0
      requestAnimationFrame(() => {
        element.style.height = 0 + 'px';
      });
    });
    
    // mark the section as "currently collapsed"
    element.setAttribute('data-opened', 'false');
}
  
function expand_section(element) {
    // get the height of the element's inner content, regardless of its actual size
    let section_height = element.scrollHeight;
    
    // have the element transition to the height of its inner content
    element.style.height = section_height + 'px';
  
    // when the next css transition finishes (which should be the one we just triggered)
    element.addEventListener('transitionend', (e) => {
      // remove this event listener so it only gets triggered once
      element.removeEventListener('transitionend', arguments.callee);
      
      //setting our height to the max after the animation finishes
      element.style.height = element.scrollHeight;
    });
    
    // mark the section as "currently not collapsed"
    element.setAttribute('data-opened', 'true');
}