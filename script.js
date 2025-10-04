document.addEventListener("DOMContentLoaded", () => {
  // Element references
  const form = document.getElementById("todo-form");
  const todoInput = document.getElementById("todo-input");
  const todoDate = document.getElementById("todo-date");
  const todoList = document.getElementById("todo-list");
  const deleteAllBtn = document.getElementById("delete-all");
  const searchInput = document.getElementById("search-input");
  const statTotal = document.getElementById("stat-total");
  const statCompleted = document.getElementById("stat-completed");
  const statPending = document.getElementById("stat-pending");
  const statProgress = document.getElementById("stat-progress");

  let todos = JSON.parse(localStorage.getItem("todos")) || [];
  let searchText = "";

  function saveTodos() {
    localStorage.setItem("todos", JSON.stringify(todos));
  }

  function renderStats() {
    const total = todos.length;
    const completed = todos.filter((t) => t.completed).length;
    const pending = total - completed;
    const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

    statTotal.textContent = total;
    statCompleted.textContent = completed;
    statPending.textContent = pending;
    statProgress.textContent = `${progress}%`;
  }

  function renderTodos() {
    let filteredTodos = todos;
    if (searchText.trim().length > 0) {
      filteredTodos = todos.filter((todo) => todo.text.toLowerCase().includes(searchText.toLowerCase()));
    }
    todoList.innerHTML = "";
    if (filteredTodos.length === 0) {
      todoList.innerHTML = `<tr><td colspan="4" style="text-align:center;color:#b6b8bf;">No tasks found</td></tr>`;
      return;
    }
    filteredTodos.forEach((todo) => {
      const tr = document.createElement("tr");
      // Task
      const tdText = document.createElement("td");
      tdText.textContent = todo.text;
      if (todo.completed) {
        tdText.style.textDecoration = "line-through";
        tdText.style.color = "#bbb";
      }
      tr.appendChild(tdText);
      // Due date
      const tdDate = document.createElement("td");
      tdDate.textContent = todo.date;
      tr.appendChild(tdDate);
      // Status
      const tdStatus = document.createElement("td");
      tdStatus.innerHTML = `<span class="status${todo.completed ? " completed" : " pending"}">${todo.completed ? "Completed" : "Pending"}</span>`;
      tr.appendChild(tdStatus);
      // Actions
      const tdActions = document.createElement("td");
      // Complete/pending button
      const compBtn = document.createElement("button");
      compBtn.className = "action-btn";
      compBtn.textContent = todo.completed ? "↺" : "✓";
      compBtn.title = todo.completed ? "Mark as pending" : "Mark as completed";
      compBtn.onclick = () => toggleComplete(todo.id);
      tdActions.appendChild(compBtn);
      // Delete button
      const delBtn = document.createElement("button");
      delBtn.className = "action-btn";
      delBtn.textContent = "🗑";
      delBtn.title = "Delete";
      delBtn.onclick = () => deleteTodo(todo.id);
      tdActions.appendChild(delBtn);

      tr.appendChild(tdActions);
      todoList.appendChild(tr);
    });
  }

  function addTodo(text, date) {
    if (!text.trim()) {
      alert("Task cannot be empty!");
      return;
    }
    if (!date) {
      alert("Please choose due date!");
      return;
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const taskDate = new Date(date);
    if (taskDate < today) {
      alert("Due date cannot be in the past.");
      return;
    }
    todos.push({
      id: Date.now().toString(),
      text,
      date,
      completed: false,
    });
    saveTodos();
    renderTodos();
    renderStats();
    form.reset();
  }

  function toggleComplete(id) {
    const idx = todos.findIndex((t) => t.id === id);
    if (idx !== -1) {
      todos[idx].completed = !todos[idx].completed;
      saveTodos();
      renderTodos();
      renderStats();
    }
  }

  function deleteTodo(id) {
    todos = todos.filter((t) => t.id !== id);
    saveTodos();
    renderTodos();
    renderStats();
  }

  function deleteAll() {
    if (confirm("Are you sure to delete all tasks?")) {
      todos = [];
      saveTodos();
      renderTodos();
      renderStats();
    }
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    addTodo(todoInput.value, todoDate.value);
  });

  deleteAllBtn.addEventListener("click", deleteAll);

  searchInput.addEventListener("input", (e) => {
    searchText = e.target.value;
    renderTodos();
  });

  // Initial
  renderTodos();
  renderStats();
});
