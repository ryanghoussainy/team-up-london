import { Picker } from "@react-native-picker/picker";
import { Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Fonts from "../config/Fonts";
import Colours from "../config/Colours";
import { useState } from "react";
import DateTimePicker from '@react-native-community/datetimepicker';
import useSports from "../hooks/useSports";

interface GameFilterModalProps {
    visible: boolean;
    onClose: () => void;
    onApplyFilters: () => void;
    tempSkillFilter: 'all' | 'beginner' | 'intermediate' | 'advanced' | 'expert';
    setTempSkillFilter: (value: 'all' | 'beginner' | 'intermediate' | 'advanced' | 'expert') => void;
    tempLocationFilter: string;
    setTempLocationFilter: (value: string) => void;
    tempSelectedDate: Date | null;
    setTempSelectedDate: (value: Date | null) => void;
    tempSelectedSportIds: string[];
    toggleSportSelection: (sportId: string) => void;
}

export default function GameFilterModal({
    visible,
    onClose,
    onApplyFilters,
    tempSkillFilter,
    setTempSkillFilter,
    tempLocationFilter,
    setTempLocationFilter,
    tempSelectedDate,
    setTempSelectedDate,
    tempSelectedSportIds,
    toggleSportSelection
}: GameFilterModalProps) {
    const { sports } = useSports();
    const [showDatePicker, setShowDatePicker] = useState(false);

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={{
                flex: 1,
                backgroundColor: 'rgba(0,0,0,0.4)',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <View style={{
                    backgroundColor: '#fff',
                    borderRadius: 12,
                    padding: 20,
                    width: '90%',
                    maxWidth: 400,
                    maxHeight: '80%',
                }}>
                    <Text style={[styles.subTitle, { textAlign: 'center', marginBottom: 16 }]}>Filter Games</Text>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        {/* Sports Filter */}
                        <View style={styles.formGroup}>
                            <Text style={styles.subTitleText}>Sports</Text>
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                style={styles.sportsContainer}
                                contentContainerStyle={styles.sportsContentContainer}
                            >
                                {sports.map((sport) => (
                                    <TouchableOpacity
                                        key={sport.id}
                                        style={[
                                            styles.sportChip,
                                            tempSelectedSportIds.includes(sport.id) && styles.sportChipSelected
                                        ]}
                                        onPress={() => toggleSportSelection(sport.id)}
                                    >
                                        <Text style={[
                                            styles.sportChipText,
                                            tempSelectedSportIds.includes(sport.id) && styles.sportChipTextSelected
                                        ]}>
                                            {sport.name}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                            {tempSelectedSportIds.length > 0 && (
                                <TouchableOpacity
                                    onPress={() => setTempSelectedDate(null)}
                                    style={{ marginTop: 8 }}
                                >
                                    <Text style={{ color: 'red', textAlign: 'center', fontSize: 14 }}>Clear All Sports</Text>
                                </TouchableOpacity>
                            )}
                        </View>

                        {/* Skill-Level Picker */}
                        <View style={styles.formGroup}>
                            <Text style={styles.subTitleText}>Skill Level</Text>
                            <View style={styles.pickerContainer}>
                                <Picker
                                    selectedValue={tempSkillFilter}
                                    onValueChange={(itemValue) =>
                                        setTempSkillFilter(itemValue as 'all' | 'beginner' | 'intermediate' | 'advanced' | 'expert')
                                    }
                                    style={styles.picker}
                                >
                                    <Picker.Item label="All" value="all" />
                                    <Picker.Item label="Beginner" value="beginner" />
                                    <Picker.Item label="Intermediate" value="intermediate" />
                                    <Picker.Item label="Advanced" value="advanced" />
                                    <Picker.Item label="Expert" value="expert" />
                                </Picker>
                            </View>
                        </View>

                        {/* Location Filter Input */}
                        <View style={styles.formGroup}>
                            <Text style={styles.subTitleText}>Location</Text>
                            <TextInput
                                style={styles.modalInput}
                                placeholder="Location..."
                                placeholderTextColor={'#888'}
                                value={tempLocationFilter}
                                onChangeText={setTempLocationFilter}
                            />
                        </View>

                        {/* Date Filter */}
                        <View style={styles.formGroup}>
                            <Text style={styles.subTitleText}>Date</Text>
                            <TouchableOpacity
                                onPress={() => setShowDatePicker(true)}
                                style={[styles.button, { paddingVertical: 12 }]}
                            >
                                <Text style={styles.buttonText}>
                                    {tempSelectedDate
                                        ? tempSelectedDate.toLocaleDateString()
                                        : 'Pick Date'}
                                </Text>
                            </TouchableOpacity>
                            {tempSelectedDate && (
                                <TouchableOpacity
                                    onPress={() => setTempSelectedDate(null)}
                                    style={{ marginTop: 8 }}
                                >
                                    <Text style={{ color: 'red', textAlign: 'center' }}>Clear Date</Text>
                                </TouchableOpacity>
                            )}
                            {showDatePicker && (
                                <DateTimePicker
                                    value={tempSelectedDate || new Date()}
                                    mode="date"
                                    display="default"
                                    style={styles.datePicker}
                                    onChange={(event, date) => {
                                        setShowDatePicker(Platform.OS === 'ios');
                                        if (date) setTempSelectedDate(date);
                                    }}
                                />
                            )}
                        </View>
                    </ScrollView>

                    {/* Modal Actions */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 }}>
                        <TouchableOpacity
                            style={[styles.button, { flex: 1, marginRight: 8 }]}
                            onPress={onClose}
                        >
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, { flex: 1, marginLeft: 8, backgroundColor: Colours.primary }]}
                            onPress={onApplyFilters}
                        >
                            <Text style={[styles.buttonText, { color: 'white' }]}>Apply</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    subTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        fontFamily: Fonts.main,
        marginBottom: 8,
        textAlign: 'left',
        alignSelf: 'center',
    },
    subTitleText: {
        fontSize: 18,
        fontWeight: '600',
        fontFamily: Fonts.main,
        textAlign: 'left',
        marginBottom: 8,
    },
    button: {
        backgroundColor: Colours.extraButtons,
        outlineColor: Colours.primary,
        borderWidth: 0,
        borderColor: Colours.primary,
        padding: 10,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 16,
        fontFamily: Fonts.main,
        marginLeft: 8,
    },
    formGroup: {
        marginBottom: 24,
        width: '100%',
    },
    modalInput: {
        height: 55,
        width: '100%',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        fontSize: 16,
        fontFamily: Fonts.main,
    },
    picker: {
        width: '100%',
        height: '100%',
        fontSize: 16,
        fontFamily: Fonts.main,
        color: '#333',
    },
    pickerContainer: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        overflow: 'hidden',
        height: Platform.OS === 'ios' ? 150 : 55,
        justifyContent: 'flex-start',
    },
    datePicker: {
        alignSelf: 'center',
        marginTop: 10,
    },
    sportsContainer: {
        maxHeight: 60,
    },
    sportsContentContainer: {
        paddingHorizontal: 4,
        alignItems: 'center',
    },
    sportChip: {
        backgroundColor: '#f0f0f0',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginRight: 8,
        marginVertical: 4,
    },
    sportChipSelected: {
        backgroundColor: Colours.primary,
        borderColor: Colours.primary,
    },
    sportChipText: {
        fontSize: 14,
        fontFamily: Fonts.main,
        color: '#333',
    },
    sportChipTextSelected: {
        color: 'white',
    },
});
