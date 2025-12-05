// Mini Quote Saver: DOM + Events + localStorage
let quotes = JSON.parse(localStorage.getItem("quotes")) || [];
let editingIndex = null;

// 1. DOM SELECTORS
const input = document.getElementById("quoteInput");
const addBtn = document.getElementById("addBtn");
const list = document.getElementById("quoteList");
const emptyState = document.getElementById("emptyState");
const clearAllBtn = document.getElementById("clearAllBtn");
const quoteCount = document.querySelector("#quoteCount");
const container = document.querySelector(".container");
const allButtons = document.querySelectorAll("button");

// 2. CREATING & MODIFYING ELEMENTS
function renderQuotes() {
    list.innerHTML = "";
    quoteCount.textContent = quotes.length;

    if (quotes.length === 0) {
        emptyState.classList.add("active");
        emptyState.style.display = "flex";
        list.style.display = "none";
        clearAllBtn.style.display = "none";
    } else {
        emptyState.classList.remove("active");
        emptyState.style.display = "none";
        list.style.display = "block";
        clearAllBtn.style.display = "flex";
    }

    quotes.forEach((quote, index) => {
        const li = document.createElement("li");
        li.classList.add("quote-item");
        li.dataset.index = index;
        li.dataset.quoteId = `quote-${index}`;

        const icon = document.createElement("i");
        icon.classList.add("fas", "fa-quote-right", "quote-icon");

        const textContainer = document.createElement("div");
        textContainer.classList.add("quote-text");
        textContainer.textContent = quote;

        const btnContainer = document.createElement("div");
        btnContainer.classList.add("quote-actions");

        const editBtn = document.createElement("button");
        editBtn.classList.add("btn-action", "btn-edit");
        editBtn.setAttribute("data-action", "edit");
        editBtn.setAttribute("title", "Edit quote");
        editBtn.innerHTML = '<i class="fas fa-edit"></i>';

        const delBtn = document.createElement("button");
        delBtn.classList.add("btn-action", "btn-delete");
        delBtn.setAttribute("data-action", "delete");
        delBtn.setAttribute("title", "Delete quote");
        delBtn.innerHTML = '<i class="fas fa-trash"></i>';

        btnContainer.appendChild(editBtn);
        btnContainer.appendChild(delBtn);
        li.append(icon, textContainer, btnContainer);
        list.appendChild(li);
    });
}

// 3. EVENTS
addBtn.addEventListener("click", (event) => {
    addOrUpdateQuote(event);
});

input.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        addOrUpdateQuote(event);
    }
});

input.addEventListener("input", (event) => {
    const value = event.target.value;
    if (value.trim() === "") {
        addBtn.setAttribute("disabled", "true");
        addBtn.style.opacity = "0.5";
    } else {
        addBtn.removeAttribute("disabled");
        addBtn.style.opacity = "1";
    }
});

clearAllBtn.addEventListener("click", (event) => {
    handleClearAll(event);
});

// 4. EVENT DELEGATION
list.addEventListener("click", (event) => {
    const button = event.target.closest(".btn-action");
    if (button) {
        event.stopPropagation();
        const quoteItem = button.closest(".quote-item");
        const action = button.getAttribute("data-action");
        const index = parseInt(quoteItem.dataset.index);
        if (action === "edit") {
            editQuote(index);
        } else if (action === "delete") {
            deleteQuote(index);
        }
    }
});

// 5. EVENT PROPAGATION
container.addEventListener("click", () => {
    console.log("Container clicked (bubbling phase)");
}, false);

// 6. QUOTE OPERATIONS
function addOrUpdateQuote(event) {
    const quoteText = input.value.trim();
    if (quoteText === "") {
        alert("Quote cannot be empty!");
        input.focus();
        return;
    }

    if (editingIndex !== null) {
        quotes[editingIndex] = quoteText;
        editingIndex = null;
        addBtn.classList.remove("btn-update");
        addBtn.innerHTML = '<i class="fas fa-plus"></i><span>Add Quote</span>';
    } else {
        quotes.push(quoteText);
    }

    input.value = "";
    input.focus();
    saveQuotes();
    renderQuotes();
}

function editQuote(index) {
    input.value = quotes[index];
    input.focus();
    editingIndex = index;
    addBtn.classList.add("btn-update");
    addBtn.innerHTML = '<i class="fas fa-check"></i><span>Update Quote</span>';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function deleteQuote(index) {
    if (confirm("Are you sure you want to delete this quote?")) {
        quotes.splice(index, 1);
        if (editingIndex === index) {
            editingIndex = null;
            addBtn.classList.remove("btn-update");
            addBtn.innerHTML = '<i class="fas fa-plus"></i><span>Add Quote</span>';
            input.value = "";
        }
        saveQuotes();
        renderQuotes();
    }
}

function handleClearAll(event) {
    if (quotes.length === 0) return;
    if (confirm(`Are you sure you want to delete all ${quotes.length} quotes? This cannot be undone!`)) {
        quotes = [];
        editingIndex = null;
        input.value = "";
        addBtn.classList.remove("btn-update");
        addBtn.innerHTML = '<i class="fas fa-plus"></i><span>Add Quote</span>';
        saveQuotes();
        renderQuotes();
    }
}

// 7. LOCAL STORAGE
function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
}

function removeQuotesFromStorage() {
    localStorage.removeItem("quotes");
}

function clearAllStorage() {
    localStorage.clear();
}

// 8. INIT
renderQuotes();
input.focus();

console.log("=== Mini Quote Saver Loaded ===");
console.log("DOM Selectors: ✓");
console.log("Element Creation: ✓");
console.log("Event Listeners: ✓");
console.log("Event Delegation: ✓");
console.log("Event Propagation: ✓");
console.log("localStorage: ✓");
