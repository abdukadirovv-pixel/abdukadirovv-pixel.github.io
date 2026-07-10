/* =========================================
   THEME LOGIC
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
   BLOG PAGE LOGIC (Search, Filters & Modal)
   ========================================= */
const blogList = document.getElementById('blog-list');

if (blogList) {
    const searchBar = document.getElementById('search-bar');
    const filterTags = document.querySelectorAll('.filter-tag');
    const blogPosts = document.querySelectorAll('.blog-post');
    const loadMoreBtn = document.getElementById('load-more');
    const modal = document.getElementById('post-modal');
    const closeModalBtn = document.getElementById('close-modal');

    // 1. Search Functionality
    if (searchBar) {
        searchBar.addEventListener('keyup', (e) => {
            const searchString = e.target.value.toLowerCase();
            blogPosts.forEach(post => {
                const title = post.querySelector('.blog-title').innerText.toLowerCase();
                post.style.display = title.includes(searchString) ? 'flex' : 'none';
            });
        });
    }

    // 2. Category Tag Filtering
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

    // 3. Load More
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            alert('This will load older posts from the CMS once connected!');
        });
    }

    // 4. Modal Open & Close Logic
    if (modal) {
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

                modal.classList.add('active');
                document.body.style.overflow = 'hidden'; 
            });
        });

        const closeModal = () => {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        };

        closeModalBtn.addEventListener('click', closeModal);

        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });
    }
}

/* =========================================
   SILENT DYNAMIC FEEDBACK MODAL LOGIC (AJAX)
   ========================================= */
const feedbackTrigger = document.getElementById('feedback-trigger');
const feedbackModal = document.getElementById('feedback-modal');
const closeFeedbackBtn = document.getElementById('close-feedback-modal');
const feedbackForm = document.getElementById('ajax-feedback-form');
const formWrap = document.getElementById('feedback-form-wrap');
const successWrap = document.getElementById('feedback-success-wrap');
const feedbackSubmitBtn = document.getElementById('feedback-submit-btn');

if (feedbackTrigger && feedbackModal && closeFeedbackBtn) {
    
    // Open Feedback Window
    feedbackTrigger.addEventListener('click', () => {
        feedbackModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    // Close Window & Refresh Elements Smoothly
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

    closeFeedbackBtn.addEventListener('click', closeFeedback);
    feedbackModal.addEventListener('click', (e) => {
        if (e.target === feedbackModal) closeFeedback();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && feedbackModal.classList.contains('active')) {
            closeFeedback();
        }
    });

    // Handle background submission quietly
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
                    
                    // Closes pop-up box automatically after 2.5 seconds
                    setTimeout(closeFeedback, 2500);
                } else {
                    alert('Network error detected. Please try submitting again.');
                    if (feedbackSubmitBtn) {
                        feedbackSubmitBtn.innerText = "Send Feedback";
                        feedbackSubmitBtn.disabled = false;
                    }
                }
            } catch (error) {
                console.error('Submission Error:', error);
                alert('Something failed behind the scenes. Please verify connectivity.');
                if (feedbackSubmitBtn) {
                    feedbackSubmitBtn.innerText = "Send Feedback";
                    feedbackSubmitBtn.disabled = false;
                }
            }
        });
    }
}