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


};

function randRotationCalc() {
    calc = Math.floor((Math.random() * 17) - 8)
    return calc;
}

function randLocationCommentCalc() {
    let calc_x = Math.floor((Math.random() * 31) - 15);
    let calc_y = Math.floor((Math.random() * 9) - 4);

    return { x: calc_x, y: calc_y }
}

let i = 0;

while (i < 100) {
    i++;
    let pos = randLocationCommentCalc();
    console.log("X: " + pos.x + "\n" + "Y: " + pos.y);
}