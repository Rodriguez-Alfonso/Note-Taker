document.addEventListener('DOMContentLoaded', () => {
  const saveNoteBtn = document.querySelector('.save-note');
  const newNoteBtn = document.querySelector('.new-note');
  const clearBtn = document.querySelector('.clear-btn');
  const noteForm = document.querySelector('.note-form');

  const getNotes = async () => {
    const response = await fetch('/api/notes');
    return response.json();
  };

  const saveNote = async (note) => {
    const response = await fetch('/api/notes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(note),
    });
    return response.json();
  };

  const updateNote = async (title, note) => {
    const response = await fetch(`/api/notes/${title}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(note),
    });
    return response.json();
  };

  const deleteNote = async (title) => {
    const response = await fetch(`/api/notes/${title}`, {
      method: 'DELETE',
    });
    return response.json();
  };

  const renderNoteList = async () => {
    const notes = await getNotes();
    const noteList = document.getElementById('list-group');
    noteList.innerHTML = '';

    notes.forEach((note) => {
      const li = document.createElement('li');
      li.classList.add('list-group-item');
      li.innerText = note.title;

      const editBtn = document.createElement('button');
      editBtn.innerText = 'Edit';
      editBtn.classList.add('btn', 'btn-primary', 'btn-sm', 'float-right');
      editBtn.addEventListener('click', () => {
        document.querySelector('.note-title').value = note.title;
        document.querySelector('.note-textarea').value = note.text;
        document.querySelector('.save-note').dataset.editing = note.title;
      });

      const deleteBtn = document.createElement('button');
      deleteBtn.innerText = 'Delete';
      deleteBtn.classList.add('btn', 'btn-danger', 'btn-sm', 'float-right');
      deleteBtn.addEventListener('click', async () => {
        await deleteNote(note.title);
        await renderNoteList();
      });

      li.appendChild(editBtn);
      li.appendChild(deleteBtn);
      li.addEventListener('click', () => {
        document.querySelector('.note-title').value = note.title;
        document.querySelector('.note-textarea').value = note.text;
      });
      noteList.appendChild(li);
    });
  };

  const handleNoteSave = async () => {
    const noteTitle = document.querySelector('.note-title').value;
    const noteText = document.querySelector('.note-textarea').value;
    const editingTitle = document.querySelector('.save-note').dataset.editing;

    if (noteTitle && noteText) {
      const newNote = { title: noteTitle, text: noteText };
      if (editingTitle) {
        await updateNote(editingTitle, newNote);
        delete document.querySelector('.save-note').dataset.editing;
      } else {
        await saveNote(newNote);
      }
      await renderNoteList();
      document.querySelector('.note-title').value = '';
      document.querySelector('.note-textarea').value = '';
    }
  };

  saveNoteBtn.addEventListener('click', handleNoteSave);
  newNoteBtn.addEventListener('click', handleNewNoteView);
  clearBtn.addEventListener('click', renderActiveNote);
  noteForm.addEventListener('input', handleRenderBtns);

  renderNoteList();
});