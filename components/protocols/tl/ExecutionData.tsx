import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

interface ExecutionDataProps {
  data: Array<{
    dayOfWeek?: string;
    date?: Date;
    startTime?: Date;
    endTime?: Date;
    numberOfTechnicians?: string;
    technicalLeader?: string;
  }>;
  onUpdate: (data: ExecutionDataProps['data']) => void;
}

export default function ExecutionData({ data, onUpdate }: ExecutionDataProps) {
  const [showPicker, setShowPicker] = useState<{
    index: number;
    field: 'date' | 'startTime' | 'endTime';
  } | null>(null);

  const handleDateChange = (index: number, field: 'date' | 'startTime' | 'endTime', value: Date) => {
    const updatedData = [...data];
    if (!updatedData[index]) updatedData[index] = {};
    updatedData[index][field] = value;

    onUpdate(updatedData);
    setShowPicker(null); // Cerrar el picker después de seleccionar
  };

  const handleTextChange = (index: number, field: 'numberOfTechnicians' | 'technicalLeader', value: string) => {
    const updatedData = [...data];
    if (!updatedData[index]) updatedData[index] = {};
    updatedData[index][field] = value;

    onUpdate(updatedData);
  };

  const addDay = () => {
    if (data.length < 7) {
      const updatedData = [...data, {}];
      onUpdate(updatedData);
    }
  };

  const formatDate = (date: Date) => date.toLocaleDateString('es-ES');
  const formatTime = (date: Date) => date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ejecución</Text>

      {data.map((day, index) => (
        <View key={`day-${index}`} style={styles.dayContainer}>
          <Text style={styles.dayTitle}>Día {index + 1}</Text>

          {/* Fecha */}
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowPicker({ index, field: 'date' })}
          >
            <Text>{day.date ? formatDate(day.date) : 'Seleccionar Fecha'}</Text>
          </TouchableOpacity>

          {/* Hora de inicio */}
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowPicker({ index, field: 'startTime' })}
          >
            <Text>{day.startTime ? formatTime(day.startTime) : 'Seleccionar Hora de Inicio'}</Text>
          </TouchableOpacity>

          {/* Hora de fin */}
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowPicker({ index, field: 'endTime' })}
          >
            <Text>{day.endTime ? formatTime(day.endTime) : 'Seleccionar Hora de Fin'}</Text>
          </TouchableOpacity>

          {/* Número de técnicos */}
          <TextInput
            style={styles.input}
            placeholder="Número de Técnicos"
            value={day.numberOfTechnicians}
            onChangeText={(t) => handleTextChange(index, 'numberOfTechnicians', t)}
            keyboardType="numeric"
          />

          {/* Líder técnico */}
          <TextInput
            style={styles.input}
            placeholder="Líder Técnico"
            value={day.technicalLeader}
            onChangeText={(t) => handleTextChange(index, 'technicalLeader', t)}
          />
        </View>
      ))}

      {data.length < 7 && (
        <TouchableOpacity style={styles.addButton} onPress={addDay}>
          <Text style={styles.addButtonText}>+ Agregar Día</Text>
        </TouchableOpacity>
      )}

      {/* DatePicker y TimePicker */}
      {showPicker && (
        <DateTimePicker
          value={data[showPicker.index]?.[showPicker.field] || new Date()}
          mode={showPicker.field === 'date' ? 'date' : 'time'}
          display="default"
          onChange={(event, selectedDate) => {
            if (selectedDate) {
              handleDateChange(showPicker.index, showPicker.field, selectedDate);
            }
          }}
        />
      )}
    </View>
  );
}

// Estilos
const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  dayContainer: {
    marginBottom: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  dayTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#444',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
    marginBottom: 12,
  },
  addButton: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});