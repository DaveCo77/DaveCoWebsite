// (Assuming you initialize Firebase config at the top of this file, or it carries over if loaded correctly)
const auth = firebase.auth();
const db = firebase.firestore();

// STRIPE PAYMENT LINK - Insert your live/test link here!
const STRIPE_BASE_URL = "https://buy.stripe.com/test_7sY8wJ0up9xB3gff4Nbwk01;

// DOM Elements
const loading = document.getElementById('loading');
const hubContainer = document.getElementById('hub-container');
const liteUI = document.getElementById('lite-ui');
const premiumUI = document.getElementById('premium-ui');
const stripeBtn = document.getElementById('stripe-checkout-btn');
const btnLogout = document.getElementById('btn-logout');

auth.onAuthStateChanged(async (user) => {
    if (user) {
        try {
            const userDoc = await db.collection('users').doc(user.uid).get();
            
            loading.classList.add('hidden');
            hubContainer.classList.remove('hidden');

            if (userDoc.exists && userDoc.data().status === 'premium') {
                // USER IS PRO: Show the tools
                premiumUI.classList.remove('hidden');
            } else {
                // USER IS LITE: Show the upgrade path and INJECT THEIR UID
                stripeBtn.href = `${STRIPE_BASE_URL}?client_reference_id=${user.uid}`;
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
