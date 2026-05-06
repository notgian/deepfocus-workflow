// Create project
const createForm = document.getElementById('project-create-form')

createForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(createForm);

    const projectName = formData.get('projectName')
    const projectDesc = formData.get('projectDesc')

    if (projectName == '')
        return alert('Please enter a project name.')

    const res = await fetch('/projects', {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            projectName: projectName,
            projectDesc: projectDesc
        })
    });

    const returnData = await res.json()
    alert(returnData.message)
    if (res.status == 200)
        window.location.reload()
})

const createModal = document.getElementsByClassName('project-create-modal')[0]

function closeProjectModal() {
    createModal.style.display = 'none'
    createModal.style.opacity = '0%'
}

function openProjectModal() {
    createModal.style.display = 'flex'
    createModal.style.opacity = '100%'

    let inputs = createForm.getElementsByTagName('input')
    let textareas = createForm.getElementsByTagName('textarea')

    for (let input of inputs) {
        input.value = '';
    }
    for (let textarea of textareas) {
        textarea.value = '';
    }
}

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
