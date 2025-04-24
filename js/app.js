document.addEventListener('DOMContentLoaded', () => {
    const taskList = document.getElementById('task-list');
    const form = document.querySelector('form');
    const title = document.getElementById('title');
    const description = document.getElementById('description');
    const due_date = document.getElementById('due_date');
    const completed = document.getElementById('completed');
    const user_id = document.getElementById('user_id');
    const category_id = document.getElementById('category_id');
    const taskIdInput = document.getElementById('task-id');
    const submitBtn = form.querySelector('button[type="submit"]');

    let tasks = [];

    function renderTasks() {
        console.log("Running");

        taskList.innerHTML = '';

        fetch('server/user/session_info.php')
            .then(res => res.json())
            .then(data => {
                if (data.user_id) {
                    console.log('Sesión activa para usuario:', data.user_id);

                    fetch('server/task/index.php?user_id=' + data.user_id)
                        .then(response => response.json())
                        .then(tks => {
                            tasks = tks;
                            tks.forEach(task => {
                                const li = document.createElement('li');
                                li.className = task.completed ? 'completed' : '';

                                let buttons = '';

                                buttons += `<button class="complete-btn" onclick="completeTask(${task.id})">` +
                                    (task.completed ? 'Deshacer' : 'Completar') +
                                    `</button>`;

                                if (!task.completed) {
                                    buttons += `<button class="edit-btn" onclick="editTask(${task.id})">Editar</button>`;
                                    buttons += `<button class="delete-btn" onclick="deleteTask(${task.id})">Eliminar</button>`;
                                }

                                li.innerHTML = `<span>${task.title}</span><div>${buttons}</div>`;
                                taskList.appendChild(li);
                            });
                        });

                    renderCategories(data.user_id);
                    user_id.value = data.user_id;

                    const categoryUserId = document.getElementById('category-user-id');
                    categoryUserId.value = data.user_id;

                    const categoryForm = document.getElementById('category-form');
                    const categoryName = document.getElementById('category-name');

                    categoryForm.addEventListener('submit', function (e) {
                        e.preventDefault();

                        const postData = new URLSearchParams();
                        postData.append('name', categoryName.value);
                        postData.append('user_id', categoryUserId.value);

                        fetch('server/category/create.php', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                            body: postData.toString()
                        })
                            .then(res => res.json())
                            .then(response => {
                                if (response.status === 'ok') {
                                    const uid = categoryUserId.value; // guardar antes de reset
                                    categoryForm.reset();
                                    renderCategories(uid);
                                } else {
                                    alert('Error al crear categoría: ' + response.error);
                                }
                            });
                    });

                } else {
                    console.warn(data.error);
                    window.location.href = 'login.php';
                }
            });
    }

    window.completeTask = function (id) {
        console.log('Completando tarea con ID:', id);
        fetch('server/task/complete.php?id=' + id)
            .then(res => res.json())
            .then(data => {
                console.log('Respuesta del servidor:', data);
                if (data.status === 'ok') renderTasks();
                else alert('Error al completar: ' + data.error);
            })
            .catch(err => console.error('Error al completar:', err));
    };

    window.toggleComplete = function (id, isCompleted) {
        const url = isCompleted
            ? 'server/task/undo.php'
            : 'server/task/complete.php';

        fetch(`${url}?id=${id}`)
            .then(res => {
                if (res.ok) renderTasks();
                else alert('Error al cambiar el estado de la tarea');
            })
            .catch(err => {
                console.error("Error en toggleComplete:", err);
                alert('Error en la operación');
            });
    };

    window.deleteTask = function (id) {
        fetch('server/task/delete.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: 'id=' + id
        })
            .then(res => res.json())
            .then(data => {
                if (data.status === 'ok') renderTasks();
                else alert('Error al eliminar: ' + data.error);
            });
    };

    window.editTask = function (id) {
        const t = tasks.find(task => task.id == id);
        if (t) {
            title.value = t.title;
            description.value = t.description;
            due_date.value = t.due_date;
            completed.checked = t.completed == 1;
            user_id.value = t.user_id;
            category_id.value = t.category_id;
            taskIdInput.value = t.id;
            submitBtn.textContent = 'Guardar cambios';
        }
    };

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const postData = new URLSearchParams();
        postData.append('title', title.value);
        postData.append('description', description.value);
        postData.append('due_date', due_date.value);
        postData.append('completed', completed.checked ? 1 : 0);
        postData.append('user_id', user_id.value);
        postData.append('category_id', category_id.value);

        const id = taskIdInput.value;
        let url = 'server/task/create.php';
        if (id) {
            postData.append('id', id);
            url = 'server/task/update.php';
        }

        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: postData.toString()
        })
            .then(res => res.json())
            .then(response => {
                if (response.status === 'ok') {
                    form.reset();
                    taskIdInput.value = '';
                    submitBtn.textContent = 'Enviar';
                    renderTasks();
                } else {
                    alert('Error al guardar: ' + response.error);
                }
            });
    });

    renderTasks();

    function renderCategories(userId) {
        console.log("Recibido en renderCategories:", userId);

        if (!userId || isNaN(userId)) {
            console.error("userId inválido:", userId);
            return;
        }

        fetch('server/category/index.php?user_id=' + userId)
            .then(res => res.json())
            .then(response => {
                if (response.status !== 'ok' || !Array.isArray(response.data)) {
                    console.error("Error: respuesta inesperada al obtener categorías:", response);
                    return;
                }

                const categories = response.data;

                const list = document.getElementById('category-list');
                list.innerHTML = '';
                categories.forEach(cat => {
                    const li = document.createElement('li');
                    li.textContent = cat.name;
                    list.appendChild(li);
                });
            })
            .catch(err => console.error('Error al cargar categorías:', err));
    }
});
