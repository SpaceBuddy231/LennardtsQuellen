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
    'Ihr seid mir zu gay!',
    'Kokain ist Gesund!'
];

// Check for maintenance mode on page load
async function checkMaintenanceMode() {
    try {
        const response = await fetch('/api/maintenance/status');
        const data = await response.json();

        if (data.inMaintenance) {
            showMaintenanceOverlay(data.message);
        }
    } catch (error) {
        console.error('Error checking maintenance status:', error);
    }
}

// Function to display the maintenance overlay
function showMaintenanceOverlay(message) {
    // Create overlay elements
    const overlay = document.createElement('div');
    overlay.className = 'maintenance-overlay';

    const content = document.createElement('div');
    content.className = 'maintenance-content animate__animated animate__fadeIn';

    const icon = document.createElement('img');
    icon.src = 'assets/lennardt-stroke.png';
    icon.alt = 'Maintenance Icon';
    icon.className = 'maintenance-icon';

    const title = document.createElement('h2');
    title.textContent = 'Wartungsmodus';
    title.className = 'maintenance-title font-semibold';

    const messageEl = document.createElement('p');
    messageEl.textContent = message || 'Die Seite befindet sich aktuell im Wartungsmodus. Bitte versuchen Sie es später erneut.';
    messageEl.className = 'maintenance-message';

    // Assemble overlay
    content.appendChild(icon);
    content.appendChild(title);
    content.appendChild(messageEl);
    overlay.appendChild(content);

    // Add overlay to page
    document.body.appendChild(overlay);

    // Disable scrolling on the body
    document.body.style.overflow = 'hidden';
}

window.onload = function () {
    const randomComment = potential_comments[Math.floor(Math.random() * potential_comments.length)];
    const lennards_weisen_worte = document.getElementsByClassName('lennardts-comment');

    lennards_weisen_worte[0].innerHTML = randomComment;
    lennards_weisen_worte[0].style.rotate = randRotationCalc() + "deg";
    lennards_weisen_worte[0].style.marginLeft = randLocationCommentCalc(1) + "%";
    lennards_weisen_worte[0].style.marginBottom = randLocationCommentCalc(2) + "%";
};

function LoginButton() {
    window.location.href = location.href + "login";
}

function RegisterButton() {
    window.location.href = location.href + "register";
}

function randRotationCalc() {
    return Math.floor((Math.random() * 17) - 8);
}

function randLocationCommentCalc(toggler) {
    let calc_x = Math.floor((Math.random() * 31) - 15);
    let calc_y = Math.floor((Math.random() * 8) - 3);

    if (toggler == 0) {
        return { calc_x, calc_y };
    } else if (toggler == 1) {
        return calc_x;
    } else if (toggler == 2) {
        return calc_y;
    } else {
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

        const username_navbar = document.getElementById("username_navbar");

        if (data.isLoggedIn) {
            console.log(`Logged in as: ${data.user.username}`);
            const buttons = document.querySelectorAll("#log\\/regbutton");
            const loginbtn = buttons[0];
            const registerbtn = buttons[1];

            loginbtn.style.visibility = 'hidden';
            registerbtn.style.visibility = 'hidden';

            username_navbar.style.display = "block";
            username_navbar.textContent = data.user.username;
        } else {
            console.log('Not logged in');
            if (username_navbar) {
                username_navbar.style.display = "none";
            }
        }
    } catch (error) {
        console.error('Error checking login status:', error);
    }
}

async function AddPost() {
    try {
        const response = await fetch('api/user');
        const data = await response.json();

        if (data.isLoggedIn) {
            window.location.href = location.href + "neue-quelle"
        } else {
            alert("Du bist nicht angemeldet!")
        }
    } catch (error) {
        console.error('Error checking login status:', error);
    }
}

