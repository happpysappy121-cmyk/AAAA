// Initialize Lucide Icons
lucide.createIcons();

// =======================================================
// --- 1. Page Toggle Logic ---
// =======================================================
const navItems = document.querySelectorAll('.nav-item');
const homePage = document.getElementById('home-page');
const discoverPage = document.getElementById('discover-page');
const routesPage = document.getElementById('routes-page'); 
const mapPage = document.getElementById('map-page');
const appHeader = document.getElementById('app-header');

const homeHeaderContent = document.getElementById('home-header-content');
const discoverHeaderContent = document.getElementById('discover-header-content');
const routesHeaderContent = document.getElementById('routes-header-content'); 
const mapHeaderContent = document.getElementById('map-header-content');
const homeHeaderTitle = document.getElementById('home-header-title');
const discoverHeaderTitle = document.getElementById('discover-header-title');
const routesHeaderTitle = document.getElementById('routes-header-title'); 
const mapHeaderTitle = document.getElementById('map-header-title');

let slideInterval; // Declare slide interval globally

/**
 * Switches the displayed page content and updates the header/nav state.
 * @param {string} targetPage - The data-page attribute value ('home', 'discover', 'routes', 'map', etc.).
 */
function switchPage(targetPage) {
    // Deactivate all navigation items
    navItems.forEach(item => item.classList.remove('active'));

    // Hide all pages, headers, and remove header style classes first
    homePage.style.display = 'none';
    discoverPage.style.display = 'none';
    routesPage.style.display = 'none'; 
    mapPage.style.display = 'none';
    
    homeHeaderContent.style.display = 'none';
    discoverHeaderContent.style.display = 'none';
    routesHeaderContent.style.display = 'none'; 
    mapHeaderContent.style.display = 'none';
    
    homeHeaderTitle.style.display = 'none';
    discoverHeaderTitle.style.display = 'none';
    routesHeaderTitle.style.display = 'none';
    mapHeaderTitle.style.display = 'none';
    
    appHeader.classList.remove('discover-style');

    clearInterval(slideInterval); // Stop slider on leaving home
    window.removeEventListener('scroll', handleParallaxScroll); // Disable parallax temporarily

    // Toggle Content Visibility
    if (targetPage === 'home') {
        homePage.style.display = 'block';

        // Toggle Header Style
        homeHeaderContent.style.display = 'flex';
        homeHeaderTitle.style.display = 'block';
        startSlider(); // Restart slider on returning to home
        window.addEventListener('scroll', handleParallaxScroll); // Re-enable parallax

    } else if (targetPage === 'discover') {
        discoverPage.style.display = 'block';

        // Toggle Header Style
        appHeader.classList.add('discover-style');
        discoverHeaderContent.style.display = 'flex';
        discoverHeaderTitle.style.display = 'block';

    } else if (targetPage === 'routes') { 
        routesPage.style.display = 'block';

        // Toggle Header Style (Using the same style as Discover for now)
        appHeader.classList.add('discover-style');
        routesHeaderContent.style.display = 'flex';
        routesHeaderTitle.style.display = 'block';
        
    } else if (targetPage === 'map') { 
        mapPage.style.display = 'block';

        // Toggle Header Style
        appHeader.classList.add('discover-style');
        mapHeaderContent.style.display = 'flex';
        mapHeaderTitle.style.display = 'block';
    
    } else {
        // For placeholder pages like 'more'
    }

    // Activate the corresponding navigation item
    const targetNavItem = document.querySelector(`.nav-item[data-page="${targetPage}"]`);
    if (targetNavItem) {
        targetNavItem.classList.add('active');
    }
    
    // Scroll to top of main content area to avoid weird jump
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Re-run animation setup for the new visible page (NEW)
    setupScrollReveal(); 
}

// Add event listeners for navigation items
navItems.forEach(item => {
    item.addEventListener('click', () => {
        const targetPage = item.getAttribute('data-page');
        if (targetPage && targetPage !== 'more') {
            switchPage(targetPage);
        } else if (targetPage === 'more') {
            // ✨ MAGNIFICENT POPUP instead of basic alert
            alert('The "More" hub for Profile, Settings, and Help is coming soon to complete your magnificent experience!'); // Placeholder for 'more'
        }
    });
});


// =======================================================
// --- 2. Parallax Scroll Logic ---
// =======================================================
function handleParallaxScroll() {
    // Only apply parallax on the home page when it's visible
    if (homePage.style.display === 'block' || homePage.style.display === '') {
        const scrollPosition = window.scrollY;
        // Use a slightly more aggressive parallax rate (0.4)
        appHeader.style.backgroundPositionY = `calc(center - ${scrollPosition * 0.4}px)`;
    }
}
// Initial listener setup
window.addEventListener('scroll', handleParallaxScroll);


// =======================================================
// --- 3. Image Slider Logic (Home Page) ---
// =======================================================
const slider = document.querySelector('.image-slider');
const dots = document.querySelectorAll('.slider-dot');
const totalSlides = dots ? dots.length : 0;
let currentSlide = 0;

function updateSlider(index) {
    if (!slider || totalSlides === 0) return;
    
    // Ensure index wraps around
    if (index >= totalSlides) {
        currentSlide = 0;
    } else if (index < 0) {
        currentSlide = totalSlides - 1;
    } else {
        currentSlide = index;
    }

    // Calculate translation percentage
    slider.style.transform = `translateX(-${currentSlide * (100 / totalSlides)}%)`;

    dots.forEach((dot, i) => {
        dot.classList.remove('active');
        if (i === currentSlide) {
            dot.classList.add('active');
        }
    });
}

