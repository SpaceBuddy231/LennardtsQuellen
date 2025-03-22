unallowed_names = [
    "admin",
    "spacebuddy",
    "jo",
    "joe",
    "hambuerger",
    "hambürger"
]

//const database_url = "mongodb://localhost:27017/lennardtdatabase";

window.onload = function () {

}

let valid = true;

async function Submit() {
    // Reset validation state at the beginning
    valid = true;

    // Check all inputs for emptiness
    document.querySelectorAll(".input").forEach(input => {
        if (!input.value.length > 0) {
            ToError(input);
        } else {
            input.classList.remove("border-[#878472]");
            input.classList.remove("border-[#C73C3C]");
            input.classList.add("border-[#37D129]");
        }
    });

    const input_username = document.getElementsByName("username");
    const input_email = document.getElementsByName("email");
    const input_password = document.getElementsByName("password");
    const input_revpassword = document.getElementsByName("revpassword");
    const input_secret_code = document.getElementsByName("secret_code");

    // Checks the name entry through some hardcoded unallowed names
    unallowed_names.forEach(entry => {
        if (input_username[0].value.toLowerCase().includes(entry) || !input_username[0].value.length > 0) {
            ToError(input_username[0]);
        }
    })

    // Check if email field has an "@" included
    if (!input_email[0].value.includes("@")) {
        ToError(input_email[0])
    }

    // Check if password == revpassword
    if (input_password[0].value != input_revpassword[0].value) {
        ToError(input_password[0]);
        ToError(input_revpassword[0]);
    }

    // Check if Fleischlover Secret Key is correct (will be dynamicly in the future)
    if (!input_secret_code[0].value) {
        ToError(input_secret_code[0]);
    }

    // Then at the end, check if the form is valid
    if (valid) {
        console.log("Form is valid, submitting...");

        const username = input_username[0].value;
        const email = input_email[0].value;
        const password = input_password[0].value;
        const secret_code = input_secret_code[0].value;

        try {
            const response = await fetch(location.origin + "/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, email, password, secret_code }),
            });

            const data = await response.json();
            if (response.ok) {
                alert(`Willkommen, ${username}.\nVerbreite nun deine Quellen und verbreite die Kunde der Fleischlover :)`)
                // Redirect to login page after successful registration
                setTimeout(() => {
                    window.location.href = location.origin + "/login";
                }, 1000);
            } else if (response.status == 409) {
                alert("Nutzername oder Email bereits vergeben.")
            } else if (response.status == 403) {
                alert("Da ist wohl jemand kein Fleischlover :>")
            } else if (response.status == 408) {
                alert("Dein Nutzername ist zu lang.")
            } else {
                alert(`Fehler. Melde das hier einen der Hauptfleischlover: ${data.message}`)
            }
        } catch (error) {
            alert("Fehler bei der Registrierung. Typ: Client. Melde das einen der Hauptfleischlover.")
            console.error(error);
        }
    } else {
        console.log("Form has errors, not submitting");
    }
}

function ToError(object) {
    object.classList.remove("border-[#878472]");
    object.classList.remove("border-[#37D129]");
    object.classList.add("border-[#C73C3C]");

    valid = false;
}

function NavbarTitle() {
    window.location.href = location.origin + "/";
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

// Ensure the Submit function is properly attached to your register form

// Update your HTML form to have a button with either:
// 1. onclick="Submit()" attribute, or
// 2. Make sure your form has an event listener set up

// If your form has an id="registerForm", add this at the bottom of register.js
document.addEventListener('DOMContentLoaded', function () {
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function (event) {
            event.preventDefault();
            Submit();
        });
    }

    // Or if you have a specific button with id="registerButton"
    const registerButton = document.getElementById('registerButton');
    if (registerButton) {
        registerButton.addEventListener('click', function (event) {
            event.preventDefault();
            Submit();
        });
    }
});

// Or you can modify your existing RegisterButton function:
function RegisterButton() {
    // This function should handle the form submission, not just navigate
    Submit();
    // Don't navigate away - the Submit function will handle that if successful
    // window.location.href = location.origin + "/register";
}
