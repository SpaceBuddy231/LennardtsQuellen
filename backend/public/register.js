unallowed_names = [
    "admin",
    "spacebuddy",
    "jo",
    "joe",
    "hambuerger",
    "hambürger"
]

const database_url = "mongodb://localhost:27017/lennardtdatabase";

window.onload = function () {

}

function Submit() {
    document.querySelectorAll(".input").forEach(input => {
        if (!input.value.length > 0) {
            ToError(input);
        } else {
            input.classList.remove("border-[#878472]");
            input.classList.remove("border-[#C73C3C]");
            input.classList.add("border-[#37D129]");
        }
    })

    const input_username = document.getElementsByName("username");
    const input_email = document.getElementsByName("email");
    const input_password = document.getElementsByName("password");
    const input_revpassword = document.getElementsByName("revpassword");
    const input_secret_code = document.getElementsByName("secret_code");

    // Checks the name entry through some hardcoded unallowed names
    unallowed_names.forEach(entry => {
        if (input_username[0].value.toLowerCase().includes(entry)) {
            ToError(input_username[0]);
            return "Username got blocked";
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
    if (input_secret_code[0].value != "FleischloverSecret") {
        ToError(input_secret_code[0]);
    }
}

function ToError(object) {
    object.classList.remove("border-[#878472]");
    object.classList.remove("border-[#37D129]");
    object.classList.add("border-[#C73C3C]");
}

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
