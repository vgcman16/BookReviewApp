import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const ProfileScreen = ({ navigation }) => {
  const [userReviews, setUserReviews] = useState([]);
  const [following, setFollowing] = useState([]);
  const [followers, setFollowers] = useState([]);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const userId = auth().currentUser?.uid;
      
      // Fetch user's reviews
      const reviewsSnapshot = await firestore()
        .collection('reviews')
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc')
        .get();
      
      const reviews = await Promise.all(
        reviewsSnapshot.docs.map(async (doc) => {
          const review = { id: doc.id, ...doc.data() };
          // Fetch book details for each review
          const bookResponse = await fetch(
            `https://www.googleapis.com/books/v1/volumes/${review.bookId}`
          );
          const bookData = await bookResponse.json();
          return { ...review, book: bookData };
        })
      );
      
      setUserReviews(reviews);

      // Fetch following and followers
      const userDoc = await firestore().collection('users').doc(userId).get();
      const userData = userDoc.data();
      setFollowing(userData?.following || []);
      setFollowers(userData?.followers || []);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await auth().signOut();
      navigation.replace('Auth');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const renderReviewItem = ({ item }) => (
    <View style={styles.reviewItem}>
      <Image
        source={{
          uri: item.book.volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/128x196',
        }}
        style={styles.bookCover}
      />
      <View style={styles.reviewContent}>
        <Text style={styles.bookTitle}>{item.book.volumeInfo.title}</Text>
        <Text style={styles.rating}>{'⭐'.repeat(item.rating)}</Text>
        <Text style={styles.reviewText}>{item.review}</Text>
        <Text style={styles.reviewDate}>
          {new Date(item.createdAt?.toDate()).toLocaleDateString()}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.username}>
          {auth().currentUser?.email?.split('@')[0]}
        </Text>
        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{userReviews.length}</Text>
            <Text style={styles.statLabel}>Reviews</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{following.length}</Text>
            <Text style={styles.statLabel}>Following</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{followers.length}</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>My Reviews</Text>
        <FlatList
          data={userReviews}
          renderItem={renderReviewItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.reviewsList}
        />
      </View>

      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
        <Text style={styles.signOutButtonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#666',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  reviewsList: {
    paddingBottom: 20,
  },
  reviewItem: {
    flexDirection: 'row',
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
  },
  bookCover: {
    width: 60,
    height: 90,
    borderRadius: 5,
  },
  reviewContent: {
    flex: 1,
    marginLeft: 10,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  rating: {
    marginBottom: 5,
  },
  reviewText: {
    color: '#333',
    marginBottom: 5,
  },
  reviewDate: {
    color: '#666',
    fontSize: 12,
  },
  signOutButton: {
    backgroundColor: '#FF3B30',
    padding: 15,
    margin: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  signOutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
