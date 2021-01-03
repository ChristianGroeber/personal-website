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
    document.querySelectorAll('.app-collection-wrapper.show').forEach(function(ele) {
        ele.classList.remove('show');
    });
    viewingFolder = null;
    document.documentElement.style.overflow = 'auto';
}

function printApp(appJson, parentElement) {
    if (appJson.type === 'folder') {
        appJson.href = '#' + appJson.id;
    }
    let appStr = "<a type='" + appJson.type + "' class='application' href='" + appJson.href + "'";
    if (appJson.type !== 'folder') {
        appStr += " target='_blank'";
    }
    appStr += "><div><img src='" + appJson.thumb + "'>" +
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