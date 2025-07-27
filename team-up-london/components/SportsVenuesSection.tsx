import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  Linking,
} from 'react-native';
import Fonts from '../config/Fonts';
import Colours from '../config/Colours';

interface SportsVenue {
  id: string;
  name: string;
  image: string;
  website: string;
}

const SPORTS_VENUES: SportsVenue[] = [
  {
    id: '1',
    name: 'Local Tennis Courts',
    image:
      'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=300&h=200&fit=crop',
    website: 'https://www.lta.org.uk/venue-finder',
  },
  {
    id: '2',
    name: 'Beach Volleyball Courts',
    image:
      'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=300&h=200&fit=crop',
    website: 'https://www.volleyballengland.org/play/find-a-club',
  },
  {
    id: '3',
    name: 'Badminton Courts',
    image:
      'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=300&h=200&fit=crop',
    website: 'https://www.badmintonengland.co.uk/play/find-a-club',
  },
  {
    id: '4',
    name: 'Basketball Courts',
    image:
      'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=300&h=200&fit=crop',
    website: 'https://www.basketballengland.co.uk/find-basketball',
  },
  {
    id: '5',
    name: 'Five-a-Side Football',
    image:
      'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=300&h=200&fit=crop',
    website: 'https://www.powerleague.co.uk',
  },
];

export default function SportsVenuesSection() {
  const handleVenuePress = async (venue: SportsVenue) => {
    try {
      const supported = await Linking.canOpenURL(venue.website);
      if (supported) {
        await Linking.openURL(venue.website);
      } else {
        Alert.alert('Error', 'Cannot open this website');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to open website');
    }
  };

  const renderVenueItem = (venue: SportsVenue) => (
    <TouchableOpacity
      key={venue.id}
      style={styles.venueItem}
      onPress={() => handleVenuePress(venue)}
    >
      <Image
        source={{ uri: venue.image }}
        style={styles.venueImage}
        resizeMode="cover"
      />
      <Text style={styles.venueName} numberOfLines={2}>
        {venue.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.venuesContainer}>
      <Text style={styles.venuesTitle}>Sponsored Sports Venues</Text>
      <Text style={[styles.venuesSubtitle, { marginBottom: 15 }]}>
        Get{' '}
        <Text
          style={{
            fontSize: 24,
            fontWeight: 'bold',
            color: Colours.primary,
          }}
        >
          10%
        </Text>{' '}
        Off Booking
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.venuesScrollContent}
      >
        {SPORTS_VENUES.map(renderVenueItem)}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  venuesContainer: {
    marginTop: 16,
    marginBottom: 24,
  },
  venuesTitle: {
    fontSize: 18,
    fontFamily: Fonts.main,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  venuesSubtitle: {
    fontSize: 14,
    fontFamily: Fonts.main,
    color: '#555',
  },
  venuesScrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  venueItem: {
    width: 150,
    marginRight: 12,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f8f9fa',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  venueImage: {
    width: '100%',
    height: 80,
  },
  venueName: {
    padding: 8,
    fontSize: 14,
    fontFamily: Fonts.main,
    fontWeight: 'bold',
    color: '#333',
  },
});
