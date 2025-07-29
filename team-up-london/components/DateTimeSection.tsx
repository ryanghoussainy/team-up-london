import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Fonts from '../config/Fonts';

interface DateTimeSectionProps {
  startTime: Date;
  endTime: Date;
  showStartDatePicker: boolean;
  showStartTimePicker: boolean;
  showEndDatePicker: boolean;
  showEndTimePicker: boolean;
  onShowStartDatePicker: (show: boolean) => void;
  onShowStartTimePicker: (show: boolean) => void;
  onShowEndDatePicker: (show: boolean) => void;
  onShowEndTimePicker: (show: boolean) => void;
  onStartDateChange: (event: any, selectedDate?: Date) => void;
  onStartTimeChange: (event: any, selectedDate?: Date) => void;
  onEndDateChange: (event: any, selectedDate?: Date) => void;
  onEndTimeChange: (event: any, selectedDate?: Date) => void;
  formatDate: (date: Date) => string;
  formatTime: (date: Date) => string;
}

export default function DateTimeSection({
  startTime,
  endTime,
  showStartDatePicker,
  showStartTimePicker,
  showEndDatePicker,
  showEndTimePicker,
  onShowStartDatePicker,
  onShowStartTimePicker,
  onShowEndDatePicker,
  onShowEndTimePicker,
  onStartDateChange,
  onStartTimeChange,
  onEndDateChange,
  onEndTimeChange,
  formatDate,
  formatTime,
}: DateTimeSectionProps) {
  return (
    <>
      {/* Start Date and Time */}
      <View style={styles.field}>
        <Text style={styles.label}>
          Start Date & Time <Text style={{ color: 'red' }}>*</Text>
        </Text>
        <View style={styles.dateTimeContainer}>
          <TouchableOpacity
            style={[styles.input, styles.dateTimeInput]}
            onPress={() => onShowStartDatePicker(true)}
          >
            <Text style={styles.dateTimeText}>{formatDate(startTime)}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.input, styles.dateTimeInput]}
            onPress={() => onShowStartTimePicker(true)}
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
            onPress={() => onShowEndDatePicker(true)}
          >
            <Text style={styles.dateTimeText}>{formatDate(endTime)}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.input, styles.dateTimeInput]}
            onPress={() => onShowEndTimePicker(true)}
          >
            <Text style={styles.dateTimeText}>{formatTime(endTime)}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Date Time Pickers */}
      {showStartDatePicker && (
        <DateTimePicker
          value={startTime}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onStartDateChange}
          minimumDate={new Date()}
        />
      )}

      {showStartTimePicker && (
        <DateTimePicker
          value={startTime}
          mode="time"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onStartTimeChange}
        />
      )}

      {showEndDatePicker && (
        <DateTimePicker
          value={endTime}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onEndDateChange}
          minimumDate={new Date()}
        />
      )}

      {showEndTimePicker && (
        <DateTimePicker
          value={endTime}
          mode="time"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onEndTimeChange}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
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
});
