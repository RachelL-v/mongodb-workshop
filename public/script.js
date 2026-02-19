// DOM Elements
const rotaForm = document.getElementById('rotaForm');
const nameInput = document.getElementById('name');
const dutiesContainer = document.getElementById('dutiesContainer');
const currentDateElement = document.getElementById('currentDate');
const rotaList = document.getElementById('rotaList');
const emptyMessage = document.getElementById('emptyMessage');
const randomBtn = document.getElementById('randomBtn');

let allChores = [];
let selectedDuties = [];

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadChores();
    loadRota();
    updateDate();
    setupEventListeners();

    // Update date every minute
    setInterval(updateDate, 60000);
});

// Update current date display
function updateDate() {
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateString = today.toLocaleDateString('en-US', options);
    currentDateElement.textContent = dateString;
}

// Load available chores from API
async function loadChores() {
    try {
        const response = await fetch('/api/chores');
        allChores = await response.json();
        displayChores();
    } catch (error) {
        console.error('Error loading chores:', error);
    }
}

// Display chores as checkboxes
function displayChores() {
    dutiesContainer.innerHTML = '';
    allChores.forEach(chore => {
        const label = document.createElement('label');
        label.className = 'duty-checkbox';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = chore;
        checkbox.addEventListener('change', updateSelectedDuties);

        const textSpan = document.createElement('label');
        textSpan.textContent = chore;

        label.appendChild(checkbox);
        label.appendChild(textSpan);
        dutiesContainer.appendChild(label);
    });
}

// Update selected duties when checkboxes change
function updateSelectedDuties() {
    const checkboxes = dutiesContainer.querySelectorAll('input[type="checkbox"]');
    selectedDuties = Array.from(checkboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.value);
}

// Get random chore and add to selection
async function getRandomChore() {
    try {
        const response = await fetch('/api/random-chore');
        const data = await response.json();
        const chore = data.chore;

        // Add to selected duties if not already there
        if (!selectedDuties.includes(chore)) {
            selectedDuties.push(chore);
        }

        // Update checkboxes
        const checkboxes = dutiesContainer.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(cb => {
            cb.checked = selectedDuties.includes(cb.value);
        });

        // Show notification
        showNotification(`Added: ${chore}`);
    } catch (error) {
        console.error('Error getting random chore:', error);
    }
}

// Setup event listeners
function setupEventListeners() {
    rotaForm.addEventListener('submit', handleFormSubmit);
    randomBtn.addEventListener('click', (e) => {
        e.preventDefault();
        getRandomChore();
    });
}

// Handle form submission
async function handleFormSubmit(e) {
    e.preventDefault();

    const name = nameInput.value.trim();
    if (!name) {
        showNotification('Please enter a name', 'error');
        return;
    }

    if (selectedDuties.length === 0) {
        showNotification('Please select at least one duty', 'error');
        return;
    }

    try {
        const response = await fetch('/api/rota', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                duties: selectedDuties
            })
        });

        if (!response.ok) {
            throw new Error('Failed to add rota item');
        }

        // Reset form
        nameInput.value = '';
        selectedDuties = [];
        const checkboxes = dutiesContainer.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(cb => cb.checked = false);

        showNotification('Rota item added successfully!');
        loadRota();
    } catch (error) {
        console.error('Error adding rota item:', error);
        showNotification('Failed to add rota item', 'error');
    }
}

// Load and display rota items
async function loadRota() {
    try {
        const response = await fetch('/api/rota');
        const items = await response.json();

        if (items.length === 0) {
            rotaList.innerHTML = '';
            emptyMessage.style.display = 'block';
            return;
        }

        emptyMessage.style.display = 'none';
        rotaList.innerHTML = '';

        items.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'rota-item show';

            const contentDiv = document.createElement('div');
            contentDiv.className = 'rota-content';

            const nameDiv = document.createElement('div');
            nameDiv.className = 'rota-name';
            nameDiv.textContent = item.name;

            const dateDiv = document.createElement('div');
            dateDiv.className = 'rota-date';
            const displayDate = new Date(item.date).toLocaleDateString('en-US', {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
            dateDiv.textContent = `📅 ${displayDate}`;

            const dutiesDiv = document.createElement('div');
            dutiesDiv.className = 'rota-duties';
            item.duties.forEach(duty => {
                const tag = document.createElement('span');
                tag.className = 'duty-tag';
                tag.textContent = duty;
                dutiesDiv.appendChild(tag);
            });

            contentDiv.appendChild(nameDiv);
            contentDiv.appendChild(dateDiv);
            contentDiv.appendChild(dutiesDiv);

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.textContent = '🗑️ Delete';
            deleteBtn.addEventListener('click', () => deleteItem(item._id));

            itemDiv.appendChild(contentDiv);
            itemDiv.appendChild(deleteBtn);
            rotaList.appendChild(itemDiv);
        });
    } catch (error) {
        console.error('Error loading rota:', error);
    }
}

// Delete rota item
async function deleteItem(id) {
    if (!confirm('Are you sure you want to delete this item?')) {
        return;
    }

    try {
        const response = await fetch(`/api/rota/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Failed to delete item');
        }

        showNotification('Item deleted successfully');
        loadRota();
    } catch (error) {
        console.error('Error deleting item:', error);
        showNotification('Failed to delete item', 'error');
    }
}

// Show notification message
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background-color: ${type === 'error' ? '#ff6b6b' : '#51cf66'};
        color: white;
        border-radius: 8px;
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
        max-width: 300px;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add slide out animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOut {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(400px);
        }
    }
`;
document.head.appendChild(style);
