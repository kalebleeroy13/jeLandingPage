// script.js

// Register service worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js') // Updated path to match your structure
            .then(registration => {
                console.log('ServiceWorker registration successful with scope:', registration.scope);
            })
            .catch(error => {
                console.log('ServiceWorker registration failed:', error);
            });
    });
}

function toggleMenu() {
    const navbar = document.querySelector('.nav-container');
    navbar.classList.toggle('open');
    const isExpanded = navbar.classList.contains('open');
    document.getElementById('menu-icon').setAttribute('aria-expanded', isExpanded);
}

function addDropdownListeners() {
    const dropdownButton = document.querySelector('.dropdown-button');
    const dropdownContent = document.querySelector('.custom-dropdown-menu');

    function handleDropdownToggle(event) {
        event.preventDefault();
        let expanded = dropdownButton.getAttribute('aria-expanded') === 'true' || false;
        dropdownButton.setAttribute('aria-expanded', !expanded);
        dropdownContent.classList.toggle('show');
    }

    function checkViewport() {
        const isSmallViewport = window.matchMedia("(max-width: 768px)").matches;

        if (dropdownButton && dropdownContent) {
            if (isSmallViewport) {
                dropdownButton.addEventListener('click', handleDropdownToggle);
            } else {
                dropdownButton.removeEventListener('click', handleDropdownToggle);
                dropdownContent.classList.remove('show');
                dropdownButton.onclick = null; // Ensure "Services" link works on larger screens
            }
        }
    }

    window.addEventListener('resize', checkViewport);
    checkViewport(); // Initial check on page load
}

function toggleSteps() {
    const accordionToggle = document.querySelector('.accordion-toggle');
    const accordionContent = document.querySelector('.accordion-content');

    if (accordionToggle) {
        accordionToggle.addEventListener('click', () => {
            accordionContent.classList.toggle('expanded');
            accordionToggle.setAttribute('aria-expanded', accordionContent.classList.contains('expanded'));
        });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Lazy loading for images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.setAttribute('loading', 'lazy');
    });

    const headerPlaceholder = document.getElementById('header-placeholder');
    const footerPlaceholder = document.getElementById('footer-placeholder');

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
                }
            })
            .catch(error => {
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

    loadHeaderFooter();

    // Determine if we're on the index page
    const isIndexPage = window.location.pathname.includes('index.html') || window.location.pathname === '/';

    if (isIndexPage) {
        // Wait for the end of the sun animation before showing the page
        const sun = document.getElementById('sun');
        if (sun) {
            sun.addEventListener('animationend', () => {
                document.body.classList.add('loaded');
                setTimeout(() => {
                    const loadingOverlay = document.getElementById('loading-overlay');
                    if (loadingOverlay) {
                        loadingOverlay.remove();
                    }
                }, 500);
            });
        } else {
            // Fallback in case the sun element is not found
            window.addEventListener('load', () => {
                document.body.classList.add('loaded');
                const loadingOverlay = document.getElementById('loading-overlay');
                if (loadingOverlay) {
                    loadingOverlay.remove();
                }
            });
        }
    } else {
        // For other pages, add fade-in effect to body on initial load
        document.body.classList.add('fade-in');
    }

    // Add transition effect when clicking on links
    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', (event) => {
            const href = link.getAttribute('href');
            if (href && !href.startsWith('#') && !href.startsWith('javascript:') && !link.hasAttribute('download') && !link.hasAttribute('data-no-transition')) {
                event.preventDefault();
                document.body.classList.remove('fade-in');
                document.body.classList.add('fade-out');
                setTimeout(() => {
                    window.location.href = href;
                }, 500);
            }
        });
    });

    // Form Validation (if applicable)
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', function(event) {
            if (!validateForm()) {
                event.preventDefault();
            }
        });
    }

    function validateForm() {
        let isValid = true;

        const nameField = document.querySelector('input[name="name"]');
        const emailField = document.querySelector('input[name="email"]');
        const phoneField = document.querySelector('input[name="number"]');
        const serviceField = document.querySelector('select[name="service"]');
        const messageField = document.querySelector('textarea[name="message"]');

        document.querySelectorAll('.error-message').forEach(el => el.remove());

        if (nameField && nameField.value.trim() === "") {
            showError(nameField, "Name is required");
            isValid = false;
        }

        if (emailField && emailField.value.trim() === "") {
            showError(emailField, "Email is required");
            isValid = false;
        } else if (emailField && !validateEmail(emailField.value)) {
            showError(emailField, "Please enter a valid email");
            isValid = false;
        }

        if (phoneField && phoneField.value.trim() !== "" && !validatePhone(phoneField.value)) {
            showError(phoneField, "Please enter a valid phone number");
            isValid = false;
        }

        if (serviceField && serviceField.value === "") {
            showError(serviceField, "Please select a service");
            isValid = false;
        }

        if (messageField && messageField.value.trim() === "") {
            showError(messageField, "Message is required");
            isValid = false;
        }

        return isValid;
    }

    function showError(field, message) {
        const error = document.createElement('div');
        error.className = 'error-message';
        error.style.color = 'red';
        error.textContent = message;
        field.parentElement.appendChild(error);
    }

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }

    function validatePhone(phone) {
        const re = /^\+?[0-9\s\-]{7,15}$/;
        return re.test(String(phone));
    }

    // Initialize the toggleSteps function
    toggleSteps();
});
