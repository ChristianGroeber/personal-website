fetch("/assets/apps.json")
    .then(response => response.json())
    .then(function (data) {
        data.forEach(function (app) {
            if (app.type === undefined) {
                app.type = 'app';
            }
            printApp(app, document.getElementById('homescreen'));
            if (app.type === 'folder') {
                printFolder(app);
            }
        })
        window.addEventListener('contextmenu', (event) => {
            var menu = hasCustomContextMenu(event.target);
            if (menu !== false) {
                event.preventDefault();
                showContextMenu(menu);
            }
        });
    });


function hasCustomContextMenu(element) {
    if (element.tagName === 'BODY') {
        return false;
    }
    if (element.classList.contains('has-custom-context-menu')) {
        return element;
    } else {
        return hasCustomContextMenu(element.parentElement);
    }
}

let viewingFolder = null;


function toggleFolder(event) {
    event.preventDefault();
    const folder = document.querySelector(event.target.closest('a').getAttribute('href'));
    if (viewingFolder === folder.getAttribute('id')) {
        folder.classList.remove('show');
        viewingFolder = null;
    } else {
        viewingFolder = folder.getAttribute('id');
        folder.classList.add('show');
        document.documentElement.style.overflow = 'hidden';
    }
}

function closeFolders(event) {
    if (!event.target.classList.contains('app-collection-wrapper')) {
        return;
    }
    event.preventDefault();
    document.querySelectorAll('.app-collection-wrapper.show').forEach(function (ele) {
        ele.classList.remove('show');
    });
    viewingFolder = null;
    document.documentElement.style.overflow = 'auto';
}

function printApp(appJson, parentElement) {
    if (appJson.type === 'folder') {
        appJson.href = '#' + appJson.id;
    }
    var hasCustomContextMenu = appJson.meta !== undefined;
    var appStr = "<div ";
    var classString = "class='application";
    if (hasCustomContextMenu) {
        classString += " has-custom-context-menu";
    }
    appStr += classString + "'>";
    appStr += "<a rel='noopener' type='" + appJson.type + "' href='" + appJson.href + "'";
    if (appJson.type !== 'folder') {
        appStr += " target='_blank'";
    }
    appStr += "><div><img class='img-responsive' alt='" + appJson.name + "' src='" + appJson.thumb + "'>" +
        "</div><p class='name'>" + appJson.name + "</p></a>";
    
    if (hasCustomContextMenu) {
        appStr += printContextMenu(appJson.meta);
    }
    appStr += "</div>";
    parentElement.innerHTML += appStr;

    if (appJson.type === 'folder') {
        document.querySelector("[href='#" + appJson.id + "']").addEventListener('click', toggleFolder);
    }
}

function printContextMenu(menu) {
    var contextMenuString = "<div class='context-menu'>";
    menu.forEach(function (menuItem) {
        contextMenuString += printContextMenuItem(menuItem);
    });
    contextMenuString += "</div>";
    return contextMenuString;
}

function printContextMenuItem(item) {
    var ret = "<a class='menu-row' type='" + item.type + "' href='" + item.href + "' ";
    if (item.type === "internal") {
        ret += "internal-link='" + item.src + "' ";
        ret += "content-type='" + item.contentType + "' ";
        ret += "internal-title='" + item.internalTitle + "' ";
    } else if (item.type === 'app') {
        ret += "target='_blank' "
    }
    ret += ">";
    ret += "<div class='item-text'>" + item.name + "</div>";
    ret += "<div class='item-icon'><img class='mini-icon' src='" + item.icon + "'></div>";
    ret += "</a>";

    return ret;
}

function showContextMenu(e) {
    var menu = e.getElementsByClassName('context-menu')[0];
    menu.classList.add('show');
}

function printFolder(folderJson) {
    let folderStr = "<div class='app-collection-wrapper' id='" + folderJson.id + "'><div class='app-collection'></div></div>";
    document.getElementById('folders').innerHTML += folderStr;
    folderJson.apps.forEach(function (app) {
        printApp(app, document.querySelector('#' + folderJson.id + ' .app-collection'));
    })
    document.getElementById(folderJson.id).addEventListener('click', closeFolders);
}

function requestPage(request) {
    document.title = request.title + ' - Christian Gröber';
    history.pushState({
        page: request.url
    }, request.title, request.url);
    fetch(request.page)
        .then(response => response.text())
        .then(function (data) {
            const subpage = document.getElementById('subpage-content');
            if (request.contentType === 'md') {
                data = marked.parse(data);
            }
            subpage.innerHTML = data;
            document.getElementById('subpage-wrapper').classList.add('show');
        });
}

function closePage() {
    document.querySelector('#subpage-wrapper.show').classList.remove('show');
    document.title = 'Christian Gröber';
    history.pushState({}, 'Home', '/');
}

function findChild(elem, childName) {
    childName = childName.toLowerCase();
    for (let i = 0; i < elem.childNodes.length; i++) {
        if (elem.childNodes[i].tagName.toLowerCase() === childName) {
            return elem.childNodes[i];
        }
    }
    for (let i = 0; i < elem.childNodes.length; i++) {
        let child = findChild(elem.childNodes[i], childName);
        if (child !== null) {
            return child;
        }
    }

    return null;
}

function findParent(elem, parentName) {
    parentName = parentName.toLowerCase();
    if (elem.parentNode.tagName.toLowerCase() === parentName) {
        return elem.parentNode;
    }
    if (elem.parentNode.tagName === 'BODY') {
        return false;
    }

    return findParent(elem.parentNode, parentName);
}

const tagsToIdentify = ['img', 'a'];

document.body.onclick = function (e) {
    removeMenus();
    let link = false;
    if (e.target.tagName.toLowerCase() === 'a') {
        link = e.target;
    } else {
        link = findParent(e.target, 'a');
    }

    if (!link) {
        return false;
    }

    return handleLink(link, e);
};

function handleLink(link, clickEvent) {
    let linkType = link.getAttribute('type');
    if (linkType === 'app' || !linkType) {
        return null;
    }
    clickEvent.preventDefault();

    const request = {
        page: link.getAttribute('internal-link'),
        title: link.getAttribute('internal-title'),
        url: link.getAttribute('href'),
        contentType: link.getAttribute('content-type'),
    };

    if (linkType === 'internal') {
        requestPage(request);
    }
}

function removeMenus() {
    var menus = document.getElementsByClassName('context-menu'); 
    for (var i = 0; i < menus.length; i++) {
        menus[i].classList.remove('show');
    }
}