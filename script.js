// -----------------------------
// Initialization
// -----------------------------
let pgData = JSON.parse(localStorage.getItem("pgData")) || [];
let users = JSON.parse(localStorage.getItem("users")) || [];
let editIndex = null;

function init() {
    updateNav();
}

// -----------------------------
// Navigation
// -----------------------------
function show(id) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

function updateNav() {
    let logged = localStorage.getItem("login") === "true";
    document.getElementById("loginNav").style.display = logged ? "none" : "inline";
    document.getElementById("registerNav").style.display = logged ? "none" : "inline";
    document.getElementById("dashNav").style.display = logged ? "inline" : "none";
    document.getElementById("logoutNav").style.display = logged ? "inline" : "none";
}

// -----------------------------
// Register
// -----------------------------
function registerUser() {
    let name = document.getElementById("registerName").value.trim();
    let email = document.getElementById("registerEmail").value.trim();
    let password = document.getElementById("registerPassword").value;

    if (!name || !email || !password) {
        alert("Please fill all fields");
        return;
    }

    if (users.some(u => u.email === email)) {
        alert("User already exists with this email");
        return;
    }

    users.push({ name, email, password });
    localStorage.setItem("users", JSON.stringify(users));
    alert("Registered Successfully!");
    show('login');
}

// -----------------------------
// Login
// -----------------------------
function login() {
    let email = document.getElementById("loginEmail").value.trim();
    let password = document.getElementById("loginPassword").value;

    if (!email || !password) {
        alert("Please fill all fields");
        return;
    }

    let user = users.find(u => u.email === email && u.password === password);
    if (user) {
        localStorage.setItem("login", "true");
        localStorage.setItem("currentUser", email);
        updateNav();
        show('dashboard');
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
    updateNav();
    show('home');
}

// -----------------------------
// PG Functions
// -----------------------------
function addPG() {
    let name = document.getElementById("pgName").value;
    let city = document.getElementById("pgCity").value;
    let rent = document.getElementById("pgRent").value;
    let type = document.getElementById("pgType").value;
    let file = document.getElementById("pgImage").files[0];

    if (!name || !city || !rent) {
        alert("Please fill all fields");
        return;
    }

    const savePG = (imgData) => {
        let pg = { name, city, rent, type, image: imgData };
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
        let reader = new FileReader();
        reader.onload = () => savePG(reader.result);
        reader.readAsDataURL(file);
    } else if (editIndex !== null) {
        savePG(pgData[editIndex].image);
    }
}

function showPGList() {
    show('pglist');
    displayPGs();
}

function displayPGs() {
    let cityFilter = document.getElementById("filterCity")?.value.toLowerCase() || "";
    let typeFilter = document.getElementById("filterType")?.value || "";
    let container = document.getElementById("pgContainer");
    container.innerHTML = "";

    if (pgData.length === 0) {
        container.innerHTML = "<p>No PGs available</p>";
        return;
    }

    pgData.forEach((pg, i) => {
        if (cityFilter && !pg.city.toLowerCase().includes(cityFilter)) return;
        if (typeFilter && pg.type !== typeFilter) return;

        container.innerHTML += `
        <div class="pg-card">
            <img src="${pg.image}" alt="${pg.name}">
            <h3>${pg.name}</h3>
            <p>City: ${pg.city}</p>
            <p>₹${pg.rent} | ${pg.type}</p>
            <button onclick="editPG(${i})">Edit</button>
            <button onclick="deletePG(${i})">Delete</button>
        </div>
        `;
    });
}

function editPG(index) {
    let pg = pgData[index];
    document.getElementById("pgName").value = pg.name;
    document.getElementById("pgCity").value = pg.city;
    document.getElementById("pgRent").value = pg.rent;
    document.getElementById("pgType").value = pg.type;
    editIndex = index;
    show("addpg");
}

function deletePG(index) {
    if (confirm("Are you sure you want to delete this PG?")) {
        pgData.splice(index, 1);
        localStorage.setItem("pgData", JSON.stringify(pgData));
        displayPGs();
    }
}

function clearPGForm() {
    document.getElementById("pgName").value = "";
    document.getElementById("pgCity").value = "";
    document.getElementById("pgRent").value = "";
    document.getElementById("pgType").value = "Full";
    document.getElementById("pgImage").value = "";
}
