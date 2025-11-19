const API_URL = '/api/todos';

let todos = [];

// DOM Elements
const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const totalCount = document.getElementById('totalCount');
const completedCount = document.getElementById('completedCount');

// Event Listeners
addBtn.addEventListener('click', addTodo);
todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTodo();
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadTodos();
});

// Load all todos from API
async function loadTodos() {
    try {
        showLoading();
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        todos = await response.json();
        renderTodos();
    } catch (error) {
        console.error('Error loading todos:', error);
        showError('Nie udało się załadować zadań. Sprawdź połączenie z API.');
    }
}

// Add new todo
async function addTodo() {
    const title = todoInput.value.trim();
    
    if (!title) {
        alert('Wpisz treść zadania!');
        return;
    }

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: title,
                isCompleted: false
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const newTodo = await response.json();
        todos.push(newTodo);
        todoInput.value = '';
        renderTodos();
    } catch (error) {
        console.error('Error adding todo:', error);
        showError('Nie udało się dodać zadania.');
    }
}

// Toggle todo completion
async function toggleTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...todo,
                isCompleted: !todo.isCompleted
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const updatedTodo = await response.json();
        const index = todos.findIndex(t => t.id === id);
        todos[index] = updatedTodo;
        renderTodos();
    } catch (error) {
        console.error('Error updating todo:', error);
        showError('Nie udało się zaktualizować zadania.');
    }
}

// Delete todo
async function deleteTodo(id) {
    if (!confirm('Czy na pewno chcesz usunąć to zadanie?')) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        todos = todos.filter(t => t.id !== id);
        renderTodos();
    } catch (error) {
        console.error('Error deleting todo:', error);
        showError('Nie udało się usunąć zadania.');
    }
}

// Render todos to DOM
function renderTodos() {
    todoList.innerHTML = '';
    
    if (todos.length === 0) {
        todoList.innerHTML = '<div class="loading">Brak zadań. Dodaj nowe!</div>';
    } else {
        todos.forEach(todo => {
            const todoItem = createTodoElement(todo);
            todoList.appendChild(todoItem);
        });
    }

    updateStats();
}

// Create todo DOM element
function createTodoElement(todo) {
    const div = document.createElement('div');
    div.className = `todo-item ${todo.isCompleted ? 'completed' : ''}`;
    
    // Create checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'todo-checkbox';
    checkbox.checked = todo.isCompleted;
    checkbox.addEventListener('change', () => toggleTodo(todo.id));
    
    // Create text span
    const textSpan = document.createElement('span');
    textSpan.className = 'todo-text';
    textSpan.textContent = todo.title;
    
    // Create delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = 'Usuń';
    deleteBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        deleteTodo(todo.id);
    });
    
    // Append elements
    div.appendChild(checkbox);
    div.appendChild(textSpan);
    div.appendChild(deleteBtn);
    
    return div;
}

// Update statistics
function updateStats() {
    const total = todos.length;
    const completed = todos.filter(t => t.isCompleted).length;
    
    totalCount.textContent = `Wszystkich: ${total}`;
    completedCount.textContent = `Ukończonych: ${completed}`;
}

// Show loading state
function showLoading() {
    todoList.innerHTML = '<div class="loading">Ładowanie...</div>';
}

// Show error message
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error';
    errorDiv.textContent = message;
    
    todoList.parentElement.insertBefore(errorDiv, todoList);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}
