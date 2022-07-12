//////////////   Utils    ////////////////
function renderMath() {
    var mathElements = document.getElementsByClassName("math");
    var macros = [];
    for (var i = 0; i < mathElements.length; i++) {
        var texText = mathElements[i].firstChild;
        if (mathElements[i].tagName == "SPAN") {
            katex.render(texText.data, mathElements[i], {
                displayMode: mathElements[i].classList.contains('display'),
                throwOnError: false,
                strict: false,
                macros: macros,
                fleqn: false
            });
        }
    }
};
function getBookData() {
    return window.book.cloneNode(true)
}
function parseHTML(html) {
    var t = document.createElement('template');
    t.innerHTML = html;
    return t.content
}
function getUrlChap() {
    let url = new URL(window.location.href);
    return url.searchParams.get("chap");
}
function getChapters() {
    var chaps = new Array();
    getBookData().querySelectorAll('section.level1').forEach(e => {
        chaps.push([e.id, e.querySelector('h1').innerHTML])
    })
    return chaps
}
function getChapter(id) {
    return getBookData().getElementById(id);
}
function getFootnote(id) {
    let p = getBookData().getElementById(id).querySelector("p");
    if (p) p.removeChild(p.lastChild)
    return p
}
function getReference(id) {
    return getBookData().getElementById(id);
}
function getSectionIndex(section, chapPath, chapTitle) {
    let headings = ["H1", "H2", "H3", "H4", "H5", "H6"];
    let data = {
        "path": chapPath,       //(?chap=語料蒐集)
        "id": section.id,
        "chapter": chapTitle,   //(section)
        "heading": "",          //(heading)
        "text": "",
        "code": ""
    };
    [ ...section.children ].forEach(e => {
        if (e.tagName == "SECTION" && e.hasAttribute('id'))
            getSectionIndex(e, chapPath, chapTitle)
        else if (headings.includes(e.tagName))
            data.heading = e.textContent
        else if (e.classList.contains("sourceCode"))
            data.code = data.code.concat('\n', e.textContent)
        else
            data.text = data.text.concat('\n', e.textContent)
    })
    window.searchIdx.push(data);
}
function buildSearchIndex() {
    getBookData().querySelectorAll('section.level1').forEach(chapter => {
        let chapPath = `?chap=${chapter.id}`;
        let chapTitle = chapter.firstElementChild.textContent;
        getSectionIndex(chapter, chapPath, chapTitle)
    })
}
function buildBookInfo(type) {
    [ ...window.bookInfo.children ].forEach(tp => {
        let name = tp.getAttribute('name');
        let val = tp.innerHTML;
        if (tp.tagName === "P") {
            document.querySelectorAll(`[data-var="${name}"]`).forEach(e => {
                e.innerHTML = val;
            })
        } else {
            let a_tgt = document.getElementById(name);
            [ ...tp.attributes ].forEach(a => {
                a_tgt.setAttribute(a.name, a.value);
                // a_tgt.setAttribute("href", tp.getAttribute("href"));
            })
            a_tgt.innerHTML = tp.innerHTML;
        }
        
    })
    
}
function buildLeftToc() {
    window.leftToc.innerHTML = "";
    getChapters().forEach(c => {
        var li = document.createElement('li');
        li.innerHTML = `<a>${c[1]}</a>`;
        // Chapter Navigation
        li.setAttribute("data-chapid", c[0])
        li.addEventListener("click", function () {
            history.pushState({}, "", window.location.pathname) // clear hash
            showChapter(li.getAttribute("data-chapid"))
        })
        window.leftToc.appendChild(li);
    })
}
function showChapter(id) {
    window.scrollTo(0, 0);
    const c = document.querySelector('main');
    c.innerHTML = "";
    c.appendChild(getChapter(id));
    
    // Build Book Info
    buildBookInfo();
    // Build right TOC
    window.rightToc.innerHTML = "";
    c.querySelectorAll("section.level2,section.level3").forEach(e => {

        const head = e.firstElementChild;
        const li = document.createElement('li');
        li.innerHTML = `<a class="nav-link" href="#${e.id}">${head.innerHTML}</a>`;
        if ([...e.classList].includes('level3')) li.className = "level3"
        window.rightToc.appendChild(li);
    })

    // Highlight left Toc
    window.currChapId = id;
    [...window.leftToc.children].forEach(e => {
        if (e.getAttribute("data-chapid") == window.currChapId)
            e.firstChild.className = "active"
        else
            e.firstChild.className = ""
    })

    // Collect footnotes & references
    c.querySelectorAll('a.footnote-ref').forEach(e => {
        let id = e.getAttribute("href").slice(1);
        e.removeAttribute("href");
        e.setAttribute("tabindex", "0")
        e.setAttribute("data-toggle", "popover");
        e.setAttribute("data-trigger", "focus");
        e.setAttribute("data-placement", "top");
        e.setAttribute("data-content", getFootnote(id).innerHTML);

    })
    c.querySelectorAll('a[role="doc-biblioref"]').forEach(e => {
        let id = e.getAttribute("href").slice(1);
        e.removeAttribute("href");
        e.setAttribute("class", "");  // Hack bs4 CSS rules to inherit style
        e.setAttribute("tabindex", "0")
        e.setAttribute("data-toggle", "popover");
        e.setAttribute("data-trigger", "focus");
        e.setAttribute("data-placement", "top");
        e.setAttribute("data-content", `<div class="csl-entry">${getReference(id).innerHTML}</div>`);

    })
    // Load Bootstrap Popovers for footnotes
    $('[data-toggle="popover"]').popover({
        container: 'body',
        html: true,
        trigger: 'focus',
        placement: "top",
        sanitize: false,
    });
    $('[data-toggle="tooltip"]').tooltip();
    // Add URL trace
    let url = new URL(window.location.href);
    url.searchParams.set("chap", id);
    window.history.pushState({}, "", url.toString())
    // KaTeX
    renderMath();

    // Highlight search term
    $(function () {
        var url = new URL(window.location.href);
        var toMark = url.searchParams.get("q");
        var mark = new Mark("main");
        if (toMark) {
          mark.mark(toMark, {
            accuracy: {
              value: "complementary",
              limiters: [",", ".", ":", "/"],
            }
          });
        }
      })
    // Scroll to hash after section loaded
    let hash = window.location.hash;
    if (hash) {
        hash = decodeURIComponent(hash.slice(1));
        setTimeout(
            function() {
                document.getElementById(hash).scrollIntoView()
            }, 480
        )
        
    }
}