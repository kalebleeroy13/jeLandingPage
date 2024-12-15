document.addEventListener('DOMContentLoaded', function() {
    // Dropdown menu handling
    var dropdown = document.querySelector('.dropdown');
    var dropdownContent = document.querySelector('.custom-dropdown-menu');

    dropdown.addEventListener('mouseover', function() {
        dropdownContent.style.display = 'flex';
    });

    dropdown.addEventListener('mouseout', function(event) {
        if (!dropdown.contains(event.relatedTarget)) {
            dropdownContent.style.display = 'none';
        }
    });

    dropdownContent.addEventListener('mouseover', function() {
        dropdownContent.style.display = 'flex';
    });

    dropdownContent.addEventListener('mouseout', function(event) {
        if (!dropdown.contains(event.relatedTarget)) {
            dropdownContent.style.display = 'none';
        }
    });

    // Load footer
    fetch('footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-placeholder').innerHTML = data;
        });
});

