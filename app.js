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
});


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

function fetchProductsDataFromAPI(warehouseId) {
    fetch(`https://retail-n3ew.onrender.com/warehouse/${warehouseId}`)
        .then(response => response.json())
        .then(data => displayProductsTable(data))
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
            fetchProductsDataFromAPI(warehouse.id);
        });
    });

    tableContainer.appendChild(table);
    document.body.appendChild(tableContainer);
}


function displayProductsTable(warehouse) {
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
            fetch("https://retail-n3ew.onrender.com/stock/addToStock", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Failed to add product to stock");
                    }
                    // Успешно добавлено
                    setTimeout(() => {
                        fetchProductsDataFromAPI(warehouse);
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
                        fetch("https://retail-n3ew.onrender.com/stock/transferStock", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify(data)
                        })
                            .then(response => {
                                if (!response.ok) {
                                    throw new Error("Failed to transfer product stock");
                                }
                                setTimeout(() => {
                                    fetchProductsDataFromAPI(warehouse);
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
    const newRowInputs = document.querySelectorAll(".orders-table-container input");
    const newRowData = {};
    newRowInputs.forEach((input, index) => {
        const headerText = document.querySelector(".orders-table th:nth-child(" + (index + 1) + ")").textContent;
        newRowData[headerText] = input.value;
    });
    console.log("New Row Data:", newRowData);

    removePreviousTable();
    fetchOrdersDataFromAPI();
}

function displayCustomersTable(customers) {
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
}
function displayProductsTable(products) {
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
}
