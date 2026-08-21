const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyBofs5UZ1oWHp4Gk-n6hiXz00IC2FXBAdw",
  authDomain: "elaxora-466c4.firebaseapp.com",
  projectId: "elaxora-466c4",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function test() {
  try {
    const snap = await getDocs(collection(db, "enquiries"));
    console.log("Enquiries (unauthenticated):", snap.size);
  } catch (e) {
    console.error("Unauthenticated enquiries fetch failed:", e.message);
  }
}
test();
