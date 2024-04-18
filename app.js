document.addEventListener("DOMContentLoaded", function() {
    const navLinks = document.querySelectorAll("nav a");

    navLinks.forEach(link => {
        link.addEventListener("click", function(event) {
            event.preventDefault();
            const sectionId = link.getAttribute("href").substring(1);
            if (sectionId === "orders") {
                removePreviousTable();
                fetchOrdersDataFromAPI();
            } else if (sectionId === "products") {
                removePreviousTable();
                fetchWarehouseDataFromAPI();
            } else if (sectionId === "customers") {
                removePreviousTable();
                fetchCustomersDataFromAPI();
            } else if (sectionId === "product") {
                removePreviousTable();
                fetchProductsDataFromAPI();
            }
        });
    });
    const signupButton = document.querySelector(".signup-button");
    signupButton.addEventListener("click", handleSignup);

    const loginButton = document.querySelector(".login-button");
    loginButton.addEventListener("click", handleLogin);

    const token = getCookie("token");
    if (token) {
        getUserInfo(token);
    } else {
        showLoginSignupButtons();
    }
});

function showLoginSignupButtons() {
    const loginButton = document.createElement("button");
    loginButton.textContent = "Login";
    loginButton.classList.add("login-button");
    loginButton.addEventListener("click", handleLogin);

    const signupButton = document.createElement("button");
    signupButton.textContent = "Signup";
    signupButton.classList.add("signup-button");
    signupButton.addEventListener("click", handleSignup);

    const header = document.querySelector("nav");

    const userButton = header.querySelector(".user-button");
    const logoutButton = header.querySelector(".logout-button");
    const logButton = header.querySelector(".login-button");
    const singtButton = header.querySelector(".signup-button");
    if (userButton) {
        userButton.parentNode.removeChild(userButton);
    }
    if (logoutButton) {
        logoutButton.parentNode.removeChild(logoutButton);
    }
    if (logButton) {
        logButton.parentNode.removeChild(logButton);
    }
    if (singtButton) {
        singtButton.parentNode.removeChild(singtButton);
    }

    // Append login and signup buttons after existing navigation links
    header.appendChild(loginButton);
    header.appendChild(signupButton);
}


function showUserButtons(user) {
    const username = user.username;

    const userButton = document.createElement("button");
    userButton.textContent = username;
    userButton.classList.add("user-button");
    userButton.addEventListener("click", handleUserClick);

    const logoutButton = document.createElement("button");
    logoutButton.textContent = "Logout";
    logoutButton.classList.add("logout-button");
    logoutButton.addEventListener("click", handleLogout);

    const header = document.querySelector("nav");

    // Remove login and signup buttons
    const loginButton = header.querySelector(".login-button");
    const signupButton = header.querySelector(".signup-button");
    loginButton.parentNode.removeChild(loginButton);
    signupButton.parentNode.removeChild(signupButton);

    // Append user and logout buttons after existing navigation links
    header.querySelector("div").appendChild(userButton);
    header.querySelector("div").appendChild(logoutButton);
}



function handleUserClick() {
    // Добавьте здесь обработчик для действий пользователя, если необходимо
}

function handleLogout() {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    showLoginSignupButtons();
}

function getUserInfo(token) {
    fetch("https://retail-n3ew.onrender.com/user", {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("User info request failed");
            }
        })
        .then(user => {
            showUserButtons(user);
        })
        .catch(error => {
            console.error("User info request error: ", error);
            showLoginSignupButtons();
        });
}

function getCookie(name) {
    const cookies = document.cookie.split(";").map(cookie => cookie.trim());
    for (const cookie of cookies) {
        const [cookieName, cookieValue] = cookie.split("=");
        if (cookieName === name) {
            return cookieValue;
        }
    }
    return null;
}















function handleLogin() {
    // Создаем модальное окно для ввода учетных данных
    const modalContainer = document.createElement("div");
    modalContainer.classList.add("modal-container");

    const modal = document.createElement("div");
    modal.classList.add("modal");

    // Создаем форму для ввода учетных данных
    const form = document.createElement("form");
    form.classList.add("login-form");

    const usernameInput = createInput("text", "username", "Username");
    const passwordInput = createInput("password", "password", "Password");

    // Добавляем поля формы в форму
    form.appendChild(usernameInput);
    form.appendChild(passwordInput);

    // Добавляем кнопку отправки формы
    const submitButton = document.createElement("button");
    submitButton.textContent = "Submit";
    submitButton.type = "submit";

    form.appendChild(submitButton);
    form.addEventListener("submit", handleLoginSubmit);

    modal.appendChild(form);
    modalContainer.appendChild(modal);
    document.body.appendChild(modalContainer);

    // Закрываем модальное окно при нажатии на фон
    modalContainer.addEventListener("click", function(event) {
        if (event.target === modalContainer) {
            closeModal();
        }
    });
}

