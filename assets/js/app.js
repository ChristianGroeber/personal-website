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
    });


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
    let appStr = "<a rel='noopener' type='" + appJson.type + "' class='application' href='" + appJson.href + "'";
    if (appJson.type !== 'folder') {
        appStr += " target='_blank'";
    }
    appStr += "><div><img alt='" + appJson.name + "' src='" + appJson.thumb + "'>" +
        "</div><p class='name'>" + appJson.name + "</p></a>";
    parentElement.innerHTML += appStr;

    if (appJson.type === 'folder') {
        document.querySelector("[href='#" + appJson.id + "']").addEventListener('click', toggleFolder);
    }
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
    history.pushState({ page: request.url }, request.title, request.url);
    fetch(request.page)
        .then(response => response.text())
        .then(function (data) {
            const subpage = document.getElementById('subpage');
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
    let link = false;
    if (e.target.tagName === 'a') {
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
    if (linkType === 'app') {
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