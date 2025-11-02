// api.js

export function callApi(reqmethod, url, data, ResponseHandler)
{
    let option;
    if(reqmethod==="GET" || reqmethod==="DELETE")
        option = {
          method: reqmethod,
          headers: {'content-type': 'application/json'},
        };
    else
        option = {
          method: reqmethod,
          headers: {'content-type': 'application/json'},
          body: data
        };

    fetch(url, option)
        .then(response => {
            if (!response.ok) {
                // If the server sends a JSON error body, try to read it for better message
                return response.text().then(msg => {
                  throw new Error(`Error: ${response.status} ${response.statusText} | ${msg}`);
                });
            }
            return response.text(); // or response.json() if API returns JSON
        })
        .then(data => ResponseHandler(data))
        .catch(error => alert(error.message || error));
}

// Session management with cookies
export function setSession(sesname, sesvalue, expday) {
    let D = new Date();
    D.setTime(D.getTime() + expday * 24 * 60 * 60 * 1000);
    // Store session value in secure cookie
    document.cookie = `${sesname}=${encodeURIComponent(sesvalue)};expires=${D.toUTCString()};path=/;secure`;
}

export function getSession(sesname) {
    let decodedCookie = decodeURIComponent(document.cookie);
    let cookieData = decodedCookie.split(';');
    for (let item of cookieData) {
        const key = item.split('=')[0].trim();
        if (key === sesname) {
            return item.substring(item.indexOf('=')+1).trim();
        }
    }
    return "";
}