function createInput(type, name, placeholder) {
    const input = document.createElement("input");
    input.type = type;
    input.name = name;
    input.placeholder = placeholder;
    return input;
}

function handleLoginSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);

    const requestBody = {
        username: formData.get("username"),
        password: formData.get("password")
    };

    fetch("https://retail-n3ew.onrender.com/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            // "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("Login failed");
            }
        })
        .then(data => {
            const { user, token } = data;
            console.log(token);
            getUserInfo(token);
            // Сохраняем токен в куки
            document.cookie = `token=${token}; path=/`;
            alert("Login successful!");
            form.reset();
            closeModal(); // Закрываем модальное окно после успешного входа
        })
        .catch(error => {
            console.error("Login error: ", error);
            alert("Login failed. Please try again.");
        });
}

function closeModal() {
    const modalContainer = document.querySelector(".modal-container");
    if (modalContainer) {
        modalContainer.remove();
    }
}



function handleSignup() {
    // Создаем модальное окно
    const modalContainer = document.createElement("div");
    modalContainer.classList.add("modal-container");

    const modal = document.createElement("div");
    modal.classList.add("modal");

    // Создаем форму для ввода данных
    const form = document.createElement("form");
    form.classList.add("signup-form");

    const usernameInput = createInput("text", "username", "Username");
    const emailInput = createInput("email", "email", "Email");
    const passwordInput = createInput("password", "password", "Password");

    // Добавляем поле выбора роли
    const roleSelect = document.createElement("select");
    roleSelect.name = "roleId";

    // Заполняем опции для выбора роли
    const roleOptions = [
        { value: 1, text: "Role 1" },
        { value: 2, text: "Role 2" },
        { value: 3, text: "Role 3" }
    ];

    roleOptions.forEach(option => {
        const roleOption = document.createElement("option");
        roleOption.value = option.value;
        roleOption.textContent = option.text;
        roleSelect.appendChild(roleOption);
    });

    // Добавляем поля формы в форму
    form.appendChild(usernameInput);
    form.appendChild(emailInput);
    form.appendChild(passwordInput);
    form.appendChild(roleSelect);

    // Добавляем кнопки
    const submitButton = document.createElement("button");
    submitButton.textContent = "Submit";
    submitButton.type = "submit";

    const cancelButton = document.createElement("button");
    cancelButton.textContent = "Cancel";
    cancelButton.type = "button";
    cancelButton.addEventListener("click", closeModal); // Закрываем модальное окно при нажатии на кнопку "Cancel"

    form.appendChild(submitButton);
    form.appendChild(cancelButton);
    form.addEventListener("submit", handleSubmit);

    modal.appendChild(form);
    modalContainer.appendChild(modal);
    document.body.appendChild(modalContainer);

    // Закрываем модальное окно при нажатии на фон
    modalContainer.addEventListener("click", function(event) {
        if (event.target === modalContainer) {
            closeModal();
        }
    });
}

function createInput(type, name, placeholder) {
    const input = document.createElement("input");
    input.type = type;
    input.name = name;
    input.placeholder = placeholder;
    return input;
}
function handleSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);

    const requestBody = {
        username: formData.get("username"),
        email: formData.get("email"),
        password: formData.get("password"),
        roleId: parseInt(formData.get("roleId"))
    };
    // const token = getCookie("token");
    fetch("https://retail-n3ew.onrender.com/auth/signup", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            // "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
    })
        .then(response => {
            if (response.ok) {
                alert("User created successfully!");
                form.reset();
                closeModal(); // Закрываем модальное окно после успешной отправки
            } else {
                alert("Error creating user. Please try again.");
            }
        })
        .catch(error => {
            console.error("Error creating user: ", error);
            alert("Error creating user. Please try again later.");
        });
}

function closeModal() {
    const modalContainer = document.querySelector(".modal-container");
    if (modalContainer) {
        modalContainer.remove();
    }
}
















function removePreviousTable() {
    const body = document.body;
    const header = document.querySelector(".header");
    const nav = document.querySelector("nav");
    const tables = document.querySelectorAll(".orders-table-container");

    tables.forEach(table => {
        table.remove();
    });

    const elementsToRemove = Array.from(body.children).filter(child => child !== header && child !== nav);
    elementsToRemove.forEach(element => {
        element.remove();
    });
}

