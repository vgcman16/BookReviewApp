import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const BookDetailScreen = ({ route, navigation }) => {
  const { book } = route.params;
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [isInReadingList, setIsInReadingList] = useState(false);

  useEffect(() => {
    fetchReviews();
    checkReadingList();
  }, []);

  const fetchReviews = async () => {
    try {
      const reviewsSnapshot = await firestore()
        .collection('reviews')
        .where('bookId', '==', book.id)
        .get();
      
      setReviews(reviewsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const checkReadingList = async () => {
    try {
      const userId = auth().currentUser?.uid;
      const readingListDoc = await firestore()
        .collection('readingLists')
        .doc(userId)
        .get();
      
      const readingList = readingListDoc.data()?.books || [];
      setIsInReadingList(readingList.includes(book.id));
    } catch (error) {
      console.error('Error checking reading list:', error);
    }
  };

  const submitReview = async () => {
    try {
      const userId = auth().currentUser?.uid;
      await firestore().collection('reviews').add({
        bookId: book.id,
        userId,
        rating,
        review,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });
      
      setReview('');
      setRating(0);
      fetchReviews();
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review');
    }
  };

  const toggleReadingList = async () => {
    try {
      const userId = auth().currentUser?.uid;
      const readingListRef = firestore().collection('readingLists').doc(userId);
      
      if (isInReadingList) {
        await readingListRef.update({
          books: firestore.FieldValue.arrayRemove(book.id),
        });
      } else {
        await readingListRef.set({
          books: firestore.FieldValue.arrayUnion(book.id),
        }, { merge: true });
      }
      
      setIsInReadingList(!isInReadingList);
    } catch (error) {
      console.error('Error updating reading list:', error);
      alert('Failed to update reading list');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{
            uri: book.volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/128x196',
          }}
          style={styles.bookCover}
        />
        <View style={styles.bookInfo}>
          <Text style={styles.title}>{book.volumeInfo.title}</Text>
          <Text style={styles.author}>
            {book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : 'Unknown Author'}
          </Text>
          <TouchableOpacity
            style={[styles.readingListButton, isInReadingList && styles.inReadingList]}
            onPress={toggleReadingList}
          >
            <Text style={styles.readingListButtonText}>
              {isInReadingList ? 'Remove from Reading List' : 'Add to Reading List'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.description}>
        <Text style={styles.sectionTitle}>Description</Text>
        <Text>{book.volumeInfo.description || 'No description available.'}</Text>
      </View>

      <View style={styles.reviewSection}>
        <Text style={styles.sectionTitle}>Write a Review</Text>
        <View style={styles.ratingContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity key={star} onPress={() => setRating(star)}>
              <Icon
                name={star <= rating ? 'star' : 'star-outline'}
                size={30}
                color="#FFD700"
              />
            </TouchableOpacity>
          ))
        }
        </View>
        <TextInput
          style={styles.reviewInput}
          placeholder="Write your review..."
          value={review}
          onChangeText={setReview}
          multiline
        />
        <TouchableOpacity style={styles.submitButton} onPress={submitReview}>
          <Text style={styles.submitButtonText}>Submit Review</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.reviews}>
        <Text style={styles.sectionTitle}>Reviews</Text>
        {reviews.map((review) => (
          <View key={review.id} style={styles.reviewItem}>
            <View style={styles.reviewHeader}>
              <Text style={styles.reviewRating}>
                {'⭐'.repeat(review.rating)}
              </Text>
              <Text style={styles.reviewDate}>
                {new Date(review.createdAt?.toDate()).toLocaleDateString()}
              </Text>
            </View>
            <Text style={styles.reviewText}>{review.review}</Text>
          </View>
        ))
      }
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  bookCover: {
    width: 100,
    height: 150,
    borderRadius: 5,
  },
  bookInfo: {
    flex: 1,
    marginLeft: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  author: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  readingListButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  inReadingList: {
    backgroundColor: '#FF3B30',
  },
  readingListButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  description: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  reviewSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  reviewInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  reviews: {
    padding: 20,
  },
  reviewItem: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 5,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  reviewRating: {
    fontSize: 16,
  },
  reviewDate: {
    color: '#666',
  },
  reviewText: {
    fontSize: 14,
  },
});

export default BookDetailScreen;
