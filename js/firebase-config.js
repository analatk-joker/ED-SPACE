// ไฟล์ตั้งค่า Firebase
  const firebaseConfig = {
    apiKey: "AIzaSyCEQzJv2zWFVuGhmSLKYpg3APzEsS7dls0",
    authDomain: "ed-space-ec8c0.firebaseapp.com",
    projectId: "ed-space-ec8c0",
    storageBucket: "ed-space-ec8c0.firebasestorage.app",
    messagingSenderId: "422193800705",
    appId: "1:422193800705:web:67a4bf09b7c0db9c800200",
    measurementId: "G-992E89FFZV"
  };

// เริ่มต้น Firebase
firebase.initializeApp(firebaseConfig);

// สร้างตัวแปรสำหรับเข้าถึงบริการต่างๆ ของ Firebase
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// ฟังก์ชันสำหรับการเข้าสู่ระบบ
function loginWithEmail(email, password) {
  return auth.signInWithEmailAndPassword(email, password);
}

// ฟังก์ชันสำหรับการลงทะเบียน
function registerWithEmail(email, password, displayName) {
  return auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // อัปเดตข้อมูลผู้ใช้
      return userCredential.user.updateProfile({
        displayName: displayName
      }).then(() => {
        // สร้างเอกสารผู้ใช้ใน Firestore
        return db.collection('users').doc(userCredential.user.uid).set({
          email: email,
          displayName: displayName,
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
      }).then(() => {
        return userCredential;
      });
    });
}

// ฟังก์ชันสำหรับการออกจากระบบ
function logout() {
  return auth.signOut();
}

// ฟังก์ชันสำหรับการอัปโหลดไฟล์ไปยัง Firebase Storage
function uploadFile(file, path) {
  const storageRef = storage.ref();
  const fileRef = storageRef.child(path);
  
  return fileRef.put(file).then(snapshot => {
    return snapshot.ref.getDownloadURL();
  });
}

// ฟังก์ชันสำหรับการบันทึกข้อมูลลงใน Firestore
function saveToFirestore(collection, document, data) {
  if (document) {
    return db.collection(collection).doc(document).set(data, { merge: true });
  } else {
    return db.collection(collection).add(data);
  }
}

// ฟังก์ชันสำหรับการดึงข้อมูลจาก Firestore
function getFromFirestore(collection, document) {
  if (document) {
    return db.collection(collection).doc(document).get();
  } else {
    return db.collection(collection).get();
  }
}