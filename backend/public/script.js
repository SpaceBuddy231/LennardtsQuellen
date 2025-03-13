const potential_comments = [
    'Die Erde ist eine Scheibe!',
    'Hitler lebt noch!',
    'Hitler ist nie gestorben!',
    'Impfungen = Nanobots',
    'Die Mondlandung war gefaked',
    'Echsenmenschen regieren die Welt!',
    'Impfungen implantieren Chips!',
    'Aliens haben die Pyramiden gebaut!',
    'Area-51 versteckt UFOs!',
    'Klimawandel ist eine Lüge!',
    'Die Erde ist hohl!',
    'Corona war geplant!',
    'Antarktis = Nazi Basis!',
    'WLAN strahlt uns krank!',
    'Wir leben in einer Simulation!',
];

window.onload = function () {
    // Select a random comment
    const randomComment = potential_comments[Math.floor(Math.random() * potential_comments.length)];

    // Get lennards-comment <p> element
    const lennards_weisen_worte = document.getElementsByClassName('lennardts-comment');

    // Set random comment for lennards text
    lennards_weisen_worte[0].innerHTML = randomComment;

    lennards_weisen_worte[0].style.rotate = randRotationCalc() + "deg";
    lennards_weisen_worte[0].style.marginLeft = randLocationCommentCalc(1) + "%";
    lennards_weisen_worte[0].style.marginBottom = randLocationCommentCalc(2) + "%";

};

// Catch onclick Event for LoginButton() -- see index.html
function LoginButton() {
    //console.log("[DEBUG]: Login Button pressed.")

    window.location.href = location.href + "login";
}

// Catch onclick Event for RegisterButton() -- see index.html
function RegisterButton() {
    //console.log("[DEBUG]: Register Button pressed.")
    window.location.href = location.href + "register";
}

function randRotationCalc() {
    //console.log("DEBUG: Calculating random rotation");
    let calc = Math.floor((Math.random() * 17) - 8);
    //console.log("DEBUG: Generated rotation value:", calc + "deg");
    return calc;
}

function randLocationCommentCalc(toggler) {
    //console.log("DEBUG: Calculating random location with toggler:", toggler);
    let calc_x = Math.floor((Math.random() * 31) - 15);
    let calc_y = Math.floor((Math.random() * 8) - 3);
    //console.log("DEBUG: Generated values - X:", calc_x, "Y:", calc_y);

    if (toggler == 0) {
        //console.log("DEBUG: Returning both coordinates");
        return { calc_x, calc_y };
    } else if (toggler == 1) {
        //console.log("DEBUG: Returning X coordinate:", calc_x);
        return calc_x;
    } else if (toggler == 2) {
        //console.log("DEBUG: Returning Y coordinate:", calc_y);
        return calc_y;
    } else {
        //console.log("DEBUG: Invalid toggler, returning 0");
        return 0;
    }
}

//let i = 0;

//while (i < 100) {
//    i++;
//    let pos = randLocationCommentCalc();
//    console.log("X: " + pos.x + "\n" + "Y: " + pos.y);
//}