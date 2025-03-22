// Check if user is logged in on page load
window.addEventListener('DOMContentLoaded', async function () {
    try {
        const response = await fetch('/api/user');
        const data = await response.json();

        if (!data.isLoggedIn) {
            // Redirect to login page if not logged in
            alert('Du musst angemeldet sein, um eine neue Quelle zu erstellen.');
            window.location.href = '/login';
            return;
        }

        // Update navigation bar to show username
        const usernameElement = document.getElementById('username_navbar');
        if (usernameElement && data.user && data.user.username) {
            usernameElement.textContent = data.user.username;
            usernameElement.style.display = 'block';

            // Hide login/register buttons
            const buttons = document.querySelectorAll('#log\\/regbutton');
            buttons.forEach(button => {
                button.style.display = 'none';
            });
        }
    } catch (error) {
        console.error('Error checking login status:', error);
    }
});

async function SubmitPost() {
    let valid = true;

    // Validate form inputs
    document.querySelectorAll('.input').forEach(input => {
        if (input.required && !input.value.trim()) {
            ToError(input);
            valid = false;
        } else {
            input.classList.remove("border-[#C73C3C]");
            input.classList.add("border-[#37D129]");
        }
    });

    if (!valid) {
        alert('Bitte fülle alle erforderlichen Felder aus.');
        return;
    }

    // Get form values
    const title = document.getElementById('input_title').value;
    const content = document.getElementById('input_content').value;

    try {
        const response = await fetch('/api/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, content }),
        });

        const data = await response.json();

        if (response.ok) {
            alert('Quelle erfolgreich veröffentlicht!');
            // Redirect to home page
            window.location.href = '/';
        } else {
            alert(`Fehler beim Erstellen der Quelle: ${data.message}`);
        }
    } catch (error) {
        console.error('Error creating post:', error);
        alert('Fehler beim Erstellen der Quelle. Bitte versuche es erneut.');
    }
}

function ToError(object) {
    object.classList.remove("border-[#878472]");
    object.classList.remove("border-[#37D129]");
    object.classList.add("border-[#C73C3C]");
}

function CancelPost() {
    if (confirm('Möchtest du wirklich abbrechen? Alle Eingaben gehen verloren.')) {
        window.location.href = '/';
    }
}

function NavbarTitle() {
    window.location.href = '/';
}