function submitContactForm() {
    var valid = validateForm(document.forms[0]);
    var xhr = new XMLHttpRequest();
    var form = new FormData(document.forms[0]);
    var button = document.getElementById('contact-button');

    if (!valid) {
        return false;
    }

    button.disable();
    button.setText('Sending...');
    xhr.open('POST', '/api/pages/send-message.php');
    xhr.send(form);

    xhr.onreadystatechange = function (data) {
        if (xhr.readyState === 4) {
            var info = document.getElementById('contact-success');
            button.enable();
            button.setText('Submit');
            if (xhr.status >= 500) {
                var error = 'Error sending message, please try again later';
                info.setText(error);
                info.removeClass('success');
                info.addClass('error');
            } else {
                var response = JSON.parse(xhr.response);
                if (response.success) {
                    setDateLastMessage();
                    info.setText('Message successfully sent. I will get back to you as soon as possible');
                    info.addClass('success');
                    info.removeClass('error');
                } else {
                    if (!('error' in response)) {
                        var error = 'Error sending message, please try again later';
                    } else {
                        var error = response.error;
                    }
                    info.setText(error);
                    info.removeClass('success');
                    info.addClass('error');
                    if (xhr.status === 401 || xhr.status === 429) {
                        button.disable();
                    }
                }
            }
            window.setTimeout(function () {
                info.setText('');
            }, 5000);
        }
    }
}

function canSendMessages() {
    var dateLastMessage = new Date(localStorage.getItem('dateLastMessage'));
    var diff = new Date() - dateLastMessage;

    return diff > 86400000;
}

function setDateLastMessage() {
    localStorage.setItem('dateLastMessage', new Date());
}

function validateForm(form) {
    var elements = form.elements;
    var formValid = true;

    for (var i = 0; i < elements.length; i++) {
        var el = elements[i];
        var error = document.querySelector('[error-for="' + el.getAttribute('id') + '"]');
        var valid = el.checkValidity();

        if (error) {
            error.hide();
        }

        if (!valid) {
            formValid = false;
            error.show();
        }
    }

    return formValid;
}

function contactUpdateLength() {
    var button = document.getElementById('contact-button');
    var lengthField = document.getElementById('contact-message-length');
    var messageField = document.getElementById('message');
    var length = messageField.value.length;

    if (length > 5000) {
        button.setAttribute('disabled', 'disabled');
        lengthField.classList.add('color-red')
    } else {
        button.removeAttribute('disabled');
        lengthField.classList.remove('color-red');
    }

    lengthField.innerText = length + "/5'000";
}

function checkIfClientCanSendMessage() {
    if (!canSendMessages()) {
        var errorField = document.getElementById('error-can-not-send-messages');
        document.forms[0].hide();
        errorField.show();
    }
}