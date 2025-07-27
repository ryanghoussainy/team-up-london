import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import * as Location from 'expo-location';

interface LocationData {
  name: string;
  latitude: number;
  longitude: number;
  address: string;
}

export default function useLocationManagement() {
  const [location, setLocation] = useState('');
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [mapRegion, setMapRegion] = useState({
    latitude: 51.5074, // Default to London
    longitude: -0.1278,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  const getUserLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const userLoc = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      setUserLocation(userLoc);
      setMapRegion({
        ...userLoc,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    } catch (error) {
      Alert.alert('Error getting location:');
    }
  };

  const handleLocationSelect = (data: any, details: any) => {
    if (details && details.geometry && details.geometry.location) {
      const locationInfo: LocationData = {
        name: data.description,
        latitude: details.geometry.location.lat,
        longitude: details.geometry.location.lng,
        address: details.formatted_address || data.description,
      };
      setLocationData(locationInfo);
      setLocation(data.description);

      // Update map region to show the selected location
      setMapRegion({
        latitude: details.geometry.location.lat,
        longitude: details.geometry.location.lng,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  };

  const handleMapPress = (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;

    // Update map region to center on the new coordinates
    setMapRegion({
      latitude,
      longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });

    if (locationData) {
      // Update existing location data with new coordinates
      setLocationData({
        ...locationData,
        latitude,
        longitude,
      });
    } else {
      // Create new location data if none exists
      setLocationData({
        name: 'Custom Location',
        latitude,
        longitude,
        address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
      });
      setLocation('Custom Location');
    }
  };

  const confirmLocationSelection = () => {
    if (locationData) {
      setShowLocationModal(false);
    } else {
      Alert.alert('Error', 'Please select a location first.');
    }
  };

  return {
    location,
    locationData,
    showLocationModal,
    userLocation,
    mapRegion,
    setShowLocationModal,
    getUserLocation,
    handleLocationSelect,
    handleMapPress,
    confirmLocationSelection,
  };
}
