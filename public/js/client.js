const socket = io('http://localhost:8000');

const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector(".container");
var audio = new Audio('notification.mp3');

let name = null;  // Track if name is entered

// Handle incoming and outgoing messages
const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message', position);
    messageContainer.append(messageElement);
    if (position === 'left') {
        audio.play();
    }
};

// Intercept message form submission
form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!name) return; // Don't allow sending before name is set

    const message = messageInput.value;
    if (message.trim() !== "") {
        append(`You: ${message}`, 'right');
        socket.emit('send', message);
        messageInput.value = ""; // Clear the input
    }
});

// Show name input overlay
const nameOverlay = document.getElementById('name-prompt');
const nameInputField = document.getElementById('nameInput');
const nameSubmitButton = document.getElementById('nameSubmit');

nameSubmitButton.addEventListener('click', () => {
    const inputName = nameInputField.value.trim();
    if (inputName !== '') {
        name = inputName;
        nameOverlay.style.display = 'none';
        socket.emit('new-user-joined', name);
    } else {
        alert("Please enter your name to continue.");
    }
});

// Socket events
socket.on('user-joined', name => {
    append(`${name} joined the chat!`, 'left');
});

socket.on('receive', data => {
    append(`${data.name}: ${data.message}`, 'left');
});

socket.on('left', name => {
    append(`${name} left the chat.`, 'left');
});
