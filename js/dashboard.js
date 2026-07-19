// 1. INJECT FIREBASE CONFIGURATION FIRST
const firebaseConfig = {
    apiKey: "AIzaSyDKaT-5zrry7pNHkqSFdx-OhhtuAPe97y8",
    authDomain: "pixel-array-net.firebaseapp.com",
    projectId: "pixel-array-net",
    storageBucket: "pixel-array-net.firebasestorage.app",
    messagingSenderId: "63643759347",
    appId: "1:63643759347:web:79078b6c106b29c238bd86",
    measurementId: "G-KTNZJQ2CBG"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// 2. NOW INITIALIZE REFERENCES
const auth = firebase.auth();
const db = firebase.firestore();

// STRIPE PAYMENT LINK
const STRIPE_BASE_URL = "https://buy.stripe.com/test_7sY8wJ0up9xB3gff4Nbwk01";

// DOM Elements
const loading = document.getElementById('loading');
const hubContainer = document.getElementById('hub-container');
const liteUI = document.getElementById('lite-ui');
const premiumUI = document.getElementById('premium-ui');
const stripeBtn = document.getElementById('stripe-checkout-btn');
const btnLogout = document.getElementById('btn-logout');

// 3. CORE AUTHENTICATION LOOP
auth.onAuthStateChanged(async (user) => {
    if (user) {
        try {
            const userDoc = await db.collection('users').doc(user.uid).get();
            
            // Hide the "Authenticating..." screen
            loading.classList.add('hidden');
            hubContainer.classList.remove('hidden');

            if (userDoc.exists && userDoc.data().status === 'premium') {
                // USER IS PRO: Show the unlocked tools
                liteUI.classList.add('hidden');
                premiumUI.classList.remove('hidden');
            } else {
                // USER IS LITE: Show the upgrade path and INJECT THEIR UID
                stripeBtn.href = `${STRIPE_BASE_URL}?client_reference_id=${user.uid}`;
                premiumUI.classList.add('hidden');
                liteUI.classList.remove('hidden');
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
        }
    } else {
        // Not logged in at all, boot them to the login screen
        window.location.replace("login-test.html");
    }
});

btnLogout.addEventListener('click', () => {
    auth.signOut().then(() => {
        window.location.replace("login-test.html");
    });
});
