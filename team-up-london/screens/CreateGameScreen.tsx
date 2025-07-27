import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
  KeyboardAvoidingView,
  Modal,
  Dimensions,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/StackNavigator';
import useSports from '../hooks/useSports';
import Fonts from '../config/Fonts';
import SportIcon from '../components/SportIcon';
import { ICON_FAMILIES } from '../constants/iconFamilies';
import { createGame, joinGame } from '../operations/Games';
import Colours from '../config/Colours';
import BackArrow from '../components/BackArrow';
import Player from '../interfaces/Player';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import useDateTimePickers from '../hooks/useDateTimePickers';
import usePlayerCountAndCost from '../hooks/usePlayerCountAndCost';
import useLocationManagement from '../hooks/useLocationManagement';
import SportsVenuesSection from '../components/SportsVenuesSection';

const { width, height } = Dimensions.get('window');

type Props = NativeStackScreenProps<RootStackParamList, 'CreateGame'>;

export default function CreateGameScreen({
  player,
  navigation,
  route,
}: { player: Player } & Props) {
  const { sports } = useSports();

  // Date and time management
  const {
    startTime,
    endTime,
    showStartDatePicker,
    showStartTimePicker,
    showEndDatePicker,
    showEndTimePicker,
    setShowStartDatePicker,
    setShowStartTimePicker,
    setShowEndDatePicker,
    setShowEndTimePicker,
    handleStartDateChange,
    handleStartTimeChange,
    handleEndDateChange,
    handleEndTimeChange,
    formatDate,
    formatTime,
  } = useDateTimePickers();

  // Player count and cost management
  const {
    maxPlayers,
    minPlayers,
    cost,
    handleMinPlayersChange,
    handleMaxPlayersChange,
    adjustMinPlayers,
    adjustMaxPlayers,
    handleCostChange,
  } = usePlayerCountAndCost();

  // Location management
  const {
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
  } = useLocationManagement();

  const [name, setName] = useState('');
  const [locationType, setLocationType] = useState<
    'Sports Venue' | 'Park' | null
  >(null);
  const [notesFromHost, setNotesFromHost] = useState('');
  const [sportId, setSportId] = useState<string | null>(null);

  const { communityId } = route.params || null;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getUserLocation();
  }, []);

  const handleCreateGamePress = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a game name.');
      return;
    }
    if (!startTime) {
      Alert.alert('Error', 'Please select a start time.');
      return;
    }
    if (!endTime) {
      Alert.alert('Error', 'Please select an end time.');
      return;
    }
    if (endTime <= startTime) {
      Alert.alert('Error', 'End time must be after start time.');
      return;
    }
    if (!location.trim()) {
      Alert.alert('Error', 'Please enter a location.');
      return;
    }
    if (!locationType) {
      Alert.alert('Error', 'Please select a location type.');
      return;
    }
    if (maxPlayers === null || maxPlayers <= 0) {
      Alert.alert('Error', 'Please enter a valid maximum number of players.');
      return;
    }
    if (minPlayers === null || minPlayers <= 0) {
      Alert.alert('Error', 'Please enter a valid minimum number of players.');
      return;
    }
    if (minPlayers > maxPlayers) {
      Alert.alert(
        'Error',
        'Minimum players cannot be greater than maximum players.'
      );
      return;
    }
    if (!sportId) {
      Alert.alert('Error', 'Please select a sport.');
      return;
    }
    if (!locationData) {
      Alert.alert('Error', 'Please select a location on the map.');
      return;
    }

    setLoading(true);
    const game = await createGame(
      name,
      startTime,
      endTime,
      location,
      locationType,
      notesFromHost,
      maxPlayers,
      minPlayers,
      sportId,
      cost,
      player.id,
      locationData.latitude,
      locationData.longitude,
      communityId
    );

    if (!game) {
      setLoading(false);
      Alert.alert('Error', 'Unable to create game. Please try again.');
      return;
    }

    // Add the creator as a member
    await joinGame(player.id, game.id);

    setLoading(false);
    navigation.replace('Game', { game, mapRegion: null, distance: null });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 20}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.sideBySide}>
          <BackArrow style={{ top: 15 }} />
          <Text style={styles.title}>New Game</Text>
        </View>

        <View style={styles.field}>
          <Text style={[styles.label, { paddingTop: 10 }]}>
            Fields marked with <Text style={{ color: 'red' }}>*</Text> are
            required.
          </Text>
        </View>

        {/* Game Name */}
        <View style={styles.field}>
          <Text style={styles.label}>
            Game Name <Text style={{ color: 'red' }}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Game Name"
            placeholderTextColor="#888"
          />
        </View>

        {/* Start Date and Time */}
        <View style={styles.field}>
          <Text style={styles.label}>
            Start Date & Time <Text style={{ color: 'red' }}>*</Text>
          </Text>
          <View style={styles.dateTimeContainer}>
            <TouchableOpacity
              style={[styles.input, styles.dateTimeInput]}
              onPress={() => setShowStartDatePicker(true)}
            >
              <Text style={styles.dateTimeText}>{formatDate(startTime)}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.input, styles.dateTimeInput]}
              onPress={() => setShowStartTimePicker(true)}
            >
              <Text style={styles.dateTimeText}>{formatTime(startTime)}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* End Date and Time */}
        <View style={styles.field}>
          <Text style={styles.label}>
            End Date & Time <Text style={{ color: 'red' }}>*</Text>
          </Text>
          <View style={styles.dateTimeContainer}>
            <TouchableOpacity
              style={[styles.input, styles.dateTimeInput]}
              onPress={() => setShowEndDatePicker(true)}
            >
              <Text style={styles.dateTimeText}>{formatDate(endTime)}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.input, styles.dateTimeInput]}
              onPress={() => setShowEndTimePicker(true)}
            >
              <Text style={styles.dateTimeText}>{formatTime(endTime)}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Location */}
        <View style={styles.field}>
          <Text style={styles.label}>
            Location <Text style={{ color: 'red' }}>*</Text>
          </Text>
          <TouchableOpacity
            style={[styles.input, styles.locationButton]}
            onPress={() => setShowLocationModal(true)}
          >
            <View style={styles.locationButtonContent}>
              <Text
                style={[
                  styles.locationButtonText,
                  { color: location ? '#000' : '#888' },
                ]}
              >
                {location || 'Select location from map...'}
              </Text>
              <Text style={styles.locationButtonIcon}>📍</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Location Type */}
        <View style={styles.field}>
          <Text style={styles.label}>
            Location Type <Text style={{ color: 'red' }}>*</Text>
          </Text>
          <View style={styles.optionContainer}>
            {['Sports Venue', 'Park'].map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.optionBox,
                  locationType === type && styles.optionSelected,
                ]}
                onPress={() => setLocationType(type as 'Sports Venue' | 'Park')}
              >
                <Text
                  style={[
                    styles.optionLabel,
                    locationType === type && { color: 'white' },
                  ]}
                >
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Sports Venues */}
        {locationType === 'Sports Venue' && <SportsVenuesSection />}

        {/* Sport Selection */}
        <Text style={[styles.label]}>
          Select Sport <Text style={{ color: 'red' }}>*</Text>
        </Text>
        <View style={styles.sportsContainer}>
          {sports &&
            sports.length > 0 &&
            sports.map((s) => (
              <TouchableOpacity
                key={s.id}
                style={[
                  styles.sportItem,
                  sportId === s.id && styles.sportSelected,
                ]}
                onPress={() => setSportId(s.id)}
              >
                <SportIcon
                  name={s.icon || 'default-icon'}
                  family={s.icon_family as ICON_FAMILIES}
                  size={24}
                  color={sportId === s.id ? 'white' : Colours.primary}
                />
                <Text
                  style={[
                    styles.sportLabel,
                    sportId === s.id && { color: 'white' },
                  ]}
                >
                  {s.name}
                </Text>
              </TouchableOpacity>
            ))}
        </View>

        {/* Player Count Fields */}
        <View style={styles.fieldRow}>
          <View style={[styles.halfField, { paddingTop: 10 }]}>
            <Text style={styles.label}>
              Min Players <Text style={{ color: 'red' }}>*</Text>
            </Text>
            <View style={styles.numberInputContainer}>
              <TouchableOpacity
                style={styles.stepperButton}
                onPress={() => adjustMinPlayers(false)}
              >
                <Text style={styles.stepperText}>-</Text>
              </TouchableOpacity>
              <TextInput
                style={styles.numberInput}
                value={minPlayers?.toString() || ''}
                onChangeText={handleMinPlayersChange}
                placeholder="0"
                placeholderTextColor="#888"
                keyboardType="numeric"
              />
              <TouchableOpacity
                style={styles.stepperButton}
                onPress={() => adjustMinPlayers(true)}
              >
                <Text style={styles.stepperText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={[styles.halfField, { paddingTop: 10 }]}>
            <Text style={styles.label}>
              Max Players <Text style={{ color: 'red' }}>*</Text>
            </Text>
            <View style={styles.numberInputContainer}>
              <TouchableOpacity
                style={styles.stepperButton}
                onPress={() => adjustMaxPlayers(false)}
              >
                <Text style={styles.stepperText}>-</Text>
              </TouchableOpacity>
              <TextInput
                style={styles.numberInput}
                value={maxPlayers?.toString() || ''}
                onChangeText={handleMaxPlayersChange}
                placeholder="0"
                placeholderTextColor="#888"
                keyboardType="numeric"
              />
              <TouchableOpacity
                style={styles.stepperButton}
                onPress={() => adjustMaxPlayers(true)}
              >
                <Text style={styles.stepperText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Cost Field */}
        <View style={styles.field}>
          <Text style={styles.label}>Cost per Player</Text>
          <View style={styles.costInputContainer}>
            <Text style={styles.currencySymbol}>£</Text>
            <TextInput
              style={styles.costInput}
              value={cost === 0 ? '' : cost.toString()}
              onChangeText={handleCostChange}
              placeholder="0.00"
              placeholderTextColor="#888"
              keyboardType="decimal-pad"
            />
          </View>
        </View>

        {/* Notes from Host */}
        <View style={styles.field}>
          <Text style={styles.label}>Notes from Host</Text>
          <TextInput
            style={[styles.input, { height: 100 }]}
            value={notesFromHost}
            onChangeText={setNotesFromHost}
            placeholder="Any additional information for players..."
            placeholderTextColor="#888"
            multiline
          />
        </View>

        {/* Create Game Button */}
        <TouchableOpacity
          style={[styles.button, loading && { backgroundColor: '#ccc' }]}
          disabled={loading}
          onPress={handleCreateGamePress}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Creating...' : 'Create Game'}
          </Text>
        </TouchableOpacity>

        {/* Date Time Pickers */}
        {showStartDatePicker && (
          <DateTimePicker
            value={startTime}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleStartDateChange}
            minimumDate={new Date()}
          />
        )}

        {showStartTimePicker && (
          <DateTimePicker
            value={startTime}
            mode="time"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleStartTimeChange}
          />
        )}

        {showEndDatePicker && (
          <DateTimePicker
            value={endTime}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleEndDateChange}
            minimumDate={new Date()}
          />
        )}

        {showEndTimePicker && (
          <DateTimePicker
            value={endTime}
            mode="time"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleEndTimeChange}
          />
        )}

        {/* Location Selection Modal */}
        <Modal
          visible={showLocationModal}
          animationType="slide"
          presentationStyle="pageSheet"
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity
                onPress={() => setShowLocationModal(false)}
                style={styles.modalCloseButton}
              >
                <Text style={styles.modalCloseText}>Cancel</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Select Location</Text>
              <TouchableOpacity
                onPress={confirmLocationSelection}
                style={styles.modalConfirmButton}
              >
                <Text style={styles.modalConfirmText}>Done</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
              <GooglePlacesAutocomplete
                placeholder="Search for places..."
                onPress={handleLocationSelect}
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
                onPress={handleMapPress}
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
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    fontFamily: Fonts.main,
    marginTop: 35,
  },
  field: {
    marginBottom: 16,
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  halfField: {
    flex: 0.48,
  },
  label: {
    fontSize: 16,
    fontFamily: Fonts.main,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontFamily: Fonts.main,
  },
  locationButton: {
    justifyContent: 'center',
    minHeight: 50,
  },
  locationButtonContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationButtonText: {
    fontFamily: Fonts.main,
    fontSize: 16,
    flex: 1,
  },
  locationButtonIcon: {
    fontSize: 18,
    marginLeft: 10,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateTimeInput: {
    flex: 0.48,
    justifyContent: 'center',
  },
  dateTimeText: {
    fontFamily: Fonts.main,
    fontSize: 16,
  },
  numberInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  numberInput: {
    flex: 1,
    padding: 10,
    fontFamily: Fonts.main,
    textAlign: 'center',
  },
  stepperButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  stepperText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colours.primary,
  },
  costInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  currencySymbol: {
    fontSize: 16,
    fontFamily: Fonts.main,
    paddingLeft: 10,
    color: '#333',
  },
  costInput: {
    flex: 1,
    padding: 10,
    fontFamily: Fonts.main,
  },
  sportsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  sportItem: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    margin: 4,
    borderWidth: 1,
    borderColor: Colours.primary,
    borderRadius: 8,
  },
  sportSelected: {
    backgroundColor: Colours.primary,
  },
  sportLabel: {
    marginTop: 4,
    fontSize: 12,
    fontFamily: Fonts.main,
    color: Colours.primary,
  },
  optionContainer: {
    flexDirection: 'row',
  },
  optionBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    marginRight: 8,
    borderWidth: 1,
    borderColor: Colours.primary,
    borderRadius: 8,
  },
  optionSelected: {
    backgroundColor: Colours.primary,
  },
  optionLabel: {
    fontSize: 14,
    fontFamily: Fonts.main,
    color: Colours.primary,
  },
  button: {
    marginTop: 24,
    backgroundColor: Colours.primary,
    borderRadius: 12,
    paddingVertical: 14,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    fontFamily: Fonts.main,
  },
  sideBySide: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  locationDetails: {
    marginTop: 8,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: Colours.primary,
  },
  locationDetailText: {
    fontSize: 14,
    fontFamily: Fonts.main,
    color: '#333',
    marginBottom: 4,
  },
  locationCoords: {
    fontSize: 12,
    fontFamily: Fonts.main,
    color: '#555',
  },
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
  selectedLocationInfo: {
    padding: 16,
    borderTopWidth: 1,
    borderColor: '#eee',
  },
  selectedLocationName: {
    fontSize: 16,
    fontFamily: Fonts.main,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  selectedLocationAddress: {
    fontSize: 14,
    fontFamily: Fonts.main,
    color: '#555',
    marginBottom: 4,
  },
  selectedLocationCoords: {
    fontSize: 12,
    fontFamily: Fonts.main,
    color: '#555',
  },
});
