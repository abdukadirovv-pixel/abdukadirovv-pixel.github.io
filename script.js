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
            const title = post.querySelector('.blog-title').innerText.toLowerCase();
            post.style.display = title.includes(searchString) ? 'flex' : 'none';
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
            const title = post.querySelector('.blog-title').innerText;
            const date = post.querySelector('.blog-date').innerText;
            const category = post.querySelector('.blog-category').innerText;
            const fullBodyContainer = post.querySelector('.blog-full-body');

            document.getElementById('modal-title').innerText = title;
            document.getElementById('modal-date').innerText = date;
            document.getElementById('modal-category').innerText = category;
            
            if (fullBodyContainer) {
                document.getElementById('modal-body').innerHTML = fullBodyContainer.innerHTML;
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