function fetchOrdersDataFromAPI() {
    fetch("https://retail-n3ew.onrender.com/order")
        .then(response => response.json())
        .then(data => displayOrdersTable(data))
        .catch(error => console.error("Error fetching orders data: ", error));
}
function fetchWarehouseDataFromAPI() {
    fetch("https://retail-n3ew.onrender.com/warehouse")
        .then(response => response.json())
        .then(data => displayWarehouseTable(data))
        .catch(error => console.error("Error fetching warehouse data: ", error));
}

function fetchProductsDataFromAPI1(warehouseId) {
    fetch(`https://retail-n3ew.onrender.com/warehouse/${warehouseId}`)
        .then(response => response.json())
        .then(data => displayProductsTable1(data))
        .catch(error => console.error("Error fetching products data: ", error));
}
function fetchCustomersDataFromAPI() {
    fetch("https://retail-n3ew.onrender.com/customer")
        .then(response => response.json())
        .then(data => displayCustomersTable(data))
        .catch(error => console.error("Error fetching customers data: ", error));
}
function fetchProductsDataFromAPI() {
    fetch("https://retail-n3ew.onrender.com/product")
        .then(response => response.json())
        .then(data => displayProductsTable(data))
        .catch(error => console.error("Error fetching products data: ", error));
}

function displayOrdersTable(orders) {
    const tableContainer = document.createElement("div");
    tableContainer.classList.add("orders-table-container");

    const table = document.createElement("table");
    table.classList.add("orders-table");
    const headerRow = table.insertRow();
    const headers = ["Warehouse", "Products", "Quantity", "Total Price", "Ship Name", "Shipping Address"];

    headers.forEach(headerText => {
        const headerCell = document.createElement("th");
        headerCell.textContent = headerText;
        headerRow.appendChild(headerCell);
    });

    orders.forEach(order => {
        const row = table.insertRow();
        const warehouseName = order.warehouse ? order.warehouse.name : "N/A";
        const products = order.product.map(product => product.name).join(", ");
        const quantity = order.product.reduce((total, product) => total + product.OrderListing.amount, 0);
        const totalPrice = order.product.reduce((total, product) => total + (product.price * product.OrderListing.amount), 0);
        const shipName = order.customer ? order.customer.lastName + " " + order.customer.firstName : "N/A";
        const shippingAddress = order.customer ? order.customer.shippingAdress : "N/A";

        const rowData = [warehouseName, products, quantity, totalPrice, shipName, shippingAddress];

        rowData.forEach(value => {
            const cell = row.insertCell();
            cell.textContent = value;
        });
    });

    tableContainer.appendChild(table);
    document.body.appendChild(tableContainer);

    const addButton = document.createElement("button");
    addButton.textContent = "Add";
    addButton.classList.add("addBtn");
    addButton.addEventListener("click", addNewRow);

    document.body.appendChild(addButton);
}

function displayWarehouseTable(warehouses) {
    const tableContainer = document.createElement("div");
    tableContainer.classList.add("orders-table-container");

    const table = document.createElement("table");
    table.classList.add("orders-table");
    const headerRow = table.insertRow();
    const headers = ["Name", "Address"];

    headers.forEach(headerText => {
        const headerCell = document.createElement("th");
        headerCell.textContent = headerText;
        headerRow.appendChild(headerCell);
    });

    warehouses.forEach(warehouse => {
        const row = table.insertRow();
        const name = warehouse.name || "N/A";
        const address = warehouse.address || "N/A";

        const nameCell = row.insertCell();
        nameCell.textContent = name;
        nameCell.classList.add("warehouse-name"); // Добавляем класс для обработки клика по названию склада

        const addressCell = row.insertCell();
        addressCell.textContent = address;

        // Добавляем обработчик событий для нажатия на название склада
        nameCell.addEventListener("click", function() {
            fetchProductsDataFromAPI1(warehouse.id);
        });
    });

    tableContainer.appendChild(table);
    document.body.appendChild(tableContainer);
}


