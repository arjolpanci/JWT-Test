let button = document.querySelector('.js-get-button');
let contentDiv = document.querySelector('.js-content');

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

button.onclick = function() {
    let token = getCookie('token');
    try{
        $.ajax({
            type: "GET",
            url: "/api/getsecret",
            headers: {
                "Authorization": `Bearer ${token}`,
              },
        }).done( function(res, ts, xhr) {
            contentDiv.innerHTML = JSON.stringify(res);
        });
    } catch (error){
        console.log(err.message);
    }
};
