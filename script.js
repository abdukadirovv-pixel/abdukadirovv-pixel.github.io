/* =========================================
   THEME LOGIC (Global)
   ========================================= */
const themeBtn = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const storageKey = 'site-theme-preference';

function applyTheme(theme) {
    const isLightMode = theme === 'light';
    document.body.classList.toggle('light-mode', isLightMode);

    if (themeIcon) {
        themeIcon.classList.remove('fa-moon', 'fa-sun');
        themeIcon.classList.add(isLightMode ? 'fa-sun' : 'fa-moon');
    }

    if (themeBtn) {
        themeBtn.setAttribute('aria-pressed', String(isLightMode));
    }
}

function initializeTheme() {
    const savedTheme = localStorage.getItem(storageKey);
    const preferredTheme = savedTheme || 'dark';
    applyTheme(preferredTheme);
}

if (themeBtn) {
    themeBtn.addEventListener('click', () => {
        const isLightMode = document.body.classList.contains('light-mode');
        const nextTheme = isLightMode ? 'dark' : 'light';
        applyTheme(nextTheme);
        localStorage.setItem(storageKey, nextTheme);
    });
}

initializeTheme();

/* =========================================
   BLOG PAGE LOGIC (Isolated safely)
   ========================================= */
const searchBar = document.getElementById('search-bar');
const filterTags = document.querySelectorAll('.filter-tag');
const blogPosts = document.querySelectorAll('.blog-post');
const loadMoreBtn = document.getElementById('load-more');
const postModal = document.getElementById('post-modal');
const closePostModalBtn = document.getElementById('close-modal');

if (searchBar) {
    searchBar.addEventListener('keyup', (e) => {
        const searchString = e.target.value.toLowerCase();
        blogPosts.forEach(post => {
            const titleElement = post.querySelector('.blog-title');
            if (titleElement) {
                const title = titleElement.innerText.toLowerCase();
                post.style.display = title.includes(searchString) ? 'flex' : 'none';
            }
        });
    });
}

if (filterTags.length > 0) {
    filterTags.forEach(tag => {
        tag.addEventListener('click', () => {
            filterTags.forEach(t => t.classList.remove('active'));
            tag.classList.add('active');
            const filterValue = tag.getAttribute('data-filter');

            blogPosts.forEach(post => {
                const postCategory = post.getAttribute('data-category');
                if (filterValue === 'all' || filterValue === postCategory) {
                    post.style.display = 'flex';
                } else {
                    post.style.display = 'none';
                }
            });
        });
    });
}

if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
        alert('This will load older posts from the CMS once connected!');
    });
}

if (postModal && blogPosts.length > 0) {
    blogPosts.forEach(post => {
        post.addEventListener('click', () => {
            const titleEl = post.querySelector('.blog-title');
            const dateEl = post.querySelector('.blog-date');
            const categoryEl = post.querySelector('.blog-category');
            const fullBodyContainer = post.querySelector('.blog-full-body');

            if (titleEl) document.getElementById('modal-title').innerText = titleEl.innerText;
            if (dateEl) document.getElementById('modal-date').innerText = dateEl.innerText;
            if (categoryEl) document.getElementById('modal-category').innerText = categoryEl.innerText;
            
            if (fullBodyContainer) {
                const modalBody = document.getElementById('modal-body');
                if (modalBody) modalBody.innerHTML = fullBodyContainer.innerHTML;
            }

            postModal.classList.add('active');
            document.body.style.overflow = 'hidden'; 
        });
    });

    const closePostModal = () => {
        postModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    };

    if (closePostModalBtn) {
        closePostModalBtn.addEventListener('click', closePostModal);
    }
    postModal.addEventListener('click', (e) => {
        if (e.target === postModal) closePostModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && postModal.classList.contains('active')) {
            closePostModal();
        }
    });
}

/* =========================================
   DECOUPLED FEEDBACK MODAL LOGIC (Works everywhere)
   ========================================= */
const feedbackTrigger = document.getElementById('feedback-trigger');
const feedbackModal = document.getElementById('feedback-modal');
const closeFeedbackBtn = document.getElementById('close-feedback-modal');
const feedbackForm = document.getElementById('ajax-feedback-form');
const formWrap = document.getElementById('feedback-form-wrap');
const successWrap = document.getElementById('feedback-success-wrap');
const feedbackSubmitBtn = document.getElementById('feedback-submit-btn');

if (feedbackTrigger && feedbackModal) {
    feedbackTrigger.addEventListener('click', (e) => {
        e.preventDefault();
        feedbackModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    const closeFeedback = () => {
        feedbackModal.classList.remove('active');
        document.body.style.overflow = 'auto';
        
        setTimeout(() => {
            if (feedbackForm) feedbackForm.reset();
            if (formWrap) formWrap.style.display = 'block';
            if (successWrap) successWrap.classList.remove('active');
            if (feedbackSubmitBtn) {
                feedbackSubmitBtn.innerText = "Send Feedback";
                feedbackSubmitBtn.disabled = false;
            }
        }, 300);
    };

    if (closeFeedbackBtn) {
        closeFeedbackBtn.addEventListener('click', closeFeedback);
    }

    feedbackModal.addEventListener('click', (e) => {
        if (e.target === feedbackModal) closeFeedback();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && feedbackModal.classList.contains('active')) {
            closeFeedback();
        }
    });

    if (feedbackForm) {
        feedbackForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (feedbackSubmitBtn) {
                feedbackSubmitBtn.innerText = "Sending...";
                feedbackSubmitBtn.disabled = true;
            }

            const formData = new FormData(feedbackForm);

            try {
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    body: formData
                });

                if (response.ok) {
                    if (formWrap) formWrap.style.display = 'none';
                    if (successWrap) successWrap.classList.add('active');
                    setTimeout(closeFeedback, 2500);
                } else {
                    alert('Network error. Please try again.');
                    if (feedbackSubmitBtn) {
                        feedbackSubmitBtn.disabled = false;
                        feedbackSubmitBtn.innerText = "Send Feedback";
                    }
                }
            } catch (error) {
                alert('Submission failed. Check your connection.');
                if (feedbackSubmitBtn) {
                    feedbackSubmitBtn.disabled = false;
                    feedbackSubmitBtn.innerText = "Send Feedback";
                }
            }
        });
    }
}

