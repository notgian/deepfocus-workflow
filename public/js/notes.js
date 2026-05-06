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
    
    const notesSidebar = document.getElementsByClassName("notes-sidebar")[0];
    const activeNoteId = notesSidebar.getAttribute("data-active-note")

    for (let note of notes) {
        let active = activeNoteId && activeNoteId == note._id
        notesSidebar.innerHTML += `
            <span data-noteid="${note._id}" class="note-sidebar-item note-item ${active ? 'active' : ''}">
               ${note.title}
            </span>
        `
    }
}

document.addEventListener("DOMContentLoaded", async (e) => {
    await listNotes()
})

