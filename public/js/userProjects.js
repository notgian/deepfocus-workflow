function openProject(el) {
    let pid = el.getAttribute('data-pid')
    console.log(pid)
    window.location.href = `/project/open?pid=${pid}`
}
