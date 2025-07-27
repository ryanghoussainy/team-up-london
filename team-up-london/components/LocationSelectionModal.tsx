import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Dimensions,
  StyleSheet,
} from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Fonts from '../config/Fonts';
import Colours from '../config/Colours';

const { height } = Dimensions.get('window');

interface LocationData {
  latitude: number;
  longitude: number;
  name: string;
  address: string;
}

interface MapRegion {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

interface LocationSelectionModalProps {
  visible: boolean;
  locationData: LocationData | null;
  mapRegion: MapRegion;
  onClose: () => void;
  onConfirm: () => void;
  onLocationSelect: (data: any, details: any) => void;
  onMapPress: (event: any) => void;
}

export default function LocationSelectionModal({
  visible,
  locationData,
  mapRegion,
  onClose,
  onConfirm,
  onLocationSelect,
  onMapPress,
}: LocationSelectionModalProps) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={onClose} style={styles.modalCloseButton}>
            <Text style={styles.modalCloseText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Select Location</Text>
          <TouchableOpacity
            onPress={onConfirm}
            style={styles.modalConfirmButton}
          >
            <Text style={styles.modalConfirmText}>Done</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <GooglePlacesAutocomplete
            placeholder="Search for places..."
            onPress={onLocationSelect}
            query={{
              key: process.env.GOOGLE_PLACES_API_KEY!,
              language: 'en',
            }}
            styles={{
              container: styles.autocompleteContainer,
              textInputContainer: styles.autocompleteTextInputContainer,
              textInput: styles.autocompleteInput,
              listView: styles.autocompleteList,
              row: styles.autocompleteRow,
              description: styles.autocompleteMainText,
            }}
            textInputProps={{
              placeholderTextColor: '#888',
            }}
            renderDescription={(row) => row.description}
            enablePoweredByContainer={false}
            fetchDetails={true}
            debounce={300}
          />
        </View>

        <View style={styles.mapContainer}>
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            region={mapRegion}
            onPress={onMapPress}
            showsUserLocation={true}
            showsMyLocationButton={true}
          >
            {locationData && (
              <Marker
                coordinate={{
                  latitude: locationData.latitude,
                  longitude: locationData.longitude,
                }}
                title={locationData.name}
                description={locationData.address}
                pinColor={Colours.primary}
              />
            )}
          </MapView>

          <View style={styles.mapInstructions}>
            <Text style={styles.mapInstructionsText}>
              {locationData
                ? 'Tap on the map to adjust the pin location'
                : 'Search for a place above or tap on the map to set location'}
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  modalCloseButton: {
    padding: 8,
  },
  modalCloseText: {
    fontSize: 16,
    fontFamily: Fonts.main,
    color: Colours.primary,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: Fonts.main,
    fontWeight: 'bold',
  },
  modalConfirmButton: {
    padding: 8,
  },
  modalConfirmText: {
    fontSize: 16,
    fontFamily: Fonts.main,
    color: Colours.primary,
  },
  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  autocompleteContainer: {
    flex: 0, // allow map below to size properly
  },
  autocompleteTextInputContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    overflow: 'hidden',
  },
  autocompleteInput: {
    fontFamily: Fonts.main,
    fontSize: 16,
    padding: 10,
  },
  autocompleteList: {
    backgroundColor: '#fff',
  },
  autocompleteRow: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  autocompleteMainText: {
    fontFamily: Fonts.main,
    fontSize: 16,
  },
  mapContainer: {
    flex: 1,
    height: height * 0.4,
    marginHorizontal: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
  mapInstructions: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 8,
  },
  mapInstructionsText: {
    fontSize: 14,
    fontFamily: Fonts.main,
    textAlign: 'center',
  },
});
