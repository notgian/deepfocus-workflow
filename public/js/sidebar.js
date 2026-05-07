const sidebar = document.getElementById("sidebar");
const mainContent = document.querySelector('.main-content');

function closeSidebar() {
    sidebar.style.marginLeft = '-320px';
    mainContent.style.marginLeft = '0px';
}

function openSidebar() {
    sidebar.style.marginLeft = '0px';
    mainContent.style.marginLeft = '320px';
}
