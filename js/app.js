// Starting project
getTodoList();

// Instances
const inputTodo = document.querySelector('.input-todo');

let arrayTodoList = [];



// Events
document.querySelector('.toggle-mode').addEventListener('click', toggleMode);

document.querySelector('.form-todo').addEventListener('submit', function(e) {
    e.preventDefault();

    if (!localStorage.getItem('todoEdit')) {
        addTodo(inputTodo.value);
    } else {
        updateTodo(inputTodo.value, localStorage.getItem('todoEdit'));
    }
    inputTodo.value = "";
    getTodoList();
});

// Functions
function toggleMode() {
    const body = document.querySelector('body');

    if (body.classList.contains('light-theme')) {
        body.classList.replace('light-theme', 'dark-theme');
        document.querySelector('.img-toggle-mode').src = "./images/icon-sun.svg"
    } else {
        body.classList.replace('dark-theme', 'light-theme');
        document.querySelector('.img-toggle-mode').src = "./images/icon-moon.svg"
    }
}

function addTodo(contentTodo = "") {

    let idTodo = createId();

    const todoAux = {
        id: idTodo,
        content: contentTodo,
        complete: false,
    }

    if (getTodoListLS() === false) {
        arrayTodoList.push(todoAux);
        localStorage.setItem('todoList', JSON.stringify(arrayTodoList));
    } else {
        arrayTodoList = getTodoListLS();
        arrayTodoList.push(todoAux);
        localStorage.setItem('todoList', JSON.stringify(arrayTodoList));
    }
}

function getTodoList() {

    let todoList = getTodoListLS();

    if (todoList === false) {
        return
    } else {
        let all = document.querySelector('.all');
        let active = document.querySelector('.active');
        let complete = document.querySelector('.complete');

        if (complete.classList.contains('opt-active')) {
            complete.classList.remove('opt-active')
        }

        if (active.classList.contains('opt-active')) {
            active.classList.remove('opt-active')
        }

        all.classList.add('opt-active')
        createHTML(todoList);

    }

}

function createHTML(todoList) {
    document.querySelector('.todo-list').innerHTML = '';

    document.querySelector('.cant-todo').innerHTML = `${todoList.length} items left`
    let html = '';

    todoList.forEach((todo) => {
        html += `
        <div class="todo-card ${ todo.complete === true ? 'complete' : '' }" id="todo${todo.id}">
            <div class="check-box-card">
                <button class="check-card" onclick="completeTodo(${todo.id})">
                    <img src="./images/icon-check.svg" alt="">
                </button>
            </div>
            <div class="todo-content-box" onclick="getTodoOnForm('${todo.content}', ${todo.id})">
                <p class="todo-content">${todo.content}</p>
            </div>
            <div class="cross-box" onclick="deleteTodo(${todo.id})">
                <img src="./images/icon-cross.svg" alt="">
            </div>
        </div>
        `
    })

    document.querySelector('.todo-list').innerHTML = html;
}

function createId() {
    const date = new Date()

    return date.getMilliseconds();
}

function getTodoListLS() {

    if (localStorage.getItem('todoList')) {
        return JSON.parse(localStorage.getItem('todoList'));
    } else {
        return false;
    }

}



function completeTodo(todoId) {
    const elementTodo = document.querySelector(`#todo${todoId}`);

    let todoList = getTodoListLS();

    if (elementTodo.classList.contains('complete')) {
        elementTodo.classList.remove('complete')

        todoList.forEach((todo) => {
            if (todo.id === todoId) {
                todo.complete = false;
            }
        })

        localStorage.setItem('todoList', JSON.stringify(todoList));

    } else {
        elementTodo.classList.add('complete');
        todoList.forEach((todo) => {
            if (todo.id === todoId) {
                todo.complete = true;
            }
        })
        localStorage.setItem('todoList', JSON.stringify(todoList));

    }
}

function updateTodo(todoContent, todoId) {

    let todoList = getTodoListLS();

    todoList.forEach(todo => {
        if (todo.id == todoId) {
            todo.content = todoContent;
        }
    })

    localStorage.setItem('todoList', JSON.stringify(todoList));
    localStorage.removeItem('todoEdit');
    getTodoList()
}

function deleteTodo(todoId) {

    let todoList = getTodoListLS();
    let positionTodo = 0;
    console.log(todoId);

    todoList.forEach((todo, index) => {
        if (todo.id === todoId) {
            positionTodo = index;
        }
    })
    todoList.splice(positionTodo, 1)

    localStorage.setItem('todoList', JSON.stringify(todoList));

    getTodoList();
}

function getTodoListActive() {

    let todoList = getTodoListLS(),
        todoListActive = [];

    let all = document.querySelector('.all');
    let active = document.querySelector('.active');
    let complete = document.querySelector('.complete');

    if (all.classList.contains('opt-active')) {
        all.classList.remove('opt-active')
    }

    if (complete.classList.contains('opt-active')) {
        complete.classList.remove('opt-active')
    }

    active.classList.add('opt-active')

    todoListActive = todoList.filter(todo => todo.complete === false);
    createHTML(todoListActive);
}

function getTodoListComplete() {

    let todoList = getTodoListLS(),
        todoListComplete;

    let all = document.querySelector('.all');
    let active = document.querySelector('.active');
    let complete = document.querySelector('.complete');

    if (all.classList.contains('opt-active')) {
        all.classList.remove('opt-active')
    }

    if (active.classList.contains('opt-active')) {
        active.classList.remove('opt-active')
    }

    complete.classList.add('opt-active')
    todoListComplete = todoList.filter(todo => todo.complete === true);
    createHTML(todoListComplete);
}

function clearCompleted() {
    let todoList = getTodoListLS(),
        newTodoList = [];

    newTodoList = todoList.filter(todo => todo.complete === false);
    console.log(newTodoList);
    localStorage.setItem('todoList', JSON.stringify(newTodoList));
    getTodoList();
}

function getTodoOnForm(todoContent, todoId) {
    localStorage.setItem('todoEdit', todoId)
    inputTodo.value = todoContent;
}