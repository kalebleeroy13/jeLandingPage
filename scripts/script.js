// Register service worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/jenergy-web-app/sw.js')
            .then(registration => {
                console.log('ServiceWorker registration successful with scope:', registration.scope);
            })
            .catch(error => {
                console.log('ServiceWorker registration failed:', error);
            });
    });

    // Reload page when a new service worker takes control
    navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('New service worker activated. Reloading page to use updated content.');
        window.location.reload();
    });
}

// Function to toggle the navigation menu
function toggleMenu() {
    const navbar = document.querySelector('.nav-container');
    navbar.classList.toggle('open');
    const isExpanded = navbar.classList.contains('open');
    document.getElementById('menu-icon').setAttribute('aria-expanded', isExpanded);
}

// Add listeners for dropdown navigation
function addDropdownListeners() {
    const dropdownButton = document.querySelector('.dropdown-button');
    const dropdownContent = document.querySelector('.custom-dropdown-menu');

    function handleDropdownToggle(event) {
        event.preventDefault();
        const expanded = dropdownButton.getAttribute('aria-expanded') === 'true' || false;
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
                dropdownButton.onclick = null;
            }
        }
    }

    window.addEventListener('resize', checkViewport);
    checkViewport();
}

// Function to toggle the visibility of steps on small devices
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

function createLoadingOverlay() {
    // Check if the overlay already exists to prevent duplication
    if (document.getElementById('loading-overlay')) {
        console.log('Loading overlay already exists. Skipping creation.');
        return;
    }

    // Log the creation for debugging purposes
    console.log('Creating loading overlay at', new Date().toISOString());

    // Create the overlay element
    const overlay = document.createElement('div');
    overlay.id = 'loading-overlay';
    overlay.innerHTML = `
        <div id="rising-sun-container">
            <div id="rising-sun"></div>
        </div>
    `;

    // Prepend the overlay to the document body
    document.body.prepend(overlay);
}


// Function to remove the loading overlay
function removeLoadingOverlay() {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
        overlay.style.display = 'none'; // Hides the overlay
        overlay.remove(); // Removes it from the DOM (optional)
    }
}

// Lazy loading for images
function enableLazyLoading() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.setAttribute('loading', 'lazy');
    });
}

// Fetch and insert header/footer content
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

// Load header and footer dynamically
function loadHeaderFooter() {
    const headerPlaceholder = document.getElementById('header-placeholder');
    const footerPlaceholder = document.getElementById('footer-placeholder');

    if (headerPlaceholder) {
        fetchAndSetInnerHTML('header.html', headerPlaceholder);
    }
    if (footerPlaceholder) {
        fetchAndSetInnerHTML('footer.html', footerPlaceholder);
    }
}

// Form validation
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

// Detect offline/online status
function handleNetworkStatus() {
    window.addEventListener('offline', () => {
        console.log('You are now offline.');
        alert('You appear to be offline. Some features may not be available.');
    });

    window.addEventListener('online', () => {
        console.log('Back online!');
        alert('You are back online. Enjoy full functionality!');
    });
}

// Initialize all event listeners
document.addEventListener('DOMContentLoaded', function () {
    enableLazyLoading();
    loadHeaderFooter();
    toggleSteps();
    handleNetworkStatus();

    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', function (event) {
            if (!validateForm()) {
                event.preventDefault();
            }
        });
    }

    // Remove the loading overlay after animation
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
        overlay.addEventListener('animationend', () => removeLoadingOverlay());
        setTimeout(() => removeLoadingOverlay(), 5000); // Fallback after 5 seconds
    }

    // Handle page transitions
    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', (event) => {
            const href = link.getAttribute('href');
            if (
                href &&
                href.startsWith('/') &&
                !href.startsWith('#') &&
                !href.startsWith('javascript:') &&
                !link.hasAttribute('download') &&
                !link.hasAttribute('data-no-transition')
            ) {
                event.preventDefault();
                document.body.classList.remove('fade-in');
                document.body.classList.add('fade-out');
                setTimeout(() => {
                    window.location.href = href;
                }, 500);
            }
        });
    });
});
