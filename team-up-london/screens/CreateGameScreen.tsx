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
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/StackNavigator';
import useSports from '../hooks/useSports';
import Fonts from '../config/Fonts';
import { createGame, joinGame } from '../operations/Games';
import Colours from '../config/Colours';
import BackArrow from '../components/BackArrow';
import Player from '../interfaces/Player';
import useDateTimePickers from '../hooks/useDateTimePickers';
import usePlayerCountAndCost from '../hooks/usePlayerCountAndCost';
import useLocationManagement from '../hooks/useLocationManagement';
import SportsVenuesSection from '../components/SportsVenuesSection';
import LocationSelectionModal from '../components/LocationSelectionModal';
import SportSelectionSection from '../components/SportSelectionSection';
import PlayerCountSection from '../components/PlayerCountSection';
import DateTimeSection from '../components/DateTimeSection';
import GameNameSection from '../components/GameNameSection';
import CostSection from '../components/CostSection';

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
        <GameNameSection value={name} onChangeText={setName} />

        {/* Date and Time Section */}
        <DateTimeSection
          startTime={startTime}
          endTime={endTime}
          showStartDatePicker={showStartDatePicker}
          showStartTimePicker={showStartTimePicker}
          showEndDatePicker={showEndDatePicker}
          showEndTimePicker={showEndTimePicker}
          onShowStartDatePicker={setShowStartDatePicker}
          onShowStartTimePicker={setShowStartTimePicker}
          onShowEndDatePicker={setShowEndDatePicker}
          onShowEndTimePicker={setShowEndTimePicker}
          onStartDateChange={handleStartDateChange}
          onStartTimeChange={handleStartTimeChange}
          onEndDateChange={handleEndDateChange}
          onEndTimeChange={handleEndTimeChange}
          formatDate={formatDate}
          formatTime={formatTime}
        />

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
        <SportSelectionSection
          sports={sports}
          selectedSportId={sportId}
          onSportSelect={setSportId}
        />

        {/* Player Count Fields */}
        <PlayerCountSection
          minPlayers={minPlayers}
          maxPlayers={maxPlayers}
          onMinPlayersChange={handleMinPlayersChange}
          onMaxPlayersChange={handleMaxPlayersChange}
          onAdjustMinPlayers={adjustMinPlayers}
          onAdjustMaxPlayers={adjustMaxPlayers}
        />

        {/* Cost Field */}
        <CostSection cost={cost} onCostChange={handleCostChange} />

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
      </ScrollView>

      {/* Location Selection Modal */}
      <LocationSelectionModal
        visible={showLocationModal}
        locationData={locationData}
        mapRegion={mapRegion}
        onClose={() => setShowLocationModal(false)}
        onConfirm={confirmLocationSelection}
        onLocationSelect={handleLocationSelect}
        onMapPress={handleMapPress}
      />
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
});
