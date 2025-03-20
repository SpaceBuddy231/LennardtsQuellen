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
    'Nachthimmel = LED-Leuchten!',
    'Nachthimmel = Sparmodus!',
    'Wir leben in einer Simulation!',
    'Ramon der geile!',
    'Ich will Mark den Geilen!',
    'Die da oben belügen uns!',
    'Die Wahrheit wird unterdrückt!'
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

function NavbarTitle() {
    window.location.href = "http://127.0.0.1:5000/"
}

async function checkLoginStatus() {
    try {
        const response = await fetch('/api/user');
        const data = await response.json();

        // Get Username <h1> element
        const username_navbar = document.getElementById("username_navbar");

        if (data.isLoggedIn) {
            // User is logged in, update UI accordingly
            console.log(`Logged in as: ${data.user.username}`);
            // Hide Login and Register buttons
            const buttons = document.querySelectorAll("#log\\/regbutton");
            const loginbtn = buttons[0];
            const registerbtn = buttons[1];

            loginbtn.style.visibility = 'hidden';
            registerbtn.style.visibility = 'hidden';

            // Explicitly set display to make username visible
            username_navbar.style.display = "block";
            username_navbar.textContent = data.user.username;
        } else {
            console.log('Not logged in');
            // Hide username when not logged in
            if (username_navbar) {
                username_navbar.style.display = "none";
            }
        }
    } catch (error) {
        console.error('Error checking login status:', error);
    }
}

window.addEventListener('DOMContentLoaded', checkLoginStatus);

//let i = 0;

//while (i < 100) {
//    i++;
//    let pos = randLocationCommentCalc();
//    console.log("X: " + pos.x + "\n" + "Y: " + pos.y);
//}