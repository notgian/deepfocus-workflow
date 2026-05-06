const notesSidebar = document.getElementsByClassName("notes-sidebar")[0];

async function listNotes() {
    const noteItems = document.getElementsByClassName("note-item")
    while (noteItems.length > 0) {
        noteItems[0].remove();
    }

    const notesRes = await fetch('/notes/list', {
        method: "GET"
    });

    const notesResJson = await notesRes.json()
    const notes = notesResJson.data
    
    const activeNoteId = notesSidebar.getAttribute("data-active-note")

    for (let note of notes) {
        let active = activeNoteId && activeNoteId == note._id
        notesSidebar.innerHTML += `
            <span data-noteid="${note._id}" class="note-sidebar-item note-item ${active ? 'active' : ''}" onclick=openNote(this)>
               ${note.title}
            </span>
        `
    }
}

async function openNote(el) {
    // Setting active states
    const lastActiveNoteId = notesSidebar.getAttribute("data-active-note")

    let lastActiveNote = notesSidebar.querySelector(`[data-noteid="${lastActiveNoteId}"]`)
    lastActiveNote?.classList?.remove('active')

    const noteId = el.getAttribute('data-noteid') 
    notesSidebar.setAttribute('data-active-note', noteId)
    el.classList.add('active')

    //Opening the note on the side
    //Get note data to display
    showNote(noteId)
}

async function showNote(noteId) {
    const notesRes = await fetch('/notes/'+noteId, {
        method: "GET"
    });

    const notesResJson = await notesRes.json();
    const note = notesResJson.data;

    const noteTitle = document.querySelector('.notes-title');
    const noteContent = document.querySelector('.notes-textarea');

    noteTitle.value = note.title;
    noteContent.value = note.content;

    document.querySelector('.notes-area-inactive').style.display = 'none';
    document.querySelector('.notes-area-active').style.display = 'flex';
}

async function closeNote() {
    document.querySelector('.notes-area-inactive').style.display = 'block';
    document.querySelector('.notes-area-active').style.display = 'none';
}

document.addEventListener("DOMContentLoaded", async (e) => {
    await listNotes()
})

async function saveNote() {
    const activeNoteId = notesSidebar.getAttribute("data-active-note")
    const title = document.querySelector('.notes-title')
    const content = document.querySelector('.notes-textarea')

    const res = await fetch('/notes/edit/'+activeNoteId, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify({
            title: title.value,
            content: content.value
        })
    })
}

async function deleteNote() {
    const confirmDelete = confirm("Are you sure you want to delete this note?");
    if (!confirmDelete)
        return;

    const activeNoteId = notesSidebar.getAttribute("data-active-note");

    const res = await fetch('/notes/delete/'+activeNoteId, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: "POST",
    });

    const resJson = await res.json();

    alert(resJson?.message || "Something went wrong...")

    if (res.status == 200)
        window.location.reload();
}

async function createNote() {
    const title = prompt("Enter a name for the note: ");

    const res = await fetch('/notes/', {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify({
            title: title,
        })
    });

    const resJson = await res.json();
    alert(resJson?.message || "Something went wrong")
    if (res.status == 200)
        await listNotes();
}


document.querySelector('.notes-title').addEventListener('focusout', async (e) => {
    await saveNote();
})
