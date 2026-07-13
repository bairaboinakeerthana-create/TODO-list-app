const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const filterButtons = document.querySelectorAll('.filter-btn');
const totalCount = document.getElementById('totalCount');
const activeCount = document.getElementById('activeCount');
const completedCount = document.getElementById('completedCount');
const clearCompletedBtn = document.getElementById('clearCompletedBtn');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function updateCounts() {
  totalCount.textContent = tasks.length;
  activeCount.textContent = tasks.filter(task => !task.completed).length;
  completedCount.textContent = tasks.filter(task => task.completed).length;
}

function getFilteredTasks() {
  if (currentFilter === 'active') {
    return tasks.filter(task => !task.completed);
  }

  if (currentFilter === 'completed') {
    return tasks.filter(task => task.completed);
  }

  return tasks;
}

function renderTasks() {
  const filteredTasks = getFilteredTasks();
  taskList.innerHTML = '';

  if (filteredTasks.length === 0) {
    taskList.innerHTML = '<p class="empty-message">No tasks found.</p>';
    updateCounts();
    return;
  }

  filteredTasks.forEach(task => {
    const li = document.createElement('li');
    li.className = 'task-item';
    li.dataset.id = task.id;

    li.innerHTML = `
      <div class="task-left">
        <span class="task-text ${task.completed ? 'completed' : ''}">${task.text}</span>
      </div>
      <div class="task-actions">
        <button class="complete-btn">${task.completed ? 'Undo' : 'Complete'}</button>
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
      </div>
    `;

    taskList.appendChild(li);
  });

  updateCounts();
}

function addTask() {
  const text = taskInput.value.trim();

  if (text === '') {
    alert('Please enter a task.');
    return;
  }

  const newTask = {
    id: Date.now().toString(),
    text,
    completed: false,
  };

  tasks.push(newTask);
  saveTasks();
  renderTasks();
  taskInput.value = '';
}

function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
  renderTasks();
}

function toggleTask(id) {
  tasks = tasks.map(task =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );
  saveTasks();
  renderTasks();
}

function editTask(id) {
  const taskItem = document.querySelector(`[data-id="${id}"]`);
  const task = tasks.find(task => task.id === id);

  taskItem.innerHTML = `
    <input type="text" class="edit-input" value="${task.text}" />
    <div class="task-actions">
      <button class="save-btn">Save</button>
      <button class="cancel-btn">Cancel</button>
    </div>
  `;

  const editInput = taskItem.querySelector('.edit-input');
  editInput.focus();

  taskItem.querySelector('.save-btn').addEventListener('click', () => {
    const updatedText = editInput.value.trim();

    if (updatedText === '') {
      alert('Task cannot be empty.');
      return;
    }

    tasks = tasks.map(task =>
      task.id === id ? { ...task, text: updatedText } : task
    );

    saveTasks();
    renderTasks();
  });

  taskItem.querySelector('.cancel-btn').addEventListener('click', renderTasks);
}

addTaskBtn.addEventListener('click', addTask);

taskInput.addEventListener('keypress', event => {
  if (event.key === 'Enter') {
    addTask();
  }
});

taskList.addEventListener('click', event => {
  const taskItem = event.target.closest('.task-item');
  if (!taskItem) return;

  const id = taskItem.dataset.id;

  if (event.target.classList.contains('delete-btn')) {
    deleteTask(id);
  } else if (event.target.classList.contains('complete-btn')) {
    toggleTask(id);
  } else if (event.target.classList.contains('edit-btn')) {
    editTask(id);
  }
});

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    filterButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    currentFilter = button.dataset.filter;
    renderTasks();
  });
});

clearCompletedBtn.addEventListener('click', () => {
  tasks = tasks.filter(task => !task.completed);
  saveTasks();
  renderTasks();
});

renderTasks();