function displayProductsTable1(warehouse) {
    removePreviousTable();

    // Создаем элемент для отображения названия склада
    const warehouseNameElement = document.createElement("h2");
    warehouseNameElement.textContent = `Warehouse: ${warehouse.name}`;
    document.body.appendChild(warehouseNameElement);

    const tableContainer = document.createElement("div");
    tableContainer.classList.add("orders-table-container");

    const table = document.createElement("table");
    table.classList.add("orders-table");
    const headerRow = table.insertRow();
    const headers = ["Name", "Price", "Minimum Stock", "Amount", "Actions"];

    headers.forEach(headerText => {
        const headerCell = document.createElement("th");
        headerCell.textContent = headerText;
        headerRow.appendChild(headerCell);
    });

    warehouse.product.forEach(product => {
        const row = table.insertRow();
        const name = product.name || "N/A";
        const price = product.price || "N/A";
        const minimumStock = product.minimumStock || "N/A";
        const amount = product.Stock ? product.Stock.amount : "N/A";

        const rowData = [name, price, minimumStock, amount];

        rowData.forEach(value => {
            const cell = row.insertCell();
            cell.textContent = value;
        });

        // Создаем ячейку для кнопок
        const actionCell = row.insertCell();

        // Создаем кнопку "+" для добавления товара
        const addButton = document.createElement("button");
        addButton.textContent = "+";
        addButton.classList.add("addBtn");
        addButton.dataset.stockId = product.Stock.id;
        addButton.addEventListener("click", () => addMoreProduct(product.Stock.id, warehouse.id));
        actionCell.appendChild(addButton);

        // Создаем кнопку "->" для перемещения товара
        const moveButton = document.createElement("button");
        moveButton.textContent = "->";
        moveButton.classList.add("moveBtn");
        moveButton.addEventListener("click", () => moveProduct(product.Stock.id, warehouse.id, product.id));
        actionCell.appendChild(moveButton);
    });

    tableContainer.appendChild(table);
    document.body.appendChild(tableContainer);
}



function addMoreProduct(stockId, warehouse) {
    // Создаем модальное окно
    const modal = document.createElement("div");
    modal.classList.add("modal");

    // Создаем контент модального окна
    const modalContent = document.createElement("div");
    modalContent.classList.add("modal-content");

    // Создаем поле ввода для количества товара
    const inputLabel = document.createElement("label");
    inputLabel.textContent = "Enter quantity:";
    const inputField = document.createElement("input");
    inputField.type = "number";
    inputField.min = 1;
    inputField.required = true;

    // Создаем кнопку "OK"
    const okButton = document.createElement("button");
    okButton.textContent = "OK";
    okButton.addEventListener("click", function() {
        const amount = parseInt(inputField.value); // Получаем введенное количество товара
        if (!isNaN(amount) && amount > 0) {
            // Если введенное значение является числом больше нуля, отправляем POST-запрос на сервер
            const data = { id: stockId, amount };
            const token = getCookie("token");
            fetch("https://retail-n3ew.onrender.com/stock/addToStock", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(data)
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Failed to add product to stock");
                    }
                    // Успешно добавлено
                    setTimeout(() => {
                        fetchProductsDataFromAPI1(warehouse);
                    }, 10);
                    closeModal(); // Закрываем модальное окно
                })
                .catch(error => {
                    console.error("Error adding product to stock:", error);
                    closeModal(); // Закрываем модальное окно
                });
        }

    });

    // Создаем кнопку "Cancel"
    const cancelButton = document.createElement("button");
    cancelButton.textContent = "Cancel";
    cancelButton.addEventListener("click", closeModal);

    // Добавляем элементы в контент модального окна
    modalContent.appendChild(inputLabel);
    modalContent.appendChild(inputField);
    modalContent.appendChild(okButton);
    modalContent.appendChild(cancelButton);

    // Добавляем контент модального окна в модальное окно
    modal.appendChild(modalContent);

    // Добавляем модальное окно в тело документа
    document.body.appendChild(modal);
}

function closeModal() {
    const modal = document.querySelector(".modal");
    if (modal) {
        modal.remove();
    }
}

