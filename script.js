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
    // Open Modal on Card Click
    blogPosts.forEach(post => {
        post.addEventListener('click', () => {
            // Grab info from the specific card you clicked
            const title = post.querySelector('.blog-title').innerText;
            const date = post.querySelector('.blog-date').innerText;
            const category = post.querySelector('.blog-category').innerText;
            
            // ⚠️ NEW: Grab the unique full body text from the hidden container
            const fullBodyText = post.querySelector('.blog-full-body').innerHTML;

            // Inject that info into the modal
            document.getElementById('modal-title').innerText = title;
            document.getElementById('modal-date').innerText = date;
            document.getElementById('modal-category').innerText = category;
            
            // ⚠️ NEW: Injects your unique text paragraphs into the pop-up modal body
            document.getElementById('modal-body').innerHTML = fullBodyText;

            // Show modal and freeze background scrolling
            modal.classList.add('active');
            document.body.style.overflow = 'hidden'; 
        });
    });

    // Close Modal Function
    const closeModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto'; // Let background scroll again
    };

    // Triggers to close the modal
    closeModalBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}
}