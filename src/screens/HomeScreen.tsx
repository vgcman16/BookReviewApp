import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';

const HomeScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchBooks = async () => {
    setLoading(true);
    try {
      // In a real app, you would integrate with a books API like Google Books
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${searchQuery}`
      );
      const data = await response.json();
      setBooks(data.items || []);
    } catch (error) {
      console.error(error);
      alert('Error searching books');
    }
    setLoading(false);
  };

  const renderBookItem = ({ item }) => {
    const book = item.volumeInfo;
    return (
      <TouchableOpacity
        style={styles.bookItem}
        onPress={() => navigation.navigate('BookDetail', { book: item })}
      >
        <Image
          source={{
            uri: book.imageLinks?.thumbnail || 'https://via.placeholder.com/128x196',
          }}
          style={styles.bookCover}
        />
        <View style={styles.bookInfo}>
          <Text style={styles.bookTitle}>{book.title}</Text>
          <Text style={styles.bookAuthor}>
            {book.authors ? book.authors.join(', ') : 'Unknown Author'}
          </Text>
          <Text style={styles.bookRating}>
            Rating: {book.averageRating || 'No ratings'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search books..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={searchBooks}
          />
          <TouchableOpacity onPress={searchBooks}>
            <Icon name="search" size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        data={books}
        renderItem={renderBookItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.bookList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 10,
  },
  searchInput: {
    flex: 1,
    marginRight: 10,
  },
  bookList: {
    padding: 15,
  },
  bookItem: {
    flexDirection: 'row',
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
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
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  bookAuthor: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  bookRating: {
    fontSize: 14,
    color: '#888',
  },
});

export default HomeScreen;
