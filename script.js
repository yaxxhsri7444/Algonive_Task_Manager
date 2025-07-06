// Select elements
const taskForm = document.getElementById("task-form");
const titleInput = document.getElementById("title");
const descInput = document.getElementById("description");
const dueInput = document.getElementById("due-date");
const taskList = document.getElementById("task-list");
const filterSelect = document.getElementById("filter");

// Load tasks on page load
document.addEventListener("DOMContentLoaded", loadTasks);

// Form submission
taskForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const task = {
    id: Date.now(),
    title: titleInput.value,
    description: descInput.value,
    dueDate: dueInput.value,
    completed: false,
  };

  saveTask(task);
  addTaskToUI(task);
  taskForm.reset();
});

// Filter tasks
filterSelect.addEventListener("change", loadTasks);

// Save task to localStorage
function saveTask(task) {
  const tasks = getTasksFromStorage();
  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Get all tasks from localStorage
function getTasksFromStorage() {
  return JSON.parse(localStorage.getItem("tasks")) || [];
}

// Load and display tasks based on filter
function loadTasks() {
  const tasks = getTasksFromStorage();
  const filter = filterSelect.value;
  taskList.innerHTML = "";

  tasks.forEach((task) => {
    if (
      filter === "all" ||
      (filter === "complete" && task.completed) ||
      (filter === "incomplete" && !task.completed)
    ) {
      addTaskToUI(task);
    }

    // Reminder if due today
    const today = new Date().toISOString().split("T")[0];
    if (task.dueDate === today && !task.completed) {
      alert(`⏰ Reminder: "${task.title}" is due today!`);
    }
  });
}

// Add task card to UI
function addTaskToUI(task) {
  const card = document.createElement("div");
  card.className = "task-card" + (task.completed ? " complete" : "");
  card.innerHTML = `
    <h3>${task.title}</h3>
    <p>${task.description}</p>
    <div class="due-date">📅 Due: ${task.dueDate}</div>
    <div class="actions">
      <button class="complete-btn">${task.completed ? "Undo" : "Mark Done"}</button>
      <button class="delete-btn">Delete</button>
    </div>
  `;

  // Complete/Undo button
  card.querySelector(".complete-btn").addEventListener("click", () => {
    toggleComplete(task.id);
  });

  // Delete button
  card.querySelector(".delete-btn").addEventListener("click", () => {
    deleteTask(task.id);
  });

  taskList.appendChild(card);
}

// Toggle completion status
function toggleComplete(id) {
  const tasks = getTasksFromStorage();
  const index = tasks.findIndex((t) => t.id === id);
  tasks[index].completed = !tasks[index].completed;
  localStorage.setItem("tasks", JSON.stringify(tasks));
  loadTasks();
}

// Delete a task
function deleteTask(id) {
  let tasks = getTasksFromStorage();
  tasks = tasks.filter((t) => t.id !== id);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  loadTasks();
}