function createPostElement(post) {
    const postId = post.id;
    const title = post.title;
    const content = post.content;
    const averageMood = post.averageMood || 50;
    const userMood = post.userMood;
    const totalMoodRatings = post.totalMoodRatings || 0;
    const author = post.author_username || "";

    const heartCount = post.hearts_count || 0;
    const likeCount = post.likes_count || 0;

    return `
    <div id="post-${postId}" class="flex justify-center animate__animated animate__fadeIn">
      <div
        id="post-frame"
        class="select-none font-semibold w-[90%] sm:w-[80%] mt-6 border-[3px] border-black justify-self-center items-center"
      >
        <div
          class="border-b-[3px] border-black min-h-[3rem] items-center p-[1%] animate__animated animate__backInLeft"
        >
          <p id="post-title" class="break-words sm:truncate px-2 py-1">${title} ~ ${author}</p>
        </div>
        <div id="post-content" class="items-center p-3 h-auto animate__animated animate__fadeIn animate__delay-1s">
          <p class="font-normal mb-[8.5%] break-words">
            ${content}
          </p>
          <!-- Like/Heart buttons -->
          <div class="flex justify-start items-center w-full mt-4 mb-2 animate__animated animate__backInRight">
            <div class="flex items-center gap-3 sm:gap-5">
              <button onclick="toggleHeart('${postId}')" class="animate__animated animate__pulse animate__delay-1s animate__infinite">
                <img
                  src="assets/heart.png"
                  class="w-5 h-5 sm:w-6 sm:h-6 cursor-pointer"
                  alt="Heart"
                />
              </button>
              <i id="heart-count-${postId}">${heartCount}</i>
              <button onclick="toggleLike('${postId}')" class="animate__animated animate__pulse animate__delay-1s animate__infinite">
                <img
                  src="assets/like.png"
                  class="w-5 h-5 sm:w-6 sm:h-6 cursor-pointer"
                  alt="Like"
                />
              </button>
              <i id="like-count-${postId}">${likeCount}</i>
            </div>
          </div>
        </div>
        <div
          id="oscarverleihung"
          class="border-t-[3px] border-black min-h-[5vh] items-center p-[1%] flex flex-col sm:flex-row font-medium gap-3 sm:gap-0 animate__animated animate__backInUp"
        >
          <div
            id="oscarverleihung-left"
            class="flex items-center justify-between gap-2 sm:gap-4 w-full flex-wrap sm:flex-nowrap"
          >
            <div class="w-fit animate__animated animate__bounceIn animate__delay-1s">
              <i class="text-[#0ABF00] text-nowrap">Lennardt verifiziert</i>
            </div>
            <div class="w-full sm:w-[60%] animate__animated animate__zoomIn animate__delay-2s relative">
              <input
                id="mood-range-${postId}"
                type="range"
                min="0"
                max="100"
                value="${averageMood}"
                data-average="${averageMood}"
                data-post-id="${postId}"
                class="mood-slider w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-slider"
                ${userMood !== null ? `data-user-value="${userMood}"` : ''}
                aria-label="Rate post mood"
                aria-valuemin="0"
                aria-valuemax="100"
                aria-valuenow="${averageMood}"
              />
              <div class="text-xs text-center mt-1">
                <span id="mood-ratings-count-${postId}">${totalMoodRatings}</span> Bewertungen
              </div>
            </div>
            <div class="text-[#D80D0D] w-fit text-right animate__animated animate__bounceIn animate__delay-1s"><i>Fake</i></div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Add event listener function for mood sliders
function setupMoodSliders() {
    document.querySelectorAll('.mood-slider').forEach(slider => {
        slider.addEventListener('change', async function () {
            try {
                // Check if user is logged in first
                const userResponse = await fetch('/api/user');
                const userData = await userResponse.json();

                if (!userData.isLoggedIn) {
                    // Reset slider to average value
                    this.value = this.getAttribute('data-average');
                    alert("Du musst angemeldet sein, um Beiträge zu bewerten!");
                    return;
                }

                const postId = this.getAttribute('data-post-id');
                const moodValue = parseInt(this.value);

                const response = await fetch(`/api/posts/${postId}/mood`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ moodValue })
                });

                if (response.ok) {
                    const data = await response.json();
                    // Update the slider to the new average value
                    this.setAttribute('data-average', data.averageMood);
                    this.setAttribute('data-user-value', data.userMood);

                    // Gradually animate slider to new average position
                    animateSlider(this, parseInt(this.value), data.averageMood);

                    // Update the ratings count
                    document.getElementById(`mood-ratings-count-${postId}`).textContent = data.totalRatings;
                }
            } catch (error) {
                console.error('Error updating mood:', error);
            }
        });

        // Show user's personal rating when hovering over slider
        slider.addEventListener('mouseover', function () {
            const userValue = this.getAttribute('data-user-value');
            if (userValue && userValue !== "") {
                this.value = userValue;
            }
        });

        // Restore to average value when mouse leaves
        slider.addEventListener('mouseout', function () {
            const avgValue = this.getAttribute('data-average');
            if (avgValue && avgValue !== "") {
                this.value = avgValue;
            }
        });
    });
}

// Animate slider from current value to target value
function animateSlider(slider, startValue, endValue) {
    const duration = 1000; // 1 second
    const start = performance.now();

    function step(timestamp) {
        const elapsed = timestamp - start;
        const progress = Math.min(elapsed / duration, 1);
        const currentValue = startValue + (endValue - startValue) * progress;

        slider.value = Math.round(currentValue);

        if (progress < 1) {
            requestAnimationFrame(step);
        }
    }

    requestAnimationFrame(step);
}

// Update the loadPosts function to use the postsContainer variable
async function loadPosts() {
    try {
        const response = await fetch('/api/posts');
        const data = await response.json();

        if (data.posts && data.posts.length > 0) {
            // Get the posts container
            const postsContainer = document.getElementById('posts');

            // Remove any existing placeholder posts
            const existingPosts = document.querySelectorAll('[id^="post-"]');
            existingPosts.forEach(post => post.remove());

            // Clear any existing content
            postsContainer.innerHTML = '';

            // Generate HTML for each post and add to container
            data.posts.forEach(post => {
                const postElement = createPostElement(post);
                postsContainer.insertAdjacentHTML('beforeend', postElement);
            });

            // Setup mood sliders after posts are loaded
            setupMoodSliders();
        }
    } catch (error) {
        console.error('Error loading posts:', error);
    }
}

// Functions to handle heart and like actions
async function toggleHeart(postId) {
    try {
        // Check if user is logged in first
        const userResponse = await fetch('/api/user');
        const userData = await userResponse.json();

        if (!userData.isLoggedIn) {
            alert("Du musst angemeldet sein, um Beiträge zu liken!");
            return;
        }

        const response = await fetch(`/api/posts/${postId}/heart`, {
            method: 'POST'
        });

        if (response.ok) {
            const data = await response.json();
            document.getElementById(`heart-count-${postId}`).textContent = data.heartCount;
        }
    } catch (error) {
        console.error('Error toggling heart:', error);
    }
}

async function toggleLike(postId) {
    try {
        // Check if user is logged in first
        const userResponse = await fetch('/api/user');
        const userData = await userResponse.json();

        if (!userData.isLoggedIn) {
            alert("Du musst angemeldet sein, um Beiträge zu liken!");
            return;
        }

        const response = await fetch(`/api/posts/${postId}/like`, {
            method: 'POST'
        });

        if (response.ok) {
            const data = await response.json();
            document.getElementById(`like-count-${postId}`).textContent = data.likeCount;
        }
    } catch (error) {
        console.error('Error toggling like:', error);
    }
}

// Add event listener for DOMContentLoaded
window.addEventListener('DOMContentLoaded', () => {
    checkLoginStatus();
    loadPosts();
    checkMaintenanceMode();
});