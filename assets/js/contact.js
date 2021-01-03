function submitContactForm() {
    const xhr = new XMLHttpRequest();
    const form = new FormData(document.forms[0]);
    xhr.open('POST', '/pages/send-message.php');
    xhr.send(form);
    xhr.onreadystatechange = function(data) {
        if (xhr.readyState === 4) {
            let response = JSON.parse(xhr.response);
            const info = document.getElementById('contact-success');
            if (response.success) {
                info.innerText = 'Message successfully sent. I will get back to you as soon as possible';
                info.classList.add('success');
                info.classList.remove('error');
            } else {
                info.innerText = 'Error sending message, please try again later';
                info.classList.remove('success');
                info.classList.add('error');
            }
            window.setTimeout(function() {
                info.innerText = '';
            }, 2000);
        }
    }
}