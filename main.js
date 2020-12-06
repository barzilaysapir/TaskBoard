let taskTextBox = document.getElementById("taskTextBox");
let date = document.getElementById("date");
let time = document.getElementById("time");
let addNoteBtn = document.getElementById("addNoteBtn");
let notesSection = document.getElementById("notesSection");


document.addEventListener('DOMContentLoaded', loadSavedNotes);
clearBtn.addEventListener('click', resetInputs);
addNoteBtn.addEventListener('click', addNote);
notesSection.addEventListener('click', removeNote);


function resetInputs() {
    taskTextBox.value = "";
    date.value = "";
    time.value = "";
}

function addNote(e) {
    e.preventDefault();
    if(!validateInputs(taskTextBox, date)){
        return;
    }

    let noteDiv = document.createElement("div");
    noteDiv.classList.add("note");
    noteDiv.style.display = "inline-block";
    noteDiv.innerHTML = "<i id=\"removeNoteButton\" class=\"fas fa-times\"></i>";
    notesSection.append(noteDiv);
    
    let noteTask = document.createElement("p");
    noteTask.classList.add("noteText");
    noteTask.innerText = taskTextBox.value;
    
    let noteDeadline = document.createElement("p");
    noteDeadline.classList.add("noteDeadline");
    noteDeadline.innerText = date.value + " " + time.value;
    noteDiv.append(noteTask, noteDeadline);
    
    note = {
        taskTextBox: taskTextBox.value,
        date: date.value,
        time: time.value
    }

    saveToStorage(note);
    resetInputs();
}

function validateInputs(task, date) {
    if (task.value.trim() == "") {
        alert("You can't add an empty task!");
        return false;
    } else if (date.value == "") {
        alert("You must add a date.");
        return false;
    }
    return true;
}

function saveToStorage(note) {
    let notes = getStorageArray().notes;
    notes.push(note);
    localStorage.setItem("notes", JSON.stringify(notes));
}

function getStorageArray() {
    let notes;
    !localStorage.getItem("notes") ? notes = [] : notes = JSON.parse(localStorage.getItem("notes"));
    return {notes: notes};
}

function removeNote(e) {
    let item = e.target;
    
    if (item.id == 'removeNoteButton') {
        let parent = item.parentElement;
        parent.classList.add("removeAnimation");
        removeFromStorage(parent);
        parent.addEventListener("transitionend", () => parent.remove());    
    }
}

function removeFromStorage(parent) {
    let notes;
    if (localStorage.getItem("notes") === null) {
        notes = [];
    } else {
        notes = JSON.parse(localStorage.getItem("notes"));
    }
    let task = parent.children[2].innerText.trimRight("/n");
    // Remove the value from the original array
    let index = findIndex(notes, task);
    notes.splice(index, 1);
    localStorage.setItem("notes", JSON.stringify(notes));
}

function findIndex(array, value) {
    for (let i = 0; i < array.length; i++) {
      if (array[i].taskTextBox == value) {
        return i;
      }
    }
}

function loadSavedNotes() {
    let notes = getStorageArray().notes;
    notes.forEach((note) => {
    let noteDiv = document.createElement("div");
    noteDiv.classList.add("note");
    noteDiv.style.display = "inline-block";
    noteDiv.innerHTML = "<i id=\"removeNoteButton\" class=\"fas fa-times\"></i>";
    let noteTask = document.createElement("p");
    noteTask.classList.add("noteText");
    noteTask.innerText = note.taskTextBox;
    let noteDeadline = document.createElement("p");
    noteDeadline.classList.add("noteDeadline");
    noteDeadline.innerText = note.date + " " + note.time;
    noteDiv.append(noteDeadline, noteTask);
    notesSection.append(noteDiv);
    });
}