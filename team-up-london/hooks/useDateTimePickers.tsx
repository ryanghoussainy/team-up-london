import { useState } from 'react';

export default function useDateTimePickers() {
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  const handleStartDateChange = (event: any, selectedDate?: Date) => {
    setShowStartDatePicker(false);
    if (selectedDate) {
      const newStartTime = new Date(startTime);
      newStartTime.setFullYear(selectedDate.getFullYear());
      newStartTime.setMonth(selectedDate.getMonth());
      newStartTime.setDate(selectedDate.getDate());
      setStartTime(newStartTime);
    }
  };

  const handleStartTimeChange = (event: any, selectedTime?: Date) => {
    setShowStartTimePicker(false);
    if (selectedTime) {
      const newStartTime = new Date(startTime);
      newStartTime.setHours(selectedTime.getHours());
      newStartTime.setMinutes(selectedTime.getMinutes());
      setStartTime(newStartTime);
    }
  };

  const handleEndDateChange = (event: any, selectedDate?: Date) => {
    setShowEndDatePicker(false);
    if (selectedDate) {
      const newEndTime = new Date(endTime);
      newEndTime.setFullYear(selectedDate.getFullYear());
      newEndTime.setMonth(selectedDate.getMonth());
      newEndTime.setDate(selectedDate.getDate());
      setEndTime(newEndTime);
    }
  };

  const handleEndTimeChange = (event: any, selectedTime?: Date) => {
    setShowEndTimePicker(false);
    if (selectedTime) {
      const newEndTime = new Date(endTime);
      newEndTime.setHours(selectedTime.getHours());
      newEndTime.setMinutes(selectedTime.getMinutes());
      setEndTime(newEndTime);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-GB');
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  return {
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
  };
}