function moveProduct(stockId, warehouse, productId) {
    fetch(`https://retail-n3ew.onrender.com/warehouse/withProduct/${productId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch warehouses');
            }
            return response.json();
        })
        .then(warehouses => {
            // Проверяем, получены ли данные о складах
            if (Array.isArray(warehouses) && warehouses.length > 0) {
                // Создать модальное окно с выбором склада и полем для ввода количества товара
                const modal = document.createElement("div");
                modal.classList.add("modal");

                const modalContent = document.createElement("div");
                modalContent.classList.add("modal-content");

                // Создать список складов
                const selectWarehouse = document.createElement("select");
                selectWarehouse.classList.add("select-warehouse");

                // Добавить варианты выбора (склады)
                warehouses.forEach(warehouse => {
                    const option = document.createElement("option");
                    option.value = warehouse.productInfo.Stock.id;
                    option.textContent = warehouse.name;
                    selectWarehouse.appendChild(option);
                });

                // Создать поле ввода для количества товара
                const inputLabel = document.createElement("label");
                inputLabel.textContent = "Enter quantity:";
                const inputField = document.createElement("input");
                inputField.type = "number";
                inputField.min = 1;
                inputField.required = true;

                // Создать кнопку "OK"
                const okButton = document.createElement("button");
                okButton.textContent = "OK";
                okButton.addEventListener("click", function() {
                    const stockFromId = selectWarehouse.value; // ID склада, куда перемещаем товар
                    console.log(stockFromId);
                    const amount = parseInt(inputField.value); // Количество товара для перемещения
                    if (!isNaN(amount) && amount > 0) {
                        // Если введенное значение является числом больше нуля, отправляем POST-запрос на сервер
                        const stockToId = stockId;
                        const data = { stockToId, stockFromId, amount };
                        const token = getCookie("token");
                        fetch("https://retail-n3ew.onrender.com/stock/transferStock", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": `Bearer ${token}`
                            },
                            body: JSON.stringify(data)
                        })
                            .then(response => {
                                if (!response.ok) {
                                    throw new Error("Failed to transfer product stock");
                                }
                                setTimeout(() => {
                                    fetchProductsDataFromAPI1(warehouse);
                                }, 10);
                                // Успешно перемещено
                                closeModal(); // Закрываем модальное окно
                                // Дополнительные действия, если нужно
                            })
                            .catch(error => {
                                console.error("Error transferring product stock:", error);
                                closeModal(); // Закрываем модальное окно
                            });
                    }
                });

                // Создать кнопку "Cancel"
                const cancelButton = document.createElement("button");
                cancelButton.textContent = "Cancel";
                cancelButton.addEventListener("click", closeModal);

                // Добавить элементы в контент модального окна
                modalContent.appendChild(selectWarehouse);
                modalContent.appendChild(inputLabel);
                modalContent.appendChild(inputField);
                modalContent.appendChild(okButton);
                modalContent.appendChild(cancelButton);

                // Добавить контент модального окна в модальное окно
                modal.appendChild(modalContent);

                // Добавить модальное окно в тело документа
                document.body.appendChild(modal);
            } else {
                // Если список складов пуст или его формат некорректен
                throw new Error('Empty or invalid warehouses data');
            }
        })
        .catch(error => {
            console.error("Error fetching warehouses data:", error);
        });
}

function addNewRow() {
    const table = document.querySelector(".orders-table");
    const newRow = table.insertRow();

    // Создаем ячейку для селектора склада
    const warehouseCell = newRow.insertCell();

    // Создаем селектор склада
    const warehouseSelect = document.createElement("select");
    warehouseSelect.classList.add("warehouse-select");

    // Делаем GET запрос на сервер для получения данных о складах
    fetch('https://retail-n3ew.onrender.com/warehouse')
        .then(response => response.json())
        .then(data => {
            // Заполняем селектор данными о складах
            data.forEach(warehouse => {
                const option = document.createElement("option");
                option.value = warehouse.id;
                option.textContent = warehouse.name;
                warehouseSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error fetching warehouse data:', error);
        });

    // Добавляем селектор склада в ячейку
    warehouseCell.appendChild(warehouseSelect);

    // Создаем ячейку для селектора продукта
    const productCell = newRow.insertCell();

    // Создаем селектор продукта
    const productSelect = document.createElement("select");
    productSelect.classList.add("product-select");

    // Делаем GET запрос на сервер для получения данных о продуктах
    fetch('https://retail-n3ew.onrender.com/product')
        .then(response => response.json())
        .then(productData => { // Переименовываем переменную data на productData
            // Заполняем селектор данными о продуктах
            productData.forEach(product => {
                const option = document.createElement("option");
                option.value = product.id;
                option.textContent = product.name;
                productSelect.appendChild(option);
            });

            // Добавляем обработчик изменения значения в селекторе продукта
            productSelect.addEventListener('change', () => {
                // Получаем цену выбранного продукта
                const selectedProductId = productSelect.value;
                const selectedProduct = productData.find(product => product.id === selectedProductId);
                const price = selectedProduct ? selectedProduct.price : 0;

                // Получаем количество, введенное пользователем
                const quantity = parseFloat(quantityInput.value) || 0;

                // Вычисляем стоимость (количество * цена)
                const cost = quantity * price;

                // Устанавливаем значение в соответствующую ячейку
                costCell.textContent = cost.toFixed(2);
            });
        })
        .catch(error => {
            console.error('Error fetching product data:', error);
        });

    // Добавляем селектор продукта в ячейку
    productCell.appendChild(productSelect);

    // Создаем ячейку для ввода количества продукта
    const quantityCell = newRow.insertCell();
    const quantityInput = document.createElement("input");
    quantityInput.type = "text";
    quantityInput.classList.add("quantity-input");
    quantityCell.appendChild(quantityInput);

    // Создаем ячейку для вычисления стоимости
    const costCell = newRow.insertCell();
    quantityInput.addEventListener('change', () => {
        // Получаем количество, введенное пользователем
        const quantity = parseFloat(quantityInput.value) || 0;

        // Получаем цену выбранного продукта
        const selectedProductId = productSelect.value;
        const selectedProduct = productData.find(product => product.id === selectedProductId);
        const price = selectedProduct ? selectedProduct.price : 0;

        // Вычисляем общую стоимость заказа (количество * цена)
        const totalCost = quantity * price;

        // Устанавливаем значение в соответствующую ячейку
        costCell.textContent = totalCost.toFixed(2);
    });
    const customerCell = newRow.insertCell();

// Создаем селектор имени клиента
    const customerSelect = document.createElement("select");
    customerSelect.classList.add("customer-select");

// Делаем GET запрос на сервер для получения данных о клиентах
    fetch('https://retail-n3ew.onrender.com/customer')
        .then(response => response.json())
        .then(customerData => {
            // Заполняем селектор данными о клиентах
            customerData.forEach(customer => {
                const option = document.createElement("option");
                option.value = customer.id;
                option.textContent = customer.firstName + ' ' + customer.lastName;
                customerSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error fetching customer data:', error);
        });
    // Добавляем обработчик изменения значения в селекторе имени клиента
    customerSelect.addEventListener('change', () => {
        // Получаем идентификатор выбранного клиента
        const selectedCustomerId = customerSelect.value;

        // Если клиент выбран
        if (selectedCustomerId) {
            // Делаем GET запрос на сервер для получения данных о клиенте по его идентификатору
            fetch(`https://retail-n3ew.onrender.com/customer/${selectedCustomerId}`)
                .then(response => response.json())
                .then(customer => {
                    // Если у клиента есть адрес, отображаем его в ячейке
                    if (customer.shippingAdress) {
                        addressCell.textContent = customer.shippingAdress;
                    } else {
                        addressCell.textContent = "Адрес не указан";
                    }
                })
                .catch(error => {
                    console.error('Error fetching customer address:', error);
                });
        } else {
            // Если клиент не выбран, очищаем ячейку с адресом
            addressCell.textContent = "";
        }
    });

