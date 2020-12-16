fetch("/assets/apps.json")
    .then(response => response.json())
    .then(function (data) {
        data.forEach(function (app) {
            let appStr = "<a class='application' href='" + app.href + "' target='_blank'>" +
                "<div><img src='" + app.thumb + "'>" +
                "</div><p class='name'>" + app.name + "</p></a>";
            document.getElementById('homescreen').innerHTML += appStr;
        })
    });
