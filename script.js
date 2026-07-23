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

/* =========================================
   ANIMATED WATCH LIBRARY INTERACTION
   ========================================= */
const watchData = [
    {
        title: "Interstellar",
        studio: "PARAMOUNT PICTURES",
        rating: "9.5/10",
        character: "Joseph Cooper",
        review: "The absolute peak of modern sci-fi cinema. Christopher Nolan really created a masterpice by visualizing the vastness of space and the emotional depth of human connection. I really got trumatized until I watched it more than two times. After the first time, I was not able to find answers of some questions such as (where did he get stuck?) or (why he told her daughter that he is coming back, even if he knew he won't?) So yeah I highly recommend to give it a try."
    },
    {
        title: "Game of Thrones",
        studio: "HBO",
        rating: "9.0/10",
        character: "Tyrion Lannister",
        review: " A groundbreaking series with complex characters and difficult political choices. Despite being relatives to each other, the plot is full of betrayals and unexpected twits. The show is stunning and the acting is top-notch, despite the controversial ending the journey to get there was worth it. Tyrion Lannister is the most complex and intelligent character in the show. He somehow manages to survive by using his mind and wit, even when he is surrounded by powerful enemies. His character is both satisfying and tragic at the same time, making his role unforgettable in the series. Overall, Game of Thrones is a must-watch for anyone who enjoys epic fantasy and complexity."
    },
    {
        title: "House Of The Dragon",
        studio: "HBO",
        rating: "7,5/10",
        character: "Daemon Targaryen",
        review: "A thrilling prequel to the beloved Game of Thrones, House of the dragon brings the House Targaryen's story to life with high visuals and compelling storytelling. We can see the situation of the old houses 172 years before the Game of Thrones. Despite the series are not fully published yet, some of the series already managed to get 9.4 rating. The plot is similar to Game of Thrones but the behavior of characters and the point of view is different. I can recommend this to the fans of Game of Thrones. I did give a 7.5 rating for myself, because I yet did not see the all series and need a rewatch, in the future." 
    },
    {
        title: "The Notebook",
        studio: "Paramount Pictures",
        rating: "8.0/10",
        character: "Noah Calhoun",
        review: "A touching romantic drama that explores the power of love and memory. The film beautifully descibes the difference between what is the love in teenage years and what is the love in adult years. The Notebook also dives into the problems which couples may face. Despite the sad parts, it gives us a chance to see the beauty of love and the importance of cherishing every moment with our loved ones. The performances by Ryan Gosling and Rachel McAdams are heartfelt and captivating, making their love story unforgettable. Overall, The Notebook is a timeless classic that will leave you with a warm heart and believing in the power of true love."
    },
    {
        title: "The Godfather",
        studio: "Paramount Pictures",
        rating: "9.9/10",
        character: "Michael Corleone",
        review: "This one is a masterpice which dives into deep family dynamics and organized crime. The Godfather really teaches the audience about family matters and its bonds. Movie has parts and each has a unique value. No comment needed by far!"
    },
    {
        title: "Transformers (bayverse)",
        studio: "Paramount Pictures",
        rating: "10/10",
        character: "Bumblebee",
        review: "This one is the best franchise I have ever seen. I can write an 1000 words essay about the film. However it is better to give it a watch. Believe me you won't regret your time. Well, when it comes to other transformers movies(non bayverse) they are not that good, I could give 7-7,5."
    },
    {
        title: "Harry Potter",
        studio: "Warner Bros enetertainment",
        rating: "111/10",
        character: "Severus Snape",
        review: "Actually everybody loves Harry Potter films. A guy whose family got killed secretly. But at the end after realizing who he really is, he realized his capabilities and did what he meant to do. Yeah it is clear that he witnessed a lot of difficulties in his way but in all this, his parents' souls were by his side and supported him. Also Dumbledore and Severus Snape protected him and yes his firends too. In my opinion, movie gives unforgettable emotions and shares different moods throughout the journey."
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
        review: "That one movie really gave me a hope of becoming a spider man frrr (when i was a kid btw). All the films are great but the ones which Tom Holland had a scene time is really enjoyable. Young nerdy and enjoyable kiddo which describes the spider man exactly."
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
                displayTitle.innerText = targetWatch.title;
                displayStudio.innerText = targetWatch.studio;
                displayRating.innerText = targetWatch.rating;
                displayCharacter.innerText = targetWatch.character;
                displayReview.innerText = targetWatch.review;

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
            
            // Get the specific PIN from the HTML data-pin attribute
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