
import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously, onAuthStateChanged, User } from "firebase/auth";
import { getFirestore, collection, addDoc, query, onSnapshot, orderBy, deleteDoc, doc, updateDoc, Timestamp } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { MealRecord } from "../types";

const firebaseConfig = {
  apiKey: "AIzaSyCIXqoRO5tdlwBh91NmxubzhQPCG18OPDM",
  authDomain: "app-from-ai.firebaseapp.com",
  projectId: "app-from-ai",
  storageBucket: "app-from-ai.firebasestorage.app",
  messagingSenderId: "895767442095",
  appId: "1:895767442095:web:0e187abfa31b87a9259a5a",
  measurementId: "G-NMM2QS6XP1"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

/**
 * Đăng nhập ẩn danh để thỏa mãn Rule: allow write: if request.auth != null;
 */
export const initAuth = (): Promise<User> => {
  return new Promise((resolve, reject) => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        resolve(user);
      } else {
        try {
          const cred = await signInAnonymously(auth);
          resolve(cred.user);
        } catch (error) {
          reject(error);
        }
      }
    });
  });
};

/**
 * Tải ảnh lên Firebase Storage theo cấu trúc rules: slips/{userId}/{allPaths=**}
 */
export const uploadMealImage = async (userId: string, file: File): Promise<{url: string, path: string}> => {
  const fileExtension = file.name.split('.').pop();
  const fileName = `meals/${Date.now()}.${fileExtension}`;
  const storageRef = ref(storage, `slips/${userId}/${fileName}`);
  
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  return { url, path: storageRef.fullPath };
};

/**
 * Lưu món ăn vào Firestore collection: weighing_slips
 */
export const saveMealToFirestore = async (userId: string, meal: Omit<MealRecord, 'id'>, imagePath: string) => {
  const mealData = {
    ...meal,
    userId,
    imagePath,
    createdAt: Timestamp.now(),
    // Đồng bộ định dạng với rule của bạn
    type: 'meal_log' 
  };
  return await addDoc(collection(db, "weighing_slips"), mealData);
};

/**
 * Cập nhật thông tin món ăn (ví dụ: ngày tháng)
 */
export const updateMealInFirestore = async (mealId: string, updates: Partial<MealRecord>) => {
  const mealRef = doc(db, "weighing_slips", mealId);
  return await updateDoc(mealRef, updates);
};

/**
 * Lấy danh sách món ăn thời gian thực
 */
export const subscribeToMeals = (userId: string, callback: (meals: MealRecord[]) => void) => {
  const q = query(
    collection(db, "weighing_slips"), 
    orderBy("date", "desc")
  );

  return onSnapshot(q, (snapshot) => {
    const meals: MealRecord[] = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as MealRecord));
    callback(meals);
  });
};

/**
 * Xóa món ăn khỏi Firestore và Storage
 */
export const deleteMealFromCloud = async (meal: MealRecord) => {
  // 1. Xóa trong Firestore
  await deleteDoc(doc(db, "weighing_slips", meal.id));
  
  // 2. Xóa ảnh trong Storage (nếu có metadata imagePath)
  if ((meal as any).imagePath) {
    const storageRef = ref(storage, (meal as any).imagePath);
    try {
      await deleteObject(storageRef);
    } catch (e) {
      console.warn("Lỗi xóa ảnh Storage:", e);
    }
  }
};
