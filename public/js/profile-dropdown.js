function toggleProfileDropdown() {
    document.getElementById("profile-dropdown").classList.toggle("show");
}

window.addEventListener('click', function(event) {
    if (!event.target.matches('.avatar')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        for (var i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
});