function startSlider() {
    clearInterval(slideInterval); // Clear any existing interval
    slideInterval = setInterval(() => {
        updateSlider(currentSlide + 1);
    }, 5000); // Slide changes every 5 seconds
}

// Attach event listeners to dots
if (dots) {
    dots.forEach((dot) => {
        dot.addEventListener('click', (event) => {
            const slideIndex = parseInt(event.target.getAttribute('data-slide'));
            updateSlider(slideIndex);
            clearInterval(slideInterval); // Pause interval on manual click
            startSlider(); // Restart interval after manual interaction
        });
    });
}

// =======================================================
// --- 4. Theme Toggle Logic ---
// =======================================================
const body = document.body;
// Select all theme toggle buttons across all headers (FIXED)
const themeToggleButtons = document.querySelectorAll('[id^="theme-toggle-button"]'); 

// Icons for each header (must be selected individually if dynamically updated)
const themeIconHome = document.getElementById('theme-icon'); 
const themeIconDiscover = document.getElementById('theme-icon-discover'); 
const themeIconRoutes = document.getElementById('theme-icon-routes'); 
const themeIconMap = document.getElementById('theme-icon-map'); 

function applyTheme(isDark) {
    if (isDark) {
        body.classList.add('dark-mode');
        // Set icon to show 'sun' (for switching to light)
        if(themeIconHome) themeIconHome.setAttribute('data-lucide', 'sun');
        if(themeIconDiscover) themeIconDiscover.setAttribute('data-lucide', 'sun');
        if(themeIconRoutes) themeIconRoutes.setAttribute('data-lucide', 'sun');
        if(themeIconMap) themeIconMap.setAttribute('data-lucide', 'sun');
        lucide.createIcons(); // Re-render icon
        
    } else {
        body.classList.remove('dark-mode');
        // Set icon to show 'moon' (for switching to dark)
        if(themeIconHome) themeIconHome.setAttribute('data-lucide', 'moon');
        if(themeIconDiscover) themeIconDiscover.setAttribute('data-lucide', 'moon');
        if(themeIconRoutes) themeIconRoutes.setAttribute('data-lucide', 'moon');
        if(themeIconMap) themeIconMap.setAttribute('data-lucide', 'moon');
        lucide.createIcons(); // Re-render icon
    }
}

function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark') {
        applyTheme(true);
    } else if (savedTheme === 'light') {
        applyTheme(false);
    } else if (prefersDark) {
        applyTheme(true); 
    } else {
        applyTheme(false);
    }
}

// Add click listener to all theme toggle buttons
themeToggleButtons.forEach(button => {
    button.addEventListener('click', function() {
        const isCurrentlyDark = body.classList.contains('dark-mode');
        const newTheme = isCurrentlyDark ? 'light' : 'dark';
        
        applyTheme(!isCurrentlyDark);
        localStorage.setItem('theme', newTheme);
    });
});


// =======================================================
// --- 5. Scroll Reveal Animation Logic (NEW) ---
// =======================================================

function setupScrollReveal() {
    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.2 // Trigger when 20% of the item is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Apply a staggered delay based on the data-delay attribute
                const delay = entry.target.getAttribute('data-delay');
                if (delay) {
                    entry.target.style.transitionDelay = `${delay}ms`;
                }
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Stop observing once visible
            }
        });
    }, observerOptions);

    // Select all elements to be animated on the currently visible page
    const animatedElements = document.querySelectorAll('#home-page .fade-in-up, #discover-page .fade-in-up, #routes-page .fade-in-up, #map-page .fade-in-up');
    
    animatedElements.forEach(el => {
        // Reset state and observe
        el.classList.remove('is-visible');
        el.style.transitionDelay = '0ms'; // Reset delay before observing
        observer.observe(el);
    });
}

// =======================================================
// --- 6. Heli-Tours Modal Logic (NEW) ---
// =======================================================
const heliTourLink = document.getElementById('heli-tour-link');
const heliModal = document.getElementById('heli-modal');
const closeModalButton = document.querySelector('#heli-modal .close-modal');
const modalConfirmButton = document.querySelector('.modal-confirm-btn');

function openHeliModal() {
    if (heliModal) {
        heliModal.style.display = 'flex';
        // Force reflow for the transition to work
        heliModal.offsetHeight; 
        heliModal.classList.add('open');
    }
}

function closeHeliModal() {
    if (heliModal) {
        heliModal.classList.remove('open');
        setTimeout(() => {
            heliModal.style.display = 'none';
        }, 300); // Match the CSS transition duration
    }
}

if (heliTourLink) {
    heliTourLink.addEventListener('click', openHeliModal);
}

if (closeModalButton) {
    closeModalButton.addEventListener('click', closeHeliModal);
}

if (heliModal) {
    // Close modal on outside click
    heliModal.addEventListener('click', (event) => {
        if (event.target === heliModal) {
            closeHeliModal();
        }
    });
}

if (modalConfirmButton) {
    modalConfirmButton.addEventListener('click', () => {
        alert('Thank you for your enquiry! A Luxury Charter Specialist will contact you within 1 hour.');
        closeHeliModal();
    });
}


// =======================================================
// --- 7. Initialization on Load ---
// =======================================================
document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Theme (must be first to prevent flicker)
    initializeTheme(); 

    // 2. Start Home Slider (if home page is the default)
    if (homePage.style.display !== 'none') {
        startSlider();
        handleParallaxScroll(); // Set initial parallax position
    }
    
    // 3. Setup Scroll Reveal for animations
    setupScrollReveal(); 
});