// Создаем ячейку для отображения адреса клиента
    const addressCell = newRow.insertCell();


// Добавляем селектор имени клиента в ячейку
    customerCell.appendChild(customerSelect);


    const addButton = document.querySelector(".addBtn");
    addButton.remove();

    const saveButton = document.createElement("button");
    saveButton.textContent = "Save";
    saveButton.addEventListener("click", saveData);

    document.body.appendChild(saveButton);
}


function saveData() {
    const warehouseSelect = document.querySelector('.warehouse-select');
    const productSelect = document.querySelector('.product-select');
    const quantityInput = document.querySelector('.quantity-input');
    const customerSelect = document.querySelector('.customer-select');

    const warehouseName = warehouseSelect.options[warehouseSelect.selectedIndex].textContent;
    const productName = productSelect.options[productSelect.selectedIndex].textContent;
    const quantity = quantityInput.value;
    const shipName = customerSelect.options[customerSelect.selectedIndex].textContent;

    console.log("Warehouse:", warehouseName);
    console.log("Products:", productName);
    console.log("Quantity:", quantity);
    console.log("Ship Name:", shipName);

    removePreviousTable();
    fetchOrdersDataFromAPI();
}
async function saveOrder(customerId, warehouseId) {
    try {
        const response = await fetch('https://retail-n3ew.onrender.com/order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                customerId: customerId,
                warehouseId: warehouseId
            })
        });
        const data = await response.json();
        return data.id;
    } catch (error) {
        console.error('Error saving order:', error);
        throw error;
    }
}
async function saveOrderListing(orderId, productId, amount) {
    try {
        const response = await fetch('https://retail-n3ew.onrender.com/orderListing', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                orderId: orderId,
                productId: productId,
                amount: amount
            })
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error saving order listing:', error);
        throw error;
    }
}

async function saveData() {
    try {
        const warehouseSelect = document.querySelector('.warehouse-select');
        const productSelect = document.querySelector('.product-select');
        const quantityInput = document.querySelector('.quantity-input');
        const customerSelect = document.querySelector('.customer-select');

        const warehouseId = warehouseSelect.value;
        const customerId = customerSelect.value;

        const orderId = await saveOrder(customerId, warehouseId);

        const productId = productSelect.value;
        const amount = parseFloat(quantityInput.value) || 0;

        await saveOrderListing(orderId, productId, amount);

        console.log("Order ID:", orderId);
    } catch (error) {
        console.error('Error saving data:', error);
    }
    removePreviousTable();
    fetchOrdersDataFromAPI();
}






