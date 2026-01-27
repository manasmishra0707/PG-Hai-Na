// -----------------------------
// Initialization
// -----------------------------
let pgData = JSON.parse(localStorage.getItem("pgData")) || [];
let users = JSON.parse(localStorage.getItem("users")) || [];
let editIndex = null;

window.onload = () => {
    show("login"); // default screen
};

// -----------------------------
// Section Navigation (CSS-based)
// -----------------------------
function show(sectionId) {
    document.querySelectorAll(".section").forEach(section => {
        section.classList.remove("active");
    });

    const target = document.getElementById(sectionId);
    if (target) {
        target.classList.add("active");
    }
}

// -----------------------------
// Register
// -----------------------------
function registerUser() {
    const name = document.getElementById("registerName").value.trim();
    const email = document.getElementById("registerEmail").value.trim();
    const password = document.getElementById("registerPassword").value;

    if (!name || !email || !password) {
        alert("Please fill all fields");
        return;
    }

    if (users.some(u => u.email === email)) {
        alert("User already exists");
        return;
    }

    users.push({ name, email, password });
    localStorage.setItem("users", JSON.stringify(users));

    alert("Registration successful!");
    show("login");
}

// -----------------------------
// Login
// -----------------------------
function login() {
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    if (!email || !password) {
        alert("Please fill all fields");
        return;
    }

    const user = users.find(
        u => u.email === email && u.password === password
    );

    if (user) {
        localStorage.setItem("login", "true");
        localStorage.setItem("currentUser", email);
        alert("Login successful!");
        show("dashboard");
    } else {
        alert("Invalid email or password");
    }
}

// -----------------------------
// Logout
// -----------------------------
function logout() {
    localStorage.removeItem("login");
    localStorage.removeItem("currentUser");
    show("login");
}

// -----------------------------
// Add / Edit PG
// -----------------------------
function addPG() {
    const name = document.getElementById("pgName").value.trim();
    const city = document.getElementById("pgCity").value.trim();
    const rent = document.getElementById("pgRent").value;
    const type = document.getElementById("pgType").value;
    const file = document.getElementById("pgImage").files[0];

    if (!name || !city || !rent) {
        alert("Please fill all fields");
        return;
    }

    const savePG = (image) => {
        const pg = { name, city, rent, type, image };

        if (editIndex !== null) {
            pgData[editIndex] = pg;
            editIndex = null;
        } else {
            pgData.push(pg);
        }

        localStorage.setItem("pgData", JSON.stringify(pgData));
        clearPGForm();
        showPGList();
    };

    if (file) {
        const reader = new FileReader();
        reader.onload = () => savePG(reader.result);
        reader.readAsDataURL(file);
    } else if (editIndex !== null) {
        savePG(pgData[editIndex].image);
    }
}

// -----------------------------
// Show PG List
// -----------------------------
function showPGList() {
    show("pglist");
    displayPGs();
}

function displayPGs() {
    const cityFilter = document.getElementById("filterCity").value.toLowerCase();
    const typeFilter = document.getElementById("filterType").value;
    const container = document.getElementById("pgContainer");

    container.innerHTML = "";

    if (pgData.length === 0) {
        container.innerHTML = "<p>No PGs available</p>";
        return;
    }

    pgData.forEach((pg, index) => {
        if (cityFilter && !pg.city.toLowerCase().includes(cityFilter)) return;
        if (typeFilter && pg.type !== typeFilter) return;

        container.innerHTML += `
            <div class="card">
                <img src="${pg.image}" alt="${pg.name}">
                <h3>${pg.name}</h3>
                <p>City: ${pg.city}</p>
                <p>₹${pg.rent} / ${pg.type}</p>
                <button onclick="editPG(${index})">Edit</button>
                <button onclick="deletePG(${index})">Delete</button>
            </div>
        `;
    });
}

// -----------------------------
// Edit / Delete PG
// -----------------------------
function editPG(index) {
    const pg = pgData[index];
    document.getElementById("pgName").value = pg.name;
    document.getElementById("pgCity").value = pg.city;
    document.getElementById("pgRent").value = pg.rent;
    document.getElementById("pgType").value = pg.type;

    editIndex = index;
    show("addpg");
}

function deletePG(index) {
    if (confirm("Delete this PG?")) {
        pgData.splice(index, 1);
        localStorage.setItem("pgData", JSON.stringify(pgData));
        displayPGs();
    }
}

// -----------------------------
// Clear Form
// -----------------------------
function clearPGForm() {
    document.getElementById("pgName").value = "";
    document.getElementById("pgCity").value = "";
    document.getElementById("pgRent").value = "";
    document.getElementById("pgType").value = "Full";
    document.getElementById("pgImage").value = "";
}