/* =========================================
   ANIMATED WATCH LIBRARY INTERACTION
   ========================================= */
const watchData = [
    {
        title: "Interstellar",
        studio: "PARAMOUNT PICTURES",
        rating: "9.5/10",
        character: "Joseph Cooper",
        review: "The absolute peak of modern sci-fi cinema. Christopher Nolan really created a masterpice by visualizing the vastness of space and the emotional depth of human connection..."
    },
    {
        title: "Game of Thrones",
        studio: "HBO",
        rating: "9.0/10",
        character: "Tyrion Lannister",
        review: "A groundbreaking series with complex characters and difficult political choices..."
    },
    {
        title: "House Of The Dragon",
        studio: "HBO",
        rating: "7,5/10",
        character: "Daemon Targaryen",
        review: "A thrilling prequel to the beloved Game of Thrones..."
    },
    {
        title: "The Notebook",
        studio: "Paramount Pictures",
        rating: "8.0/10",
        character: "Noah Calhoun",
        review: "A touching romantic drama that explores the power of love and memory..."
    },
    {
        title: "The Godfather",
        studio: "Paramount Pictures",
        rating: "9.9/10",
        character: "Michael Corleone",
        review: "This one is a masterpice which dives into deep family dynamics and organized crime..."
    },
    {
        title: "Transformers (bayverse)",
        studio: "Paramount Pictures",
        rating: "10/10",
        character: "Bumblebee",
        review: "This one is the best franchise I have ever seen..."
    },
    {
        title: "Harry Potter",
        studio: "Warner Bros entertainment",
        rating: "111/10",
        character: "Severus Snape",
        review: "Actually everybody loves Harry Potter films..."
    },
    {
        title: "Avengers",
        studio: "Marvel",
        rating: "10/10",
        character: "Thor",
        review: "I believe there is no need a comment for that one guyzz."
    },
    {
        title: "Spider Man",
        studio: "Marvel",
        rating: "8/10",
        character: "Tom Holland",
        review: "That one movie really gave me a hope of becoming a spider man frrr..."
    },
    {
        title: "others",
        studio: "N/A",
        rating: "N/A",
        character: "you",
        review: "The creator is a bit lazy, sorry I will add some more, but later."
    }
];

const menuItems = document.querySelectorAll('.movie-menu-item');
const detailsBox = document.getElementById('movie-details-box');
const displayTitle = document.getElementById('movie-display-title');
const displayStudio = document.getElementById('movie-display-studio');
const displayRating = document.getElementById('movie-display-rating');
const displayCharacter = document.getElementById('movie-display-character');
const displayReview = document.getElementById('movie-display-review');

if (menuItems.length > 0 && detailsBox) {
    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            if (item.classList.contains('active')) return;

            menuItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            item.scrollIntoView({ behavior: 'smooth', block: 'center' });

            detailsBox.classList.add('data-changing');

            const index = parseInt(item.getAttribute('data-index'), 10);
            const targetWatch = watchData[index];

            setTimeout(() => {
                if (displayTitle) displayTitle.innerText = targetWatch.title;
                if (displayStudio) displayStudio.innerText = targetWatch.studio;
                if (displayRating) displayRating.innerText = targetWatch.rating;
                if (displayCharacter) displayCharacter.innerText = targetWatch.character;
                if (displayReview) displayReview.innerText = targetWatch.review;

                detailsBox.classList.remove('data-changing');
            }, 250); 
        });
    });
}

/* =========================================
   SECRET PIN LOGIC (Supports per-post PINs)
   ========================================= */
document.addEventListener('click', function(e) {
    if (e.target && e.target.id === 'unlock-btn') {
        const modalBody = document.getElementById('modal-body');
        
        if (modalBody) {
            const pinInput = modalBody.querySelector('#pin-input');
            const errorText = modalBody.querySelector('#pin-error');
            const lockScreen = modalBody.querySelector('#lock-screen');
            const secretContent = modalBody.querySelector('#secret-content');

            const enteredPin = pinInput ? pinInput.value : "";
            const correctPin = lockScreen ? lockScreen.getAttribute('data-pin') : "";

            if (enteredPin === correctPin) {
                if (lockScreen) lockScreen.style.display = "none";
                if (secretContent) secretContent.style.display = "block";
            } else {
                if (errorText) errorText.innerText = "Incorrect PIN. Try again!";
                if (pinInput) pinInput.value = ""; 
            }
        }
    }
});