function displayCustomersTable(customers) {
    removePreviousTable(); // Удаление предыдущей таблицы, если она есть

    const tableContainer = document.createElement("div");
    tableContainer.classList.add("orders-table-container");

    const table = document.createElement("table");
    table.classList.add("orders-table");
    const headerRow = table.insertRow();
    const headers = ["Last Name", "First Name", "Phone", "Email", "Shipping Address"];

    headers.forEach(headerText => {
        const headerCell = document.createElement("th");
        headerCell.textContent = headerText;
        headerRow.appendChild(headerCell);
    });

    customers.forEach(customer => {
        const row = table.insertRow();
        const lastName = customer.lastName || "N/A";
        const firstName = customer.firstName || "N/A";
        const phone = customer.phone || "N/A";
        const email = customer.email || "N/A";
        const shippingAddress = customer.shippingAdress || "N/A";

        const rowData = [lastName, firstName, phone, email, shippingAddress];

        rowData.forEach(value => {
            const cell = row.insertCell();
            cell.textContent = value;
        });
    });

    tableContainer.appendChild(table);
    document.body.appendChild(tableContainer);

    // Создание кнопки для добавления нового клиента
    const addButton = document.createElement("button");
    addButton.textContent = "+";
    addButton.classList.add("addBtn");
    addButton.addEventListener("click", addNewCustomer);

    document.body.appendChild(addButton);
}

function addNewCustomer() {
    // Создаем модальное окно для ввода данных нового клиента
    const modal = document.createElement("div");
    modal.classList.add("modal");

    const modalContent = document.createElement("div");
    modalContent.classList.add("modal-content");

    // Создаем поля ввода для фамилии, имени, отчества, телефона, email и адреса доставки клиента
    const lastNameLabel = document.createElement("label");
    lastNameLabel.textContent = "Last Name:";
    const lastNameField = document.createElement("input");
    lastNameField.type = "text";
    lastNameField.required = true;

    const firstNameLabel = document.createElement("label");
    firstNameLabel.textContent = "First Name:";
    const firstNameField = document.createElement("input");
    firstNameField.type = "text";
    firstNameField.required = true;

    const patronymicLabel = document.createElement("label");
    patronymicLabel.textContent = "Patronymic:";
    const patronymicField = document.createElement("input");
    patronymicField.type = "text";

    const phoneLabel = document.createElement("label");
    phoneLabel.textContent = "Phone:";
    const phoneField = document.createElement("input");
    phoneField.type = "text";
    phoneField.required = true;

    const emailLabel = document.createElement("label");
    emailLabel.textContent = "Email:";
    const emailField = document.createElement("input");
    emailField.type = "email";
    emailField.required = true;

    const shippingAddressLabel = document.createElement("label");
    shippingAddressLabel.textContent = "Shipping Address:";
    const shippingAddressField = document.createElement("input");
    shippingAddressField.type = "text";
    shippingAddressField.required = true;

    // Создаем кнопку "OK" для добавления нового клиента
    const okButton = document.createElement("button");
    okButton.textContent = "OK";
    okButton.addEventListener("click", function() {
        const lastName = lastNameField.value.trim();
        const firstName = firstNameField.value.trim();
        const patronymic = patronymicField.value.trim();
        const phone = phoneField.value.trim();
        const email = emailField.value.trim();
        const shippingAddress = shippingAddressField.value.trim();

        // Проверяем, что все обязательные поля заполнены
        if (lastName && firstName && phone && email && shippingAddress) {
            const data = { lastName, firstName, patronymic, phone, email, shippingAdress: shippingAddress };
            const token = getCookie("token");
            fetch("https://retail-n3ew.onrender.com/customer", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(data)
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Failed to add new customer");
                    }
                    // Успешно добавлено
                    closeModal();
                    fetchCustomersDataFromAPI(); // Обновляем таблицу клиентов
                })
                .catch(error => {
                    console.error("Error adding new customer:", error);
                    closeModal();
                });
        }
    });

    // Создаем кнопку "Cancel" для закрытия модального окна
    const cancelButton = document.createElement("button");
    cancelButton.textContent = "Cancel";
    cancelButton.addEventListener("click", closeModal);

    // Добавляем элементы в контент модального окна
    modalContent.appendChild(lastNameLabel);
    modalContent.appendChild(lastNameField);
    modalContent.appendChild(firstNameLabel);
    modalContent.appendChild(firstNameField);
    modalContent.appendChild(patronymicLabel);
    modalContent.appendChild(patronymicField);
    modalContent.appendChild(phoneLabel);
    modalContent.appendChild(phoneField);
    modalContent.appendChild(emailLabel);
    modalContent.appendChild(emailField);
    modalContent.appendChild(shippingAddressLabel);
    modalContent.appendChild(shippingAddressField);
    modalContent.appendChild(okButton);
    modalContent.appendChild(cancelButton);

    // Добавляем контент модального окна в модальное окно
    modal.appendChild(modalContent);

    // Добавляем модальное окно в тело документа
    document.body.appendChild(modal);
}

