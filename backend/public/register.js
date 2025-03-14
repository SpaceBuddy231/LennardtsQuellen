//let screensize = CalcScreenSize();

//window.onload = function () {

//const screensize = CalcScreenSize();
//const sz_x = screensize.x;
//const sz_y = screensize.y;

// get main div
//const form = document.getElementsByClassName("main");

// define width of main div to the follwing equation: (sz_x / 2) - (sz_x / 2 - (sz_x / 2)) => sz_x = screenwidth (of user)
//form[0].style.width = ((sz_x / 2) - ((sz_x / 2) - sz_x / 2)) + "px";
//console.log("DEBUG: " + ((sz_x / 2) - ((sz_x / 2) - sz_x / 2)) + "px");

// define height of main div to the following equation: (sz_y / 2) - (sz_y / 2 - (sz_y / 2)) => sz_y = screenheight (of user)
//form[0].style.height = ((sz_y / 2) - ((sz_y / 2) - sz_y / 2)) + "px";
//console.log("DEBUG: " + ((sz_y / 2) - ((sz_y / 2) - sz_y / 2)) + "px");

//};

//function CalcScreenSize() {
//let x = window.innerWidth;
//let y = window.innerHeight;

//return { x, y }
//};




// Catch onclick Event for LoginButton() -- see index.html
function LoginButton() {
    //console.log("[DEBUG]: Login Button pressed.")

    window.location.href = "http://127.0.0.1:5000/login";
}

// Catch onclick Event for RegisterButton() -- see index.html
function RegisterButton() {
    //console.log("[DEBUG]: Register Button pressed.")
    window.location.href = "http://127.0.0.1:5000/register";
}