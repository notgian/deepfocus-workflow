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

function openProject(el) {
    let pid = el.getAttribute('data-pid')
    console.log(pid)

    window.location.href = `/project/open?pid=${pid}`
}

async function deleteProject(id, name) {
    name = name.trim()
    const delConfirm1 = confirm(`Are you sure you want to delete the project '${name}'`)
    if (!delConfirm1)
        return
    
    const enterConfirm = prompt(`Please enter the name of the project, '${name},' to confirm its deletion.`)
    if (enterConfirm.trim() != name)
        return alert(`Incorrect name provided. Cannot delete the project '${name}'`)

    const res = await fetch('/projects/'+id, {
        method: 'DELETE'
    });

    const resJson = await res.json();
    alert(resJson.message);

    if (res.status == 200)
        window.location.reload();
}
