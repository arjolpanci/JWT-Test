let userInput = document.querySelector('#user');
let passInput = document.querySelector('#pass');
let errmsg = document.querySelector('.js-error');

let loginButton = document.querySelector('.js-login-button');

loginButton.onclick = function() {
    try{       
        $.ajax({
            type: "POST",
            url: "/",
            data: {
                user: userInput.value,
                pw: passInput.value
            },
        }).done( function(res, ts, xhr) {
            status = xhr.status;
            if(status == 200){
                document.cookie = `token=${res}`;
            }
            window.location.href = '/dashboard';
        }).fail(function () {
            errmsg.classList.replace('hidden', 'block');
        });
    } catch (err){
        console.log(err.message);
    }
};

