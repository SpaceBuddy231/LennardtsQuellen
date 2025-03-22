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


let valid = true;

async function Submit() {
    // Reset valid state at beginning of validation
    valid = true;

    // Check all inputs first
    document.querySelectorAll(".input").forEach(input => {
        if (!input.value.length > 0) {
            ToError(input);
        } else {
            input.classList.remove("border-[#878472]");
            input.classList.remove("border-[#C73C3C]");
            input.classList.add("border-[#37D129]");
        }
    });

    // Specific validations
    const input_username = document.getElementsByName("usernameoremail");
    const input_password = document.getElementsByName("password");
    const input_secret_code = document.getElementsByName("secret_code");

    // Check secret code
    if (!input_secret_code[0].value) {
        ToError(input_secret_code[0]);
    }

    // After all checks, use the valid flag
    if (valid) {
        console.log("Form is valid, submitting...");

        const usernameoremail = input_username[0].value;
        const password = input_password[0].value;
        const secret_code = input_secret_code[0].value;

        try {
            const response = await fetch(location.origin + "/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ usernameoremail, password, secret_code }),
            });

            const data = await response.json();
            if (response.ok) {
                alert(`Willkommen zurück, ${data.user.username}!`);
                // Redirect to home page after successful login
                setTimeout(() => {
                    window.location.href = location.origin;
                }, 1000);
            } else if (response.status == 401) {
                alert("Ungültiger Benutzername oder Passwort.");
            } else if (response.status == 403) {
                alert("Da ist wohl jemand kein Fleischlover :>");
            } else {
                alert(`Fehler beim Login. Melde das einem der Hauptfleischlover: ${data.message}`);
            }
        } catch (error) {
            alert("Fehler beim Login. Typ: Client. Melde das einem der Hauptfleischlover.");
            console.error(error);
        }
    } else {
        console.log("Form has errors, not submitting");
    }
}

function NavbarTitle() {
    window.location.href = "http://127.0.0.1:5000/"
}

function ToError(object) {
    object.classList.remove("border-[#878472]");
    object.classList.remove("border-[#37D129]");
    object.classList.add("border-[#C73C3C]");
    valid = false;
}

function togglePasswordVisibility(inputId) {
    const input = document.getElementById(inputId);
    const icon = document.getElementById(`${inputId}-icon`);

    if (input.type === "password") {
        input.type = "text";
        icon.classList.remove("fa-eye");
        icon.classList.add("fa-eye-slash");
    } else {
        input.type = "password";
        icon.classList.remove("fa-eye-slash");
        icon.classList.add("fa-eye");
    }
}

// Catch onclick Event for LoginButton() -- see index.html
function LoginButton() {
    //console.log("[DEBUG]: Login Button pressed.")

    window.location.href = location.origin + "/login";
}

// Catch onclick Event for RegisterButton() -- see index.html
function RegisterButton() {
    //console.log("[DEBUG]: Register Button pressed.")
    window.location.href = location.origin + "/register";
}
