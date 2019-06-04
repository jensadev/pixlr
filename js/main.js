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

let h = [];

let canvas = document.createElement('canvas');
let ctx = canvas.getContext('2d');
//let body = document.getElementsByTagName('body')[0];
let imgdiv = document.getElementById('images');
let size = 16;

canvas.width = size * 8;
canvas.height = size * 8;

function draw(hash, color) {
    let column = 0;
    let row = 0;
    //ctx.fillStyle = 'grey';
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

    let img = document.createElement("img");
    img.src = canvas.toDataURL();
    imgdiv.appendChild(img);

}

//body.appendChild(canvas);


let input = document.getElementById("string");

// Execute a function when the user releases a key on the keyboard
input.addEventListener("keyup", function (event) {
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
        // Cancel the default action, if needed
        event.preventDefault();
        // Trigger the button element with a click
        getHash(event.srcElement.value)
            .then(hash => {
                draw(hash, stringToColour(event.srcElement.value));
            });
    }
});
/*
getHash('fesk')
    .then(hash => {
        console.log(hash);
        draw(hash);
    });
*/
function isEven(char) {
    return String(char / 2).indexOf('.') === -1;
}

function makeRandomColor() {
    return '#' + Math.random().toString(16).slice(-6);
}

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