// A list of literals and functional generators for some reuseable html elements

const Elements = {
    sidebar_img:        '<img class="img-round" src="asset/img/phosphora.png">',

    back_button:        '<a class="back-button" onclick="Site.show_list()"> << Back to list << </a>',

    blog_list_item:     (obj) => { 
                            return `
                            <div class="list-item" id=${url_slug(obj.name)}>
                                <a class="list-title" onclick="Site.show_article('${obj.source}')">${obj.name}</a>
                                <div class="list-footer">
                                    <span class="list-date"> Posted: ${obj.posted}</span>
                                    <span class="list-tags">${Site.parse_tags(obj.tags)}</span>
                                </div>
                            </div>`;
                        },

    proj_list_item:     (obj) => { 
                            let path = "asset/md/proj/";
                            let name = url_slug(obj.name);
                            let content_id = name + '-content';
                            return `
                            <div class="list-item" id=${name}>
                                <a class="list-title" onclick="Projects.open_post('${obj.name}')">${obj.name}</a>
                                <article class="proj-content" id=${content_id}>${Site.fetch_markdown(path + obj.source, content_id)}</article>
                                <div class="list-footer">
                                    <span class="list-date"> Posted: ${obj.posted}</span>
                                    <span class="list-tags">${Site.parse_tags(obj.tags)}</span>
                                </div>
                            </div>`;
                        }
}

//and since it's related to elements, our javascript hack for expanding and collapsing elements can go here
function collapseSection(element) {
    // get the height of the element's inner content, regardless of its actual size
    var sectionHeight = element.scrollHeight;
    
    // temporarily disable all css transitions
    var elementTransition = element.style.transition;
    element.style.transition = '';
    
    // on the next frame (as soon as the previous style change has taken effect),
    // explicitly set the element's height to its current pixel height, so we 
    // aren't transitioning out of 'auto'
    requestAnimationFrame(function() {
      element.style.height = sectionHeight + 'px';
      element.style.transition = elementTransition;
      
      // on the next frame (as soon as the previous style change has taken effect),
      // have the element transition to height: 0
      requestAnimationFrame(function() {
        element.style.height = 0 + 'px';
      });
    });
    
    // mark the section as "currently collapsed"
    element.setAttribute('data-opened', 'false');
}
  
function expandSection(element) {
    // get the height of the element's inner content, regardless of its actual size
    var sectionHeight = element.scrollHeight;
    
    // have the element transition to the height of its inner content
    element.style.height = sectionHeight + 'px';
  
    // when the next css transition finishes (which should be the one we just triggered)
    element.addEventListener('transitionend', function(e) {
      // remove this event listener so it only gets triggered once
      element.removeEventListener('transitionend', arguments.callee);
      
      // remove "height" from the element's inline styles, so it can return to its initial value
      element.style.height = element.scrollHeight;
    });
    
    // mark the section as "currently not collapsed"
    element.setAttribute('data-opened', 'true');
}