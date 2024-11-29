import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

// Firebase Collections
export const COLLECTIONS = {
  USERS: 'users',
  BOOKS: 'books',
  REVIEWS: 'reviews',
  READING_LISTS: 'readingLists'
};

// Auth Functions
export const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await auth().signInWithEmailAndPassword(email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

export const signUp = async (email: string, password: string, displayName: string) => {
  try {
    const userCredential = await auth().createUserWithEmailAndPassword(email, password);
    await userCredential.user.updateProfile({ displayName });
    
    // Create user document in Firestore
    await firestore().collection(COLLECTIONS.USERS).doc(userCredential.user.uid).set({
      email,
      displayName,
      createdAt: firestore.FieldValue.serverTimestamp(),
    });
    
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

export const signOut = () => auth().signOut();

// Firestore Functions
export const addBookToReadingList = async (userId: string, bookId: string) => {
  try {
    await firestore()
      .collection(COLLECTIONS.READING_LISTS)
      .doc(userId)
      .set({
        books: firestore.FieldValue.arrayUnion(bookId)
      }, { merge: true });
  } catch (error) {
    throw error;
  }
};

export const addBookReview = async (bookId: string, userId: string, review: any) => {
  try {
    await firestore()
      .collection(COLLECTIONS.REVIEWS)
      .add({
        bookId,
        userId,
        ...review,
        createdAt: firestore.FieldValue.serverTimestamp()
      });
  } catch (error) {
    throw error;
  }
};

export const getBookReviews = async (bookId: string) => {
  try {
    const snapshot = await firestore()
      .collection(COLLECTIONS.REVIEWS)
      .where('bookId', '==', bookId)
      .orderBy('createdAt', 'desc')
      .get();
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    throw error;
  }
};

export const getUserReadingList = async (userId: string) => {
  try {
    const doc = await firestore()
      .collection(COLLECTIONS.READING_LISTS)
      .doc(userId)
      .get();
    
    return doc.exists ? doc.data().books : [];
  } catch (error) {
    throw error;
  }
};
