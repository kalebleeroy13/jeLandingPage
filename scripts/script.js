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

    // Check if the viewport is smaller
    const isSmallViewport = window.matchMedia("(max-width: 768px)").matches;

    if (dropdownButton && dropdownContent && isSmallViewport) {
        dropdownButton.addEventListener('click', function(event) {
            event.preventDefault();
            let expanded = dropdownButton.getAttribute('aria-expanded') === 'true' || false;
            dropdownButton.setAttribute('aria-expanded', !expanded);
            dropdownContent.classList.toggle('show');
        });
    }
}

function addFadeInOnClick() {
    const links = document.querySelectorAll('a');

    links.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const targetUrl = this.href;

            // Remove existing fade-in classes
            links.forEach(link => link.classList.remove('fade-in'));

            // Add fade-in class
            this.classList.add('fade-in');

            // Navigate to the target URL after the animation
            setTimeout(() => {
                window.location.href = targetUrl;
            }, 500); // Duration of the animation (0.5s)
        });
    });
}

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

    function loadHeaderFooter() {
        if (headerPlaceholder) {
            fetch('header.html')
                .then(response => response.text())
                .then(data => {
                    headerPlaceholder.innerHTML = data;
                    addDropdownListeners();
                    if (window.location.pathname.endsWith('index.html')) {
                        animateLogo(); // Animate the logo on the index page
                    }
                    addFadeInOnClick(); // Add fade-in effect to links
                }).catch(error => {
                    console.error('Error loading header:', error);
                });
        }

        if (footerPlaceholder) {
            fetch('footer.html')
                .then(response => response.text())
                .then(data => {
                    footerPlaceholder.innerHTML = data;
                }).catch(error => {
                    console.error('Error loading footer:', error);
                });
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

    // Register service worker (if applicable)
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js').then((registration) => {
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            }).catch((error) => {
                console.log('ServiceWorker registration failed: ', error);
            });
        });
    }

    addFadeInOnClick(); // Add fade-in effect to links on initial load
});
