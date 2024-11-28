import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const ReadingListScreen = ({ navigation }) => {
  const [readingList, setReadingList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReadingList();
  }, []);

  const fetchReadingList = async () => {
    try {
      const userId = auth().currentUser?.uid;
      const readingListDoc = await firestore()
        .collection('readingLists')
        .doc(userId)
        .get();

      const bookIds = readingListDoc.data()?.books || [];
      
      // Fetch book details for each book ID
      const books = await Promise.all(
        bookIds.map(async (bookId) => {
          const response = await fetch(
            `https://www.googleapis.com/books/v1/volumes/${bookId}`
          );
          return response.json();
        })
      );

      setReadingList(books);
    } catch (error) {
      console.error('Error fetching reading list:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromReadingList = async (bookId) => {
    try {
      const userId = auth().currentUser?.uid;
      await firestore()
        .collection('readingLists')
        .doc(userId)
        .update({
          books: firestore.FieldValue.arrayRemove(bookId),
        });

      setReadingList((prevList) =>
        prevList.filter((book) => book.id !== bookId)
      );
    } catch (error) {
      console.error('Error removing book from reading list:', error);
      alert('Failed to remove book from reading list');
    }
  };

  const renderBookItem = ({ item }) => (
    <View style={styles.bookItem}>
      <TouchableOpacity
        onPress={() => navigation.navigate('BookDetail', { book: item })}
      >
        <Image
          source={{
            uri: item.volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/128x196',
          }}
          style={styles.bookCover}
        />
      </TouchableOpacity>
      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle}>{item.volumeInfo.title}</Text>
        <Text style={styles.bookAuthor}>
          {item.volumeInfo.authors ? item.volumeInfo.authors.join(', ') : 'Unknown Author'}
        </Text>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => removeFromReadingList(item.id)}
        >
          <Text style={styles.removeButtonText}>Remove</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <Text>Loading reading list...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Reading List</Text>
      {readingList.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            Your reading list is empty. Add books from the search page!
          </Text>
        </View>
      ) : (
        <FlatList
          data={readingList}
          renderItem={renderBookItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  list: {
    padding: 15,
  },
  bookItem: {
    flexDirection: 'row',
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  bookCover: {
    width: 80,
    height: 120,
    borderRadius: 5,
  },
  bookInfo: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'space-between',
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  bookAuthor: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  removeButton: {
    backgroundColor: '#FF3B30',
    padding: 8,
    borderRadius: 5,
    alignSelf: 'flex-start',
  },
  removeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default ReadingListScreen;
