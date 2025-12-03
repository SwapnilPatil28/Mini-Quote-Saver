// ========================================
// Mini Quote Saver with localStorage
// Demonstrating: DOM Manipulation, Events, Event Delegation, localStorage
// ========================================

// Load quotes from localStorage (JSON parsing for objects)
let quotes = JSON.parse(localStorage.getItem("quotes")) || [];
let editingIndex = null;

// ========================================
// 1. DOM SELECTORS - Multiple Methods
// ========================================

// getElementById - Direct element selection
const input = document.getElementById("quoteInput");
const addBtn = document.getElementById("addBtn");
const list = document.getElementById("quoteList");
const emptyState = document.getElementById("emptyState");
const clearAllBtn = document.getElementById("clearAllBtn");

// querySelector - CSS selector (first match)
const quoteCount = document.querySelector("#quoteCount");
const container = document.querySelector(".container");

// querySelectorAll - CSS selector (all matches) - Used for potential multiple elements
const allButtons = document.querySelectorAll("button");

// Note: getElementsByClassName & getElementsByTagName return live HTMLCollection
// querySelectorAll returns static NodeList

// ========================================
// 2. CREATING & MODIFYING ELEMENTS
// ========================================
function renderQuotes() {
    // Clear list - innerHTML method
    list.innerHTML = "";

    // Update quote count - textContent modification
    quoteCount.textContent = quotes.length;

    // Show/hide empty state using classList
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
        // createElement - Creating new DOM elements
        const li = document.createElement("li");
        
        // Using classList.add to add classes
        li.classList.add("quote-item");
        
        // dataset usage - storing index as data attribute
        li.dataset.index = index;
        li.dataset.quoteId = `quote-${index}`;

        // Create quote icon
        const icon = document.createElement("i");
        icon.classList.add("fas", "fa-quote-right", "quote-icon");

        // Create quote text container
        const textContainer = document.createElement("div");
        textContainer.classList.add("quote-text");
        textContainer.textContent = quote;

        // Create button container
        const btnContainer = document.createElement("div");
        btnContainer.classList.add("quote-actions");

        // Create Edit button with setAttribute
        const editBtn = document.createElement("button");
        editBtn.classList.add("btn-action", "btn-edit");
        editBtn.setAttribute("data-action", "edit");
        editBtn.setAttribute("title", "Edit quote");
        editBtn.innerHTML = '<i class="fas fa-edit"></i>';

        // Create Delete button with setAttribute
        const delBtn = document.createElement("button");
        delBtn.classList.add("btn-action", "btn-delete");
        delBtn.setAttribute("data-action", "delete");
        delBtn.setAttribute("title", "Delete quote");
        delBtn.innerHTML = '<i class="fas fa-trash"></i>';

        // appendChild - Append elements
        btnContainer.appendChild(editBtn);
        btnContainer.appendChild(delBtn);

        // append - Modern method (can append multiple)
        li.append(icon, textContainer, btnContainer);

        // appendChild - Add to list
        list.appendChild(li);
    });
}

// ========================================
// 3. EVENTS - addEventListener with various event types
// ========================================

// Event: click
addBtn.addEventListener("click", (event) => {
    // event object usage
    console.log("Button clicked:", event.target);
    addOrUpdateQuote(event);
});

// Event: keypress (for Enter key)
input.addEventListener("keypress", (event) => {
    // Using event.key property
    if (event.key === "Enter") {
        event.preventDefault(); // Prevent form submission if in a form
        addOrUpdateQuote(event);
    }
});

// Event: input (real-time input changes)
input.addEventListener("input", (event) => {
    // event.target gives us the input element
    const value = event.target.value;
    
    // Visual feedback - disable button if empty
    if (value.trim() === "") {
        addBtn.setAttribute("disabled", "true");
        addBtn.style.opacity = "0.5";
    } else {
        addBtn.removeAttribute("disabled");
        addBtn.style.opacity = "1";
    }
});

// Event: click on Clear All button
clearAllBtn.addEventListener("click", (event) => {
    handleClearAll(event);
});

