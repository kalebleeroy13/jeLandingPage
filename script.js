function toggleMenu() {
    const nav = document.querySelector('nav ul');
    nav.classList.toggle('open');
    // Update the aria-expanded attribute
    const isExpanded = nav.classList.contains('open');
    document.getElementById('menu-icon').setAttribute('aria-expanded', isExpanded);
}

document.addEventListener('DOMContentLoaded', function() {
    // Dynamically add lazy loading to all images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.setAttribute('loading', 'lazy');
    });

    const dropdown = document.querySelector('.dropdown');
    const dropdownContent = document.querySelector('.custom-dropdown-menu');
    const headerPlaceholder = document.getElementById('header-placeholder');
    const footerPlaceholder = document.getElementById('footer-placeholder');
    const navbarToggle = document.querySelector('.navbar-toggle');

    function addDropdownListeners() {
        if (dropdown && dropdownContent) {
            const showDropdown = () => dropdownContent.classList.add('show');
            const hideDropdown = (event) => {
                if (!dropdown.contains(event.relatedTarget)) {
                    dropdownContent.classList.remove('show');
                }
            };

            dropdown.addEventListener('mouseover', showDropdown);
            dropdown.addEventListener('mouseout', hideDropdown);
            dropdownContent.addEventListener('mouseover', showDropdown);
            dropdownContent.addEventListener('mouseout', hideDropdown);
        }
    }

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
});
