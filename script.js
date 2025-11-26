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

    // Re-initialize slider/carousel positions for the active page
    if (targetPage === 'home') {
        updateSlider(0); // Reset home page slider
    }
    
    // Scroll to top when switching pages for better UX
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Add event listeners to navigation items
navItems.forEach(item => {
    item.addEventListener('click', () => {
        const targetPage = item.getAttribute('data-page');
        if (targetPage && targetPage !== 'more') {
            switchPage(targetPage);
        } else if (targetPage === 'more') {
             alert('More options coming soon!'); // Placeholder for 'more'
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


// =======================================================
// --- 3. Image Slider Logic (Home Page) ---
// =======================================================
const slider = document.querySelector('.image-slider');
const dots = document.querySelectorAll('.slider-dot');
const totalSlides = dots ? dots.length : 0;
let currentSlide = 0;

function updateSlider(index) {
    if (!slider) return;
    // Calculate translation percentage
    slider.style.transform = `translateX(-${index * (100 / totalSlides)}%)`;
    
    dots.forEach((dot, i) => {
        dot.classList.remove('active');
        if (i === index) {
            dot.classList.add('active');
        }
    });
    currentSlide = index;
}

function nextSlide() {
    let next = (currentSlide + 1) % totalSlides;
    updateSlider(next);
}

function startSlider() {
    if (slider && totalSlides > 1) {
        if (slideInterval) clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, 5000); // Change image every 5 seconds
    }
}

// Add click listeners to dots
dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        updateSlider(index);
        clearInterval(slideInterval); // Pause auto slide on manual interaction
        slideInterval = setInterval(nextSlide, 5000); // Resume auto slide
    });
});

// =======================================================
// --- 4. Fade-in-Up Animation Logic (On Scroll Reveal) ---
// =======================================================
document.addEventListener('DOMContentLoaded', () => {
    const observerOptions = {
        root: null, 
        rootMargin: '0px',
        threshold: 0.1 
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.getAttribute('data-delay') || 0;
                setTimeout(() => {
                    entry.target.style.opacity = 1;
                    entry.target.style.transform = 'translateY(0)';
                }, delay);
                observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in-up').forEach(element => {
        element.style.transition = 'opacity 0.7s ease-out, transform 0.7s ease-out'; // Slower transition for premium feel
        observer.observe(element);
    });
});

// =======================================================
// --- 5. Theme Toggle Logic (Dark/Light Mode) ---
// =======================================================
const themeToggleButtons = document.querySelectorAll('#theme-toggle-button, #theme-toggle-button-discover, #theme-toggle-button-routes, #theme-toggle-button-map');
const body = document.body;
const themeIconHome = document.getElementById('theme-icon');
const themeIconDiscover = document.getElementById('theme-icon-discover');
const themeIconRoutes = document.getElementById('theme-icon-routes');
const themeIconMap = document.getElementById('theme-icon-map');


function applyTheme(isDark) {
    if (isDark) {
        body.classList.add('dark-mode');
        // Update icons to show 'sun' (for switching to light)
        if(themeIconHome) themeIconHome.setAttribute('data-lucide', 'sun');
        if(themeIconDiscover) themeIconDiscover.setAttribute('data-lucide', 'sun');
        if(themeIconRoutes) themeIconRoutes.setAttribute('data-lucide', 'sun');
        if(themeIconMap) themeIconMap.setAttribute('data-lucide', 'sun');
        lucide.createIcons(); 
    } else {
        body.classList.remove('dark-mode');
        // Update icons to show 'moon' (for switching to dark)
        if(themeIconHome) themeIconHome.setAttribute('data-lucide', 'moon');
        if(themeIconDiscover) themeIconDiscover.setAttribute('data-lucide', 'moon');
        if(themeIconRoutes) themeIconRoutes.setAttribute('data-lucide', 'moon');
        if(themeIconMap) themeIconMap.setAttribute('data-lucide', 'moon');
        lucide.createIcons();
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


themeToggleButtons.forEach(button => {
    button.addEventListener('click', function() {
        const isCurrentlyDark = body.classList.contains('dark-mode');
        const newTheme = isCurrentlyDark ? 'light' : 'dark';
        
        applyTheme(!isCurrentlyDark);
        localStorage.setItem('theme', newTheme);
    });
});

// =======================================================
// --- 6. Initialization on Load ---
// =======================================================
document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Theme (must be first to prevent flicker)
    initializeTheme(); 

    // 2. Start Home Slider (if home page is the default)
    startSlider(); 

    // 3. Enable Parallax for the default home page
    window.addEventListener('scroll', handleParallaxScroll);
});