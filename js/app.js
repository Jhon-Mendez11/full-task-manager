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
        taskList.innerHTML = '';

        fetch('server/user/session_info.php')
            .then(res => res.json())
            .then(data => {
                if (data.user_id) {
                    fetch('server/task/index.php?user_id=' + data.user_id)
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Error al cargar las tareas');
                            }
                            return response.json();
                        })
                        .then(tks => {
                            tasks = tks;
                            tks.forEach(task => {
                                const li = document.createElement('li');
                                li.className = task.completed ? 'completed' : '';

                                let buttons = '';

                                buttons += `<button class="complete-btn" onclick="completeTask(${task.id})">${task.completed ? 'Deshacer' : 'Completar'}</button>`;

                                if (!task.completed) {
                                    buttons += `<button class="edit-btn" onclick="editTask(${task.id})">Editar</button>`;
                                    buttons += `<button class="delete-btn" onclick="deleteTask(${task.id})">Eliminar</button>`;
                                }

                                li.innerHTML = `<span>${task.title}</span><div>${buttons}</div>`;
                                taskList.appendChild(li);
                            });
                        })
                        .catch(err => {
                            console.error('Error al cargar tareas:', err);
                            alert('Hubo un problema al cargar las tareas');
                        });

                    renderCategories(data.user_id);
                    user_id.value = data.user_id;

                    const categoryUserId = document.getElementById('category-user-id');
                    categoryUserId.value = data.user_id;
                } else {
                    window.location.href = 'login.php';
                }
            });
    }

    window.completeTask = function (id) {
        fetch('server/task/complete.php?id=' + id)
            .then(res => res.json())
            .then(data => {
                if (data.status === 'ok') renderTasks();
                else alert('Error al completar');
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
                else alert('Error al eliminar');
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

    window.editCategory = function (category) {
        document.getElementById('category-name').value = category.name;
        document.getElementById('category-id').value = category.id;
        document.querySelector('#category-form button[type="submit"]').textContent = 'Guardar categoría';
    };

    window.deleteCategory = function (id) {
        if (!confirm("¿Estás seguro de eliminar esta categoría?")) return;
        fetch('server/category/delete.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: 'id=' + id
        })
            .then(res => res.json())
            .then(response => {
                if (response.status === 'ok') renderTasks();
                else alert('Error al eliminar categoría');
            });
    };

    function renderCategories(userId) {
        fetch('server/category/index.php?user_id=' + userId)
            .then(res => {
                if (!res.ok) {
                    throw new Error('Error al cargar categorías');
                }
                return res.json();
            })
            .then(response => {
                if (response.status !== 'ok') return;

                const categories = response.data;
                const list = document.getElementById('category-list');
                list.innerHTML = '';

                categories.forEach(cat => {
                    const li = document.createElement('li');
                    li.className = 'category-item';

                    const nameSpan = document.createElement('span');
                    nameSpan.textContent = cat.name;
                    li.appendChild(nameSpan);

                    const actionsDiv = document.createElement('div');
                    actionsDiv.className = 'category-actions';

                    const editBtn = document.createElement('button');
                    editBtn.textContent = 'Editar';
                    editBtn.className = 'edit-btn';
                    editBtn.onclick = () => editCategory(cat);
                    actionsDiv.appendChild(editBtn);

                    const deleteBtn = document.createElement('button');
                    deleteBtn.textContent = 'Eliminar';
                    deleteBtn.className = 'delete-btn';
                    deleteBtn.onclick = () => deleteCategory(cat.id);
                    actionsDiv.appendChild(deleteBtn);

                    li.appendChild(actionsDiv);
                    list.appendChild(li);
                });
            })
            .catch(err => {
                console.error('Error al cargar categorías:', err);
                alert('Hubo un problema al cargar las categorías');
            });
    }

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
                    alert('Error al guardar');
                }
            });
    });

    const categoryForm = document.getElementById('category-form');
    const categoryName = document.getElementById('category-name');
    const categoryUserId = document.getElementById('category-user-id');
    const categoryIdInput = document.getElementById('category-id');
    const categorySubmitBtn = categoryForm.querySelector('button[type="submit"]');

    categoryForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const postData = new URLSearchParams();
        postData.append('name', categoryName.value);
        postData.append('user_id', categoryUserId.value);

        let url = 'server/category/create.php';

        if (categoryIdInput.value) {
            postData.append('id', categoryIdInput.value);
            url = 'server/category/update.php';
        }

        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: postData.toString()
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error('Error en la respuesta del servidor');
                }
                return res.json();
            })
            .then(response => {
                console.log('Respuesta del servidor:', response);
                if (response.status === 'ok') {
                    categoryForm.reset();
                    categoryIdInput.value = '';
                    categorySubmitBtn.textContent = 'Crear categoría';
                    renderTasks();
                } else {
                    alert('Error al guardar la categoría');
                }
            })
            .catch(error => {
                console.error('Error al procesar la respuesta:', error);
            });


    });
    renderTasks();
});
