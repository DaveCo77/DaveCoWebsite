import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
// (Insert your Firebase config here)

const auth = getAuth(app);
const db = getFirestore(app);

// DOM Elements
const authGuard = document.getElementById('auth-guard');
const uiSidebar = document.getElementById('ui-sidebar');
const uiMain = document.getElementById('ui-main');
const emailDisplay = document.getElementById('user-email-display');
const btnLogout = document.getElementById('btn-logout');

// Core Authentication Loop
onAuthStateChanged(auth, async (user) => {
    if (user) {
        try {
            // Update UI with user info
            emailDisplay.textContent = user.email;

            // Fetch the user's license tier
            const userDocRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(userDocRef);

            if (docSnap.exists() && docSnap.data().status === 'premium') {
                unlockDashboard();
            } else {
                handleUnauthorized();
            }
        } catch (error) {
            console.error("Database validation failed:", error);
            handleUnauthorized();
        }
    } else {
        handleUnauthorized();
    }
});

// State Managers
function unlockDashboard() {
    // Fade out the guard, reveal the dashboard
    authGuard.classList.add('opacity-0', 'pointer-events-none');
    setTimeout(() => {
        authGuard.classList.add('hidden');
        uiSidebar.classList.remove('hidden');
        uiMain.classList.remove('hidden');
    }, 300); // Matches the Tailwind transition duration
}

function handleUnauthorized() {
    // Kick them to a unified login/upgrade portal
    window.location.replace("login-test.html?alert=requires_premium");
}

// Logout Handler
btnLogout.addEventListener('click', async () => {
    try {
        await signOut(auth);
        window.location.replace("login-test.html");
    } catch (error) {
        console.error("Error signing out:", error);
    }
});
