document.addEventListener('DOMContentLoaded', () => {
    //const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');
    let tasks = [];
    let isEditing = false;
    let editingId = null;
    /*
        taskForm.addEventListener('click', (e) => {
            const vti = taskInput.value.trim();
            if (vti !== '') {
                if (isEditing) {
                    tasks = tasks.map(task =>
                        task.id == editingId ? {
                            ...task, text: vti
                        } : task);
                    isEditing = false;
                    editingId = null;
                    taskForm.innerText = "Agregar";
                }
                else {
                    const task = {
                        id: Date.now(),
                        text: vti,
                        complete: false
                    };
                    tasks.push(task);
                    console.log(tasks);
                }
                renderTasks();
                taskInput.value = '';
            }
        });
    */
    function renderTasks() {
        console.log("Runing");

        fetch('server/user/session_info.php')
            .then(res => res.json())
            .then(data => {
                if (data.user_id) {
                    console.log('Sesión activa para usuario:', data.user_id);
                    fetch('server/task/index.php?user_id=' + user_id)
                        .then(response => response.json())
                        .then(tks => {
                            console.log(tks);
                            tks.forEach(task => {
                                const li = document.createElement('li');
                                li.classList.toggle('completed', task.completed); // Agrega la clase solo si está completa

                                let buttons =
                                    '<button class="complete-btn" onclick="completeTask(' + task.id + ')">' +
                                    (task.completed ? 'Deshacer' : 'Completar') + '</button>';

                                if (!task.completed) {
                                    buttons +=
                                        '<button class="edit-btn" onclick="editTask(' + task.id + ')">Editar</button>' +
                                        '<button class="delete-btn" onclick="deleteTask(' + task.id + ')">Eliminar</button>';
                                }

                                li.innerHTML = '<span>' + task.title + '</span><div>' + buttons + '</div>';
                                taskList.appendChild(li);
                            }
                            );
                        });
                } else {
                    console.warn(data.error);
                    window.location.href = 'login.php';
                }
            });


        taskList.innerHTML = '';
        tasks.forEach(task => {
            const li = document.createElement('li');
            li.classList.toggle('completed', task.complete); // Agrega la clase solo si está completa

            let buttons =
                '<button class="complete-btn" onclick="completeTask(' + task.id + ')">' +
                (task.complete ? 'Deshacer' : 'Completar') + '</button>';

            if (!task.complete) {
                buttons +=
                    '<button class="edit-btn" onclick="editTask(' + task.id + ')">Editar</button>' +
                    '<button class="delete-btn" onclick="deleteTask(' + task.id + ')">Eliminar</button>';
            }

            li.innerHTML = '<span>' + task.text + '</span><div>' + buttons + '</div>';
            taskList.appendChild(li);
        });
    }


    window.deleteTask = function (id) {
        tasks = tasks.filter(task => task.id !== id);
        renderTasks();
    }
    window.editTask = function (id) {
        const et = tasks.find(t => t.id == id);
        if (et) {
            taskInput.value = et.text;
            taskForm.innerText = "Guardar";
            isEditing = true;
            editingId = et.id;
        }
    }
    window.completeTask = function (id) {
        tasks = tasks.map(task =>
            task.id === id ? { ...task, complete: !task.complete } : task
        );
        renderTasks();
    };


    renderTasks();
});