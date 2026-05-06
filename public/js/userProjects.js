
const sidebar = document.getElementById("sidebar");

function closeSidebar() {
    sidebar.style.marginLeft = '-320px';
}

function openSidebar() {
    sidebar.style.marginLeft = '0px';
}

function openProject(el) {
    let pid = el.getAttribute('data-pid')
    console.log(pid)

    window.location.href = `/project/open?pid=${pid}`
}
