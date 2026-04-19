// --- 1. Работа с "SharedPreferences" (localStorage) ---
function saveSettings() {
    const name = document.getElementById('userNameInput').value;
    if (name) {
        localStorage.setItem('user_name', name);
        document.getElementById('settingsStatus').innerText = `Сохранено: ${name}`;
    } else {
        alert("Поле пустое!");
    }
}

// Загрузка настроек при старте
window.onload = () => {
    const savedName = localStorage.getItem('user_name');
    if (savedName) {
        document.getElementById('settingsStatus').innerText = `Последнее имя: ${savedName}`;
    }
    initDB(); // Инициализация БД
};

// --- 2. Работа с Базой Данных (IndexedDB - аналог SQLite) ---
let db;

function initDB() {
    const request = indexedDB.open("MyTestDB", 1);

    request.onupgradeneeded = (event) => {
        db = event.target.result;
        db.createObjectStore("entries", { autoIncrement: true });
    };

    request.onsuccess = (event) => {
        db = event.target.result;
    };
}

// Кнопка 1: Заполнить БД (аналог insert в SQLite)
function addToDatabase() {
    const input = document.getElementById('dbDataInput');
    const value = input.value.trim();

    if (!value) return alert("Введите текст!");

    const transaction = db.transaction(["entries"], "readwrite");
    const store = transaction.objectStore("entries");
    store.add(value);

    transaction.oncomplete = () => {
        input.value = "";
        alert("Запись добавлена в базу!");
    };
}

// Кнопка 2: Вывести записи (аналог SELECT * в SQLite)
function readFromDatabase() {
    const output = document.getElementById('dbOutput');
    const transaction = db.transaction(["entries"], "readonly");
    const store = transaction.objectStore("entries");
    const request = store.getAll();

    request.onsuccess = () => {
        if (request.result.length > 0) {
            output.innerText = request.result.map((item, idx) => `${idx + 1}. ${item}`).join('\n');
        } else {
            output.innerText = "База данных пока пуста.";
        }
    };
}