// ========================================
// 5. EVENT DELEGATION
// Using a single event listener on parent (list) for all quote actions
// This is efficient for dynamically created elements
// ========================================
list.addEventListener("click", (event) => {
    // event.target - the element that was actually clicked
    // event.currentTarget - the element with the listener (list)
    
    console.log("Clicked element:", event.target);
    console.log("Event listener on:", event.currentTarget);
    
    // Find the button (might click icon inside button)
    const button = event.target.closest(".btn-action");
    
    if (button) {
        // Stop event from bubbling further
        event.stopPropagation();
        
        // Find the parent quote item
        const quoteItem = button.closest(".quote-item");
        
        // getAttribute - Get data attribute
        const action = button.getAttribute("data-action");
        const index = parseInt(quoteItem.dataset.index);
        
        console.log(`Action: ${action}, Index: ${index}`);
        
        // Handle different actions
        if (action === "edit") {
            editQuote(index);
        } else if (action === "delete") {
            deleteQuote(index);
        }
    }
});

// ========================================
// 4. EVENT PROPAGATION DEMONSTRATION
// Bubbling phase example (default)
// ========================================
container.addEventListener("click", (event) => {
    // This will fire after child elements due to bubbling
    console.log("Container clicked (bubbling phase)");
}, false); // false = bubbling (default)

// You can also use capturing phase by setting third parameter to true:
// container.addEventListener("click", handler, true); // Capturing phase

// ========================================
// QUOTE OPERATIONS
// ========================================

function addOrUpdateQuote(event) {
    const quoteText = input.value.trim();

    if (quoteText === "") {
        alert("Quote cannot be empty!");
        input.focus();
        return;
    }

    if (editingIndex !== null) {
        // Update existing quote
        quotes[editingIndex] = quoteText;
        editingIndex = null;
        
        // classList.remove to change button state
        addBtn.classList.remove("btn-update");
        addBtn.innerHTML = '<i class="fas fa-plus"></i><span>Add Quote</span>';
    } else {
        // Add new quote
        quotes.push(quoteText);
    }

    // Clear input
    input.value = "";
    input.focus();
    
    // Save to localStorage
    saveQuotes();
    
    // Re-render
    renderQuotes();
}

function editQuote(index) {
    // Set input value
    input.value = quotes[index];
    input.focus();
    editingIndex = index;
    
    // classList.add to change button state
    addBtn.classList.add("btn-update");
    addBtn.innerHTML = '<i class="fas fa-check"></i><span>Update Quote</span>';
    
    // Smooth scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function deleteQuote(index) {
    if (confirm("Are you sure you want to delete this quote?")) {
        // Remove from array
        quotes.splice(index, 1);
        
        // Reset edit mode if deleting the quote being edited
        if (editingIndex === index) {
            editingIndex = null;
            addBtn.classList.remove("btn-update");
            addBtn.innerHTML = '<i class="fas fa-plus"></i><span>Add Quote</span>';
            input.value = "";
        }
        
        // Save and re-render
        saveQuotes();
        renderQuotes();
    }
}

function handleClearAll(event) {
    if (quotes.length === 0) return;
    
    if (confirm(`Are you sure you want to delete all ${quotes.length} quotes? This cannot be undone!`)) {
        // Clear array
        quotes = [];
        editingIndex = null;
        input.value = "";
        
        // Reset button state
        addBtn.classList.remove("btn-update");
        addBtn.innerHTML = '<i class="fas fa-plus"></i><span>Add Quote</span>';
        
        // Save and re-render
        saveQuotes();
        renderQuotes();
    }
}

// ========================================
// 6. LOCAL STORAGE - All methods
// ========================================

// setItem with JSON.stringify (storing objects)
function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
}

// getItem with JSON.parse (retrieving objects) - already used at top
// let quotes = JSON.parse(localStorage.getItem("quotes")) || [];

// Example of removeItem (if needed)
function removeQuotesFromStorage() {
    localStorage.removeItem("quotes");
}

// Example of clear (clears all localStorage)
function clearAllStorage() {
    localStorage.clear();
}

// ========================================
// INITIALIZE ON PAGE LOAD
// ========================================
renderQuotes();
input.focus();

console.log("=== Mini Quote Saver Loaded ===");
console.log("DOM Selectors: ✓");
console.log("Element Creation: ✓");
console.log("Event Listeners: ✓");
console.log("Event Delegation: ✓");
console.log("Event Propagation: ✓");
console.log("localStorage: ✓");
