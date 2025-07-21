// Task 1: JavaScript Basics & Setup
console.log("Welcome to the Community Portal");
window.onload = function() {
    alert("Welcome to the Community Portal! Page is fully loaded.");
};

// Task 2: Syntax, Data Types, and Operators
// Using a mock event for demonstration
const eventName = "Community Music Fest";
const eventDate = "2025-07-15";
let availableSeats = 100;

console.log(`Event Details: ${eventName} on ${eventDate}. Seats available: ${availableSeats}`);

// Simulate registration
function registerForMockEvent() {
    if (availableSeats > 0) {
        availableSeats--;
        console.log(`Registered for ${eventName}. Seats remaining: ${availableSeats}`);
    } else {
        console.log(`${eventName} is full!`);
    }
}

// Simulate cancellation (using ++ for seat count)
function cancelMockRegistration() {
    availableSeats++;
    console.log(`Cancelled registration for ${eventName}. Seats remaining: ${availableSeats}`);
}

// Task 5: Objects and Prototypes
// Task 6: Arrays and Methods
// Task 9: Async JS, Promises, Async/Await
// Task 10: Modern JavaScript Features
// Mock Event Data (will be fetched)
let eventsData = []; // This will hold our fetched events

class Event {
    constructor(id, name, date, category, location, initialSeats, imageUrl) {
        this.id = id;
        this.name = name;
        this.date = new Date(date);
        this.category = category;
        this.location = location;
        this.seats = initialSeats;
        this.imageUrl = imageUrl;
    }

    checkAvailability() {
        return this.seats > 0;
    }

    register() {
        if (this.checkAvailability()) {
            this.seats--;
            return true;
        }
        return false;
    }
}

// Mock API endpoint (using JSONPlaceholder for a simple data structure)
const MOCK_API_EVENTS_URL = 'https://jsonplaceholder.typicode.com/posts?_limit=6';
const MOCK_API_REGISTRATION_URL = 'https://jsonplaceholder.typicode.com/posts'; // Mock POST endpoint

// Async function to fetch events (Task 9 & 10)
async function fetchEvents() {
    const loadingSpinner = document.getElementById('loadingSpinner');
    loadingSpinner.style.display = 'block'; // Show spinner

    try {
        const response = await fetch(MOCK_API_EVENTS_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        // Custom event names and image paths
        const customEventNames = ["Music Fest", "Art Workshop", "Food Carnival", "Yoga Morning", "Clean-Up Drive", "Kids Fun Fair"];
        const customImagePaths = ["a11.jfif", "a2.jpg", "a33.jpg", "a4.jpg", "a5.jpg", "a6.jpg"];

        // Map mock data to our Event class instances
        eventsData = data.map((post, index) => {
            const eventCategories = ["Music", "Art", "Food", "Wellness", "Community", "Kids"];
            const eventLocations = ["Community Hall", "Park Amphitheater", "City Square", "Youth Center"];
            
            return new Event(
                post.id,
                customEventNames[index % customEventNames.length], // Use custom event names
                `2025-0${(index % 9) + 4}-1${(index % 9) + 1}`, // Dates in the future for testing conditionals
                eventCategories[index % eventCategories.length],
                eventLocations[index % eventLocations.length],
                Math.floor(Math.random() * 50) + 10, // Random seats 10-59
                customImagePaths[index % customImagePaths.length] // Use custom image paths
            );
        });
        displayEvents(eventsData);
        populateEventRegistrationDropdown(eventsData);
    } catch (error) {
        console.error("Failed to fetch events:", error);
        document.getElementById('eventsList').innerHTML = '<p style="color: red;">Failed to load events. Please try again later.</p>';
    } finally {
        loadingSpinner.style.display = 'none'; // Hide spinner
    }
}

// Task 4: Functions, Scope, Closures, Higher-Order Functions
// Task 7: DOM Manipulation
// Task 3: Conditionals, Loops, and Error Handling
// Task 6: Arrays and Methods
// Task 8: Event Handling

// Closure to track total registrations for a category (Task 4)
function createCategoryRegistrationTracker() {
    const registrations = {}; // Private variable

    return function(category) {
        registrations[category] = (registrations[category] || 0) + 1;
        console.log(`Total registrations for ${category}: ${registrations[category]}`);
    };
}
const trackCategoryRegistration = createCategoryRegistrationTracker();

// Function to add a new event (Task 4 & 6 - .push()) - simplified for front-end
function addEvent(name, date, category, location, seats, imageUrl) {
    const newId = eventsData.length > 0 ? Math.max(...eventsData.map(e => e.id)) + 1 : 1;
    const newEvent = new Event(newId, name, date, category, location, seats, imageUrl);
    eventsData.push(newEvent); // Add new events using .push() - Task 6
    displayEvents(eventsData); // Re-render events
    populateEventRegistrationDropdown(eventsData);
    console.log("New event added:", newEvent);
}

// Register user function (Task 4 & 12)
async function registerUser(eventId, userName, userEmail) {
    const event = eventsData.find(e => e.id === eventId);
    const registrationMessage = document.getElementById('registrationMessage');
    const registrationError = document.getElementById('registrationError');
    registrationMessage.textContent = '';
    registrationError.textContent = '';

    if (!event) {
        registrationError.textContent = 'Error: Event not found.';
        return;
    }

    if (!event.checkAvailability()) {
        registrationError.textContent = `${event.name} is full!`;
        return;
    }

    try {
        // Use setTimeout() to simulate a delayed response - Task 12
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Use fetch() to POST user data to a mock API - Task 12
        const response = await fetch(MOCK_API_REGISTRATION_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                eventId: event.id,
                userName: userName,
                userEmail: userEmail,
                registrationDate: new Date().toISOString()
            }),
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        const responseData = await response.json();
        console.log("Registration successful (mock API response):", responseData);

        // If successful, update local state
        event.register();
        trackCategoryRegistration(event.category); // Use closure - Task 4
        displayEvents(eventsData); // Update UI
        updateEventCardUI(event.id); // Specific UI update for the registered event
        registrationMessage.textContent = `Registration successful for ${event.name}!`;
        // Show success/failure message after submission - Task 12
        $('#registrationMessage').fadeIn().delay(3000).fadeOut(); // jQuery fadeIn/fadeOut (Task 14)

        // Clear form after successful registration
        document.getElementById('registrationForm').reset();

    } catch (error) { // Wrap registration logic in try-catch to handle errors - Task 3
        console.error("Registration failed:", error);
        registrationError.textContent = `Registration failed: ${error.message}. Please try again.`;
        // Show success/failure message after submission - Task 12
        $('#registrationError').fadeIn().delay(3000).fadeOut(); // jQuery fadeIn/fadeOut (Task 14)

    }
}

