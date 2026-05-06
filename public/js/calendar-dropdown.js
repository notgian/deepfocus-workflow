function toggleDropdown() {
    const dropdown = document.getElementById("calendar-dropdown");
    dropdown.classList.toggle("show");
}

window.onclick = function(event) {
    if (!event.target.closest('.dropdown')) {
        const dropdown = document.getElementById("calendar-dropdown");
        if (dropdown && dropdown.classList.contains('show')) {
            dropdown.classList.remove('show');
        }
    }
}