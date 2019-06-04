let h = [];

let canvas = document.createElement('canvas');
let ctx = canvas.getContext('2d');
//let body = document.getElementsByTagName('body')[0];
let imgdiv = document.getElementById('images');
let size = 16;

canvas.width = size * 8;
canvas.height = size * 8;

let input = document.getElementById("string");
let ev;

input.addEventListener("keyup", function (event) {
    ev = event.srcElement.value;
    if (event.keyCode === 13) {
        event.preventDefault();
        getHash(event.srcElement.value)
            .then(hash => {
                draw(hash, stringToColour(event.srcElement.value));
            });
    }
});

function draw(hash, color) {
    let column = 0;
    let row = 0;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    hash = Array.from(hash);
    hash.forEach(element => {
        if (isEven(element)) {
            ctx.clearRect(column * size, row * size, canvas.width, canvas.height);
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(column * size, row * size, canvas.width, canvas.height);
        }
        column++;

        if (column % 8 == 0) {
            row++;
            column = 0;
        }
    });

    createCard(canvas.toDataURL(), ev);
    /*let img = document.createElement("img");
    img.src = canvas.toDataURL();
    img.classList.add("shadow-sm");
    imgdiv.appendChild(img);*/
}

function isEven(char) {
    return String(char / 2).indexOf('.') === -1;
}

//https://stackoverflow.com/questions/3426404/create-a-hexadecimal-colour-based-on-a-string-with-javascript
var stringToColour = function (str) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    var colour = '#';
    for (var i = 0; i < 3; i++) {
        var value = (hash >> (i * 8)) & 0xFF;
        colour += ('00' + value.toString(16)).substr(-2);
    }
    return colour;
}

//https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript
function getHash(str, algo = "SHA-256") {
    let strBuf = new TextEncoder('utf-8').encode(str);
    return crypto.subtle.digest(algo, strBuf)
        .then(hash => {
            window.hash = hash;
            // here hash is an arrayBuffer, 
            // so we'll connvert it to its hex version
            let result = '';
            const view = new DataView(hash);
            for (let i = 0; i < hash.byteLength; i += 4) {
                result += ('00000000' + view.getUint32(i).toString(16)).slice(-8);
            }
            return result;
        });
}

function createCard(imgsrc, text) {
    let cardDiv = document.createElement('div');
    cardDiv.classList.add('card');
    let cardimg = document.createElement("img");
    cardimg.src = imgsrc;
    cardimg.classList.add("card-img-top");
    cardimg.classList.add("p-2");

    let cardBody = document.createElement('div');
    cardBody.classList.add('card-body');
    let cardTitle = document.createElement('p');
    cardTitle.classList.add('card-text');
    cardTitle.textContent = text;

    let cardBtn = document.createElement('a');
    cardBtn.href = imgsrc.replace("image/png", "image/octet-stream");
    cardBtn.setAttribute('download', text.trim().replace(/ /g, '_') + ".png");
    cardBtn.classList.add('btn');
    cardBtn.classList.add('btn-outline-secondary');
    cardBtn.textContent = "Save image";

    cardDiv.appendChild(cardimg);
    cardBody.appendChild(cardTitle);
    cardDiv.appendChild(cardBody);
    cardBody.appendChild(cardBtn);
    imgdiv.appendChild(cardDiv);
}
