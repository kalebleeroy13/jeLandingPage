function toggleMenu() {
    const nav = document.querySelector('.nav-container');
    nav.classList.toggle('open');
    // Update the aria-expanded attribute
    const isExpanded = nav.classList.contains('open');
    document.getElementById('menu-icon').setAttribute('aria-expanded', isExpanded);
}

function addDropdownListeners() {
    const dropdownButton = document.querySelector('.dropdown-button');
    const dropdownContent = document.querySelector('.custom-dropdown-menu');

    const handleDropdownToggle = () => {
        const isSmallViewport = window.matchMedia("(max-width: 768px)").matches;

        if (dropdownButton && dropdownContent) {
            if (isSmallViewport) {
                dropdownButton.addEventListener('click', function(event) {
                    event.preventDefault();
                    let expanded = dropdownButton.getAttribute('aria-expanded') === 'true' || false;
                    dropdownButton.setAttribute('aria-expanded', !expanded);
                    dropdownContent.classList.toggle('show');
                });
            } else {
                dropdownButton.removeEventListener('click', handleDropdownToggle);
                dropdownContent.classList.remove('show');
            }
        }
    };

    window.addEventListener('resize', handleDropdownToggle);
    handleDropdownToggle(); // Initial check on page load
}

function createLoadingOverlay() {
    if (!document.getElementById('loading-overlay')) {
        const overlay = document.createElement('div');
        overlay.id = 'loading-overlay';
        overlay.innerHTML = '<div id="rising-sun-container"><div id="rising-sun"></div></div>';
        document.body.prepend(overlay);
    }
}

// Create and insert the loading overlay as soon as the script runs
createLoadingOverlay();

document.addEventListener('DOMContentLoaded', function() {
    // Dynamically add lazy loading to all images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.setAttribute('loading', 'lazy');
    });

    const headerPlaceholder = document.getElementById('header-placeholder');
    const footerPlaceholder = document.getElementById('footer-placeholder');
    const navbarToggle = document.querySelector('.navbar-toggle');

    function animateLogo() {
        const overlay = document.getElementById("landing-overlay");
        setTimeout(() => {
            overlay.style.display = "none";
        }, 6000);  // 4 seconds for the animation + 2 seconds delay
    }

    function fetchAndSetInnerHTML(url, element) {
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(data => {
                element.innerHTML = data;
                if (url.includes('header.html')) {
                    addDropdownListeners();
                    if (window.location.pathname.endsWith('index.html')) {
                        animateLogo(); // Animate the logo on the index page
                    }
                }
            }).catch(error => {
                console.error(`Error loading ${url}:`, error);
            });
    }

    function loadHeaderFooter() {
        if (headerPlaceholder) {
            fetchAndSetInnerHTML('header.html', headerPlaceholder);
        }

        if (footerPlaceholder) {
            fetchAndSetInnerHTML('footer.html', footerPlaceholder);
        }
    }

    if (navbarToggle) {
        navbarToggle.addEventListener('click', toggleMenu);
    }

    loadHeaderFooter();

    // Dynamic versioning for CSS files using Last Modified Date
    const cssLink = document.querySelector('link[rel="stylesheet"][href="styles/styles.css"]');
    if (cssLink) {
        fetch(cssLink.href).then(response => {
            const lastModified = response.headers.get('last-modified');
            if (lastModified) {
                const version = new Date(lastModified).getTime();
                cssLink.href = `${cssLink.href}?v=${version}`;
            }
        }).catch(error => {
            console.error('Error fetching CSS file:', error);
        });
    }

    // Register service worker
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js').then((registration) => {
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            }).catch((error) => {
                console.log('ServiceWorker registration failed:', error);
            });

            // Request background sync for latest content
            if (registration.sync) {
                registration.sync.register('sync-updated-content').then(() => {
                    console.log('Background sync registered');
                }).catch((error) => {
                    console.log('Background sync registration failed:', error);
                });
            }
        });
    }

    // Add fade-in effect to body on initial load
    document.body.classList.add('fade-in');

    // Add transition effect when clicking on links
    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const href = link.getAttribute('href');
            document.body.classList.remove('fade-in');
            document.body.classList.add('fade-out');
            setTimeout(() => {
                window.location.href = href;
            }, 1000); // Match the duration of the fade-out animation (1s)
        });
    });

    // Remove loading overlay once the page has fully loaded
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
        setTimeout(() => {
            const loadingOverlay = document.getElementById('loading-overlay');
            if (loadingOverlay) {
                loadingOverlay.remove();
            }
        }, 1000); // Duration of the fade-in animation (1s)
    });
});