function closeModal() {
    const modal = document.querySelector(".modal");
    if (modal) {
        modal.remove();
    }
}


function displayProductsTable(products) {
    removePreviousTable();
    const tableContainer = document.createElement("div");
    tableContainer.classList.add("orders-table-container");

    const table = document.createElement("table");
    table.classList.add("orders-table");
    const headerRow = table.insertRow();
    const headers = ["Name", "Price", "Minimum Stock"];

    headers.forEach(headerText => {
        const headerCell = document.createElement("th");
        headerCell.textContent = headerText;
        headerRow.appendChild(headerCell);
    });

    products.forEach(product => {
        const row = table.insertRow();
        const name = product.name || "N/A";
        const price = product.price || "N/A";
        const minimumStock = product.minimumStock || "N/A";

        const rowData = [name, price, minimumStock];

        rowData.forEach(value => {
            const cell = row.insertCell();
            cell.textContent = value;
        });
    });

    tableContainer.appendChild(table);
    document.body.appendChild(tableContainer);

    // Создание кнопки для добавления нового продукта
    const addButton = document.createElement("button");
    addButton.textContent = "+";
    addButton.classList.add("addBtn");
    addButton.addEventListener("click", addNewProduct);

    document.body.appendChild(addButton);
}

function addNewProduct() {
    // Создаем модальное окно для ввода данных нового продукта
    const modal = document.createElement("div");
    modal.classList.add("modal");

    const modalContent = document.createElement("div");
    modalContent.classList.add("modal-content");

    // Создаем поля ввода для имени, цены и минимального запаса продукта
    const nameLabel = document.createElement("label");
    nameLabel.textContent = "Name:";
    const nameField = document.createElement("input");
    nameField.type = "text";
    nameField.required = true;

    const priceLabel = document.createElement("label");
    priceLabel.textContent = "Price:";
    const priceField = document.createElement("input");
    priceField.type = "number";
    priceField.min = 0;
    priceField.required = true;

    const minimumStockLabel = document.createElement("label");
    minimumStockLabel.textContent = "Minimum Stock:";
    const minimumStockField = document.createElement("input");
    minimumStockField.type = "number";
    minimumStockField.min = 0;
    minimumStockField.required = true;

    // Создаем кнопку "OK" для добавления нового продукта
    const okButton = document.createElement("button");
    okButton.textContent = "OK";
    okButton.addEventListener("click", function() {
        const name = nameField.value.trim();
        const price = parseFloat(priceField.value);
        const minimumStock = parseInt(minimumStockField.value);

        // Проверяем, что все поля заполнены
        if (name && !isNaN(price) && !isNaN(minimumStock)) {
            const data = { name, price, minimumStock };
            const token = getCookie("token");
            fetch("https://retail-n3ew.onrender.com/product", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(data)
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Failed to add new product");
                    }
                    // Успешно добавлено
                    closeModal();
                    fetchProductsDataFromAPI(); // Обновляем таблицу продуктов
                })
                .catch(error => {
                    console.error("Error adding new product:", error);
                    closeModal();
                });
        }
    });

    // Создаем кнопку "Cancel" для закрытия модального окна
    const cancelButton = document.createElement("button");
    cancelButton.textContent = "Cancel";
    cancelButton.addEventListener("click", closeModal);

    // Добавляем элементы в контент модального окна
    modalContent.appendChild(nameLabel);
    modalContent.appendChild(nameField);
    modalContent.appendChild(priceLabel);
    modalContent.appendChild(priceField);
    modalContent.appendChild(minimumStockLabel);
    modalContent.appendChild(minimumStockField);
    modalContent.appendChild(okButton);
    modalContent.appendChild(cancelButton);

    // Добавляем контент модального окна в модальное окно
    modal.appendChild(modalContent);

    // Добавляем модальное окно в тело документа
    document.body.appendChild(modal);
}

function closeModal() {
    const modal = document.querySelector(".modal");
    if (modal) {
        modal.remove();
    }
}

