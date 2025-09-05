let draggedTask = null;

function saveTasks() {
  const columns = ['todo', 'inProgress', 'done'];
  const data = {};
  columns.forEach(id => {
    const col = document.getElementById(id);
    const tasks = Array.from(col.querySelectorAll('.task')).map(task => ({
      text: task.querySelector('span').textContent,
      done: task.classList.contains('done')
    }));
    data[id] = tasks;
  });
  localStorage.setItem('tasks', JSON.stringify(data));
}

function loadTasks() {
  const data = JSON.parse(localStorage.getItem('tasks'));
  if (!data) return;
  for (let col in data) {
    data[col].forEach(t => {
      const task = createTaskElement(t.text, t.done);
      document.getElementById(col).appendChild(task);
    });
  }
}

function createTaskElement(text, done = false) {
  const task = document.createElement("div");
  task.className = "task";
  task.draggable = true;
  task.ondragstart = () => draggedTask = task;

  const content = document.createElement("span");
  content.textContent = text;

  const buttons = document.createElement("div");
  buttons.className = "task-buttons";

  const btnEdit = document.createElement("button");
  btnEdit.textContent = "✏️";
  btnEdit.className = "btn-edit";
  btnEdit.onclick = () => {
    const newText = prompt("Editar tarefa:", content.textContent);
    if (newText) {
      content.textContent = newText;
      saveTasks();
    }
  };

  const btnDone = document.createElement("button");
  btnDone.textContent = "✅";
  btnDone.className = "btn-done";
  btnDone.onclick = () => {
    task.classList.toggle("done");
    document.getElementById("done").appendChild(task);
    saveTasks();
  };

  const btnDelete = document.createElement("button");
  btnDelete.textContent = "🗑️";
  btnDelete.className = "btn-delete";
  btnDelete.onclick = () => {
    task.remove();
    saveTasks();
  };

  buttons.appendChild(btnEdit);
  buttons.appendChild(btnDone);
  buttons.appendChild(btnDelete);

  task.appendChild(content);
  task.appendChild(buttons);

  if (done) {
    task.classList.add("done");
  }

  return task;
}

function addTask() {
  const input = document.getElementById("taskInput");
  const text = input.value.trim();
  if (text === "") return;

  const task = createTaskElement(text);
  document.getElementById("todo").appendChild(task);
  input.value = "";

  saveTasks();
}

function allowDrop(event) {
  event.preventDefault();
}

function drop(event) {
  event.preventDefault();
  if (draggedTask) {
    event.currentTarget.appendChild(draggedTask);
    draggedTask = null;
    saveTasks();
  }
}

// === Função genérica para criar itens de lista (comentários/lembretes) ===
function createListItem(text, type) {
  const li = document.createElement("li");

  const span = document.createElement("span");
  span.textContent = text;

  const btnDelete = document.createElement("button");
  btnDelete.textContent = "❌";
  btnDelete.onclick = () => {
    li.remove();
    if (type === "reminders") saveReminders();
    if (type === "comments") saveComments();
  };

  li.appendChild(span);
  li.appendChild(btnDelete);

  return li;
}

// === Lembretes ===
function addReminder() {
  const input = document.getElementById("reminderInput");
  const text = input.value.trim();
  if (text === "") return;

  const list = document.getElementById("reminderList");
  const li = createListItem(text, "reminders");
  list.appendChild(li);

  saveReminders();
  input.value = "";
}

function saveReminders() {
  const items = Array.from(document.querySelectorAll("#reminderList li span")).map(span => span.textContent);
  localStorage.setItem("reminders", JSON.stringify(items));
}

function loadReminders() {
  const data = JSON.parse(localStorage.getItem("reminders")) || [];
  const list = document.getElementById("reminderList");
  data.forEach(text => {
    const li = createListItem(text, "reminders");
    list.appendChild(li);
  });
}

// === Comentários ===
function addComment() {
  const input = document.getElementById("commentInput");
  const text = input.value.trim();
  if (text === "") return;

  const list = document.getElementById("commentList");
  const li = createListItem(text, "comments");
  list.appendChild(li);

  saveComments();
  input.value = "";
}

function saveComments() {
  const items = Array.from(document.querySelectorAll("#commentList li span")).map(span => span.textContent);
  localStorage.setItem("comments", JSON.stringify(items));
}

function loadComments() {
  const data = JSON.parse(localStorage.getItem("comments")) || [];
  const list = document.getElementById("commentList");
  data.forEach(text => {
    const li = createListItem(text, "comments");
    list.appendChild(li);
  });
}

// === Accordion (caixa suspensa) ===
function toggleAccordion(button) {
  const panel = button.nextElementSibling;
  panel.style.display = panel.style.display === "block" ? "none" : "block";
}

// === Carregar tudo ao iniciar ===
loadTasks();
loadReminders();
loadComments();