// Filter events by category (Task 4 - higher-order function, Task 8 - onchange)
function filterEventsByCategory(events, category, callback) {
    // Use .filter() to show only music events (example, applied generally here) - Task 6
    const filtered = events.filter(event => category === "all" || event.category === category);
    if (callback && typeof callback === 'function') { // Pass callbacks to filter functions for dynamic search - Task 4
        callback(filtered);
    }
    return filtered;
}

// Display events dynamically (Task 7, Task 3 - conditionals & loop)
function displayEvents(eventsToDisplay) {
    const eventsListDiv = document.getElementById('eventsList'); // Access DOM elements using querySelector() - Task 7
    eventsListDiv.innerHTML = ''; // Clear existing events

    eventsToDisplay.forEach(event => { // Loop through the event list and display using forEach() - Task 3
        const eventCard = document.createElement('div'); // Create and append event cards using createElement() - Task 7
        eventCard.classList.add('event-card');
        eventCard.setAttribute('data-event-id', event.id); // For easy access

        // Check if event is past or full (Task 3)
        const now = new Date();
        const isPastEvent = event.date < now;
        const isFullEvent = !event.checkAvailability();

        if (isPastEvent) { // Use if-else to hide past or full events - Task 3
            eventCard.classList.add('past-event');
        } else if (isFullEvent) {
            eventCard.classList.add('full-event');
        }

        // Destructuring to extract event details (Task 10)
        const { name, date, category, location, seats, imageUrl } = event;

        eventCard.innerHTML = `
            <img src="${imageUrl}" alt="${name}" style="width:100%; height:150px; object-fit:cover; border-radius: 5px;">
            <h3>${name}</h3>
            <p>Date: ${date.toLocaleDateString()}</p>
            <p class="category">Category: ${category}</p>
            <p class="location">Location: ${location}</p>
            <p class="seats">Seats Available: <span id="seats-${event.id}">${seats}</span></p>
            <button class="register-button" data-event-id="${event.id}" ${isPastEvent || isFullEvent ? 'disabled' : ''}>
                ${isPastEvent ? 'Event Ended' : (isFullEvent ? 'Full' : 'Register')}
            </button>
        `;
        eventsListDiv.appendChild(eventCard);
    });

    // Attach event listeners to new buttons (Task 8 - onclick)
    document.querySelectorAll('.register-button').forEach(button => {
        $(button).off('click').on('click', function() { // Use $('#registerBtn').click(...) to handle click events - Task 14
            const eventId = parseInt(this.dataset.eventId);
            // Open the registration form and pre-select the event
            document.getElementById('selectedEventId').value = eventId;
            document.getElementById('register').scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Use .fadeIn() for new event cards (Task 14)
    $('.event-card').hide().fadeIn(800);
}

// Update UI when user registers or cancels (Task 7)
function updateEventCardUI(eventId) {
    const event = eventsData.find(e => e.id === eventId);
    if (event) {
        const eventCard = document.querySelector(`.event-card[data-event-id="${eventId}"]`);
        if (eventCard) {
            const seatsSpan = eventCard.querySelector(`#seats-${eventId}`);
            if (seatsSpan) {
                seatsSpan.textContent = event.seats;
            }
            const registerButton = eventCard.querySelector('.register-button');
            if (registerButton) {
                if (!event.checkAvailability()) {
                    registerButton.textContent = 'Full';
                    registerButton.disabled = true;
                    eventCard.classList.add('full-event');
                } else {
                     // Re-enable if seats become available
                    registerButton.textContent = 'Register';
                    registerButton.disabled = false;
                    eventCard.classList.remove('full-event');
                }
                const now = new Date();
                if (event.date < now) { // Ensure past events remain disabled
                     registerButton.textContent = 'Event Ended';
                     registerButton.disabled = true;
                     eventCard.classList.add('past-event');
                }
            }
        }
    }
}


// Function to populate the event registration dropdown (Task 7)
function populateEventRegistrationDropdown(events) {
    const selectElement = document.getElementById('selectedEventId');
    selectElement.innerHTML = '<option value="">--Select an Event--</option>'; // Clear existing options

    // Filter for only upcoming events with seats for registration dropdown
    const now = new Date();
    const upcomingEvents = events.filter(event => event.date >= now && event.checkAvailability());

    upcomingEvents.forEach(event => {
        const option = document.createElement('option');
        option.value = event.id;
        option.textContent = `${event.name} (${event.date.toLocaleDateString()}) - ${event.seats} seats left`;
        selectElement.appendChild(option);
    });
}


// Event Listeners for filters and search (Task 8)
document.getElementById('categoryFilter').onchange = function() { // Use onchange to filter events by category - Task 8
    const selectedCategory = this.value;
    // Use spread operator to clone event list before filtering (Task 10)
    const filteredEvents = filterEventsByCategory([...eventsData], selectedCategory, (result) => {
        displayEvents(result);
    });
};

document.getElementById('searchEvents').onkeydown = function(event) { // Use keydown to allow quick search by name - Task 8
    // Use a simple debounce for search in a real app
    // For now, it filters on each keydown
    const searchTerm = this.value.toLowerCase();
    const filtered = eventsData.filter(event => event.name.toLowerCase().includes(searchTerm));
    displayEvents(filtered);
};


// Task 11: Working with Forms
document.getElementById('registrationForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form behavior using event.preventDefault() - Task 11

    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const selectedEventIdInput = document.getElementById('selectedEventId');
    const registrationError = document.getElementById('registrationError');

    registrationError.textContent = ''; // Clear previous errors

    // Capture name, email, and selected event using form.elements - Task 11
    const formData = {
        name: this.elements.name.value,
        email: this.elements.email.value,
        selectedEventId: parseInt(this.elements.selectedEventId.value)
    };

    // Validate inputs and show errors inline - Task 11
    if (!formData.name || formData.name.trim() === '') {
        registrationError.textContent = 'Please enter your full name.';
        return;
    }
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        registrationError.textContent = 'Please enter a valid email address.';
        return;
    }
    if (!formData.selectedEventId) {
        registrationError.textContent = 'Please select an event.';
        return;
    }

    // Call registerUser (Task 12)
    registerUser(formData.selectedEventId, formData.name, formData.email);
});

// Task 13: Debugging and Testing
// The console logs throughout the script are part of debugging.
// Log form submission steps and check fetch request payload - Task 13
const originalFetch = window.fetch; // Store original fetch for potential override later
window.fetch = async (...args) => {
    const [resource, options] = args;
    console.groupCollapsed(`Workspace Request: ${options?.method || 'GET'} ${resource}`);
    console.log('Request URL:', resource);
    console.log('Request Options:', options);
    if (options && options.body) {
        try {
            console.log('Request Payload:', JSON.parse(options.body)); // Log JSON payload
        } catch (e) {
            console.log('Request Body (not JSON):', options.body);
        }
    }
    console.groupEnd();
    const response = await originalFetch(...args);
    // Add breakpoints and inspect variables - Task 13 (Developers would do this in DevTools)
    console.log('Response Status:', response.status);
    // Clone response to read body without consuming it for the actual app logic
    const clonedResponse = response.clone();
    try {
        const responseData = await clonedResponse.json();
        console.log('Response Data:', responseData);
    } catch (e) {
        console.log('Response Body (not JSON or empty):', await clonedResponse.text());
    }
    return response;
};
// Use Chrome Dev Tools Console and Network tab - Task 13

// Initial fetch of events when the page loads
document.addEventListener('DOMContentLoaded', fetchEvents);

// Task 10: Modern JavaScript Features - (already implemented throughout with const/let, destructuring, spread operator)
// Default parameters in functions (Task 10)
function logActivity(msg = "No activity reported", type = "event") {
    console.log(`[${type.toUpperCase()}]: ${msg}`);
}
logActivity("User viewed events.");
logActivity("Error during data processing.", "error");


// Task 14: jQuery and JS Frameworks
// Using jQuery for button click (Task 14)
$('#registerBtn').click(function() {
    console.log("Register button clicked (via jQuery)");
});

// The fadeIn/fadeOut for messages are already integrated into registerUser function.
// $('.event-card').fadeIn() is used in displayEvents.

// Mention one benefit of moving to frameworks like React or Vue - Task 14
// Benefit: **Component-Based Architecture.** Frameworks like React and Vue promote building UIs as reusable, isolated components, which significantly improves code maintainability, scalability, and collaboration on large projects.