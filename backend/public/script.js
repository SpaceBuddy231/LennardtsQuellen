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
    window.location.href = location.origin + "/login";
}

function RegisterButton() {
    window.location.href = location.origin + "/register";
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
    window.location.href = location.origin + "/";
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

    // Comments would be loaded from the server, but using empty array as placeholder
    const comments = post.comments || [];

    return `
    <div id="post-${postId}" class="flex justify-center animate__animated animate__fadeIn animate__faster">
      <div
        id="post-frame"
        class="select-none font-semibold w-[90%] sm:w-[80%] mt-6 border-[3px] border-black justify-self-center items-center animate__animated animate__zoomIn"
      >
        <div
          class="border-b-[3px] border-black min-h-[3rem] items-center p-[1%] animate__animated animate__backInLeft"
        >
          <p id="post-title" class="break-words sm:truncate px-2 py-1 animate__animated animate__fadeIn animate__delay-1s">${title} ~ ${author}</p>
        </div>
        <div id="post-content" class="items-center p-3 h-auto animate__animated animate__fadeIn animate__delay-1s">
          <p class="font-normal mb-[8.5%] break-words animate__animated animate__fadeInUp animate__delay-1s">
            ${content}
          </p>
          <!-- Like/Heart buttons -->
          <div class="flex justify-start items-center w-full mt-4 mb-2 animate__animated animate__backInRight">
            <div class="flex items-center gap-3 sm:gap-5">
              <button onclick="toggleHeart('${postId}')" class="animate__animated animate__pulse animate__delay-1s animate__infinite hover:animate__headShake">
                <img
                  src="assets/heart.png"
                  class="w-5 h-5 sm:w-6 sm:h-6 cursor-pointer transition-all duration-200 hover:scale-110"
                  alt="Heart"
                />
              </button>
              <i id="heart-count-${postId}" class="animate__animated animate__fadeIn">${heartCount}</i>
              <button onclick="toggleLike('${postId}')" class="animate__animated animate__pulse animate__delay-1s animate__infinite hover:animate__headShake">
                <img
                  src="assets/like.png"
                  class="w-5 h-5 sm:w-6 sm:h-6 cursor-pointer transition-all duration-200 hover:scale-110"
                  alt="Like"
                />
              </button>
              <i id="like-count-${postId}" class="animate__animated animate__fadeIn">${likeCount}</i>
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
                class="mood-slider w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-slider animate__animated"
                ${userMood !== null ? `data-user-value="${userMood}"` : ''}
                aria-label="Rate post mood"
                aria-valuemin="0"
                aria-valuemax="100"
                aria-valuenow="${averageMood}"
              />
              <div class="text-xs text-center mt-1">
                <span id="mood-ratings-count-${postId}" class="animate__animated animate__fadeIn">${totalMoodRatings}</span> Bewertungen
              </div>
            </div>
            <div class="text-[#D80D0D] w-fit text-right animate__animated animate__bounceIn animate__delay-1s"><i>Fake</i></div>
          </div>
        </div>
        
        <!-- Comments Section -->
        <div class="border-t-[3px] border-black p-3 animate__animated animate__fadeIn animate__delay-2s">
          <h3 class="font-semibold mb-2 animate__animated animate__bounceIn animate__delay-2s">Kommentare</h3>
          
          <!-- Comment Form -->
          <div class="mb-4 animate__animated animate__fadeInLeft animate__delay-2s">
            <textarea 
              id="comment-input-${postId}" 
              class="w-full p-2 border-2 border-[#878472] rounded-md mb-2 bg-form-input-bg text-text resize-y focus:border-[#F7B32B] focus:outline-none transition-all duration-200 hover:shadow-md"
              placeholder="Schreibe einen Kommentar..."
              rows="2"
            ></textarea>
            <button 
              onclick="submitComment('${postId}')" 
              class="font-rubik font-semibold bg-button hover:bg-button-hover py-1 px-4 rounded-[10px] border-2 border-[#878472] text-sm transition-all duration-200 hover:scale-105 animate__animated animate__heartBeat animate__delay-3s animate__repeat-1"
            >
              Kommentar senden
            </button>
          </div>
          
          <!-- Comments List -->
          <div id="comments-container-${postId}" class="space-y-3 animate__animated animate__fadeIn animate__delay-3s">
            ${comments.map((comment, index) => `
              <div class="p-2 border-l-4 border-[#5da9e9] bg-gray-50 animate__animated animate__fadeInUp animate__delay-${3 + index / 2}s hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
                <div class="flex justify-between items-center mb-1">
                  <span class="font-medium animate__animated animate__fadeIn animate__delay-${3 + index / 2}s">${comment.username || 'Anonym'}</span>
                  <span class="text-xs text-gray-500 animate__animated animate__fadeIn animate__delay-${3 + index / 2}s">${comment.createdAt || 'Jetzt'}</span>
                </div>
                <p class="text-sm animate__animated animate__flipInX animate__delay-${3.2 + index / 2}s">${comment.content || ''}</p>
              </div>
            `).join('') || '<p class="text-sm text-gray-500 italic animate__animated animate__fadeIn animate__delay-3s animate__infinite animate__pulse">Noch keine Kommentare. Sei der Erste!</p>'}
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

// Function to submit a new comment
async function submitComment(postId) {
    try {
        // Check if user is logged in first
        const userResponse = await fetch('/api/user');
        const userData = await userResponse.json();

        if (!userData.isLoggedIn) {
            alert("Du musst angemeldet sein, um Kommentare zu schreiben!");
            return;
        }

        const commentInput = document.getElementById(`comment-input-${postId}`);
        const commentText = commentInput.value.trim();

        if (!commentText) {
            alert("Bitte gib einen Kommentartext ein!");
            return;
        }

        const response = await fetch(`/api/posts/${postId}/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ content: commentText })
        });

        if (response.ok) {
            const data = await response.json();

            // Add the new comment to the UI
            const commentsContainer = document.getElementById(`comments-container-${postId}`);

            // Remove placeholder text if it exists
            const placeholder = commentsContainer.querySelector('.italic');
            if (placeholder) {
                commentsContainer.innerHTML = '';
            }

            // Add new comment
            const newComment = document.createElement('div');
            newComment.className = 'p-2 border-l-4 border-[#5da9e9] bg-gray-50 animate__animated animate__fadeIn';
            newComment.innerHTML = `
                <div class="flex justify-between items-center mb-1">
                    <span class="font-medium">${userData.user.username}</span>
                    <span class="text-xs text-gray-500">Gerade eben</span>
                </div>
                <p class="text-sm">${commentText}</p>
            `;

            commentsContainer.prepend(newComment);
            commentInput.value = '';
        } else {
            alert("Fehler beim Senden des Kommentars. Bitte versuche es erneut.");
        }
    } catch (error) {
        console.error('Error submitting comment:', error);
        alert("Fehler beim Senden des Kommentars.");
    }
}

// Add event listener for DOMContentLoaded
window.addEventListener('DOMContentLoaded', () => {
    checkLoginStatus();
    loadPosts();
    checkMaintenanceMode();
});