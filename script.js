document.addEventListener('DOMContentLoaded', function() {
    // Dropdown menu handling
    var dropdown = document.querySelector('.dropdown');
    dropdown.addEventListener('mouseover', function() {
        dropdown.querySelector('.dropdown-content').style.display = 'block';
    });
    dropdown.addEventListener('mouseout', function() {
        dropdown.querySelector('.dropdown-content').style.display = 'none';
    });

    // Additional interactive functionality can be added here
});
