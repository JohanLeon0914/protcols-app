import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

interface TransferDataProps {
  data: {
    departure?: Array<{ date?: Date; departureTime?: Date; arrivalTime?: Date }>;
    return?: Array<{ date?: Date; departureTime?: Date; arrivalTime?: Date }>;
  };
  onUpdate: (data: Partial<TransferDataProps['data']>) => void;
}

export default function TransferData({ data, onUpdate }: TransferDataProps) {
  const [showPicker, setShowPicker] = useState<{
    type: 'departure' | 'return';
    index: number;
    field: 'date' | 'departureTime' | 'arrivalTime';
  } | null>(null);

  const handleDateChange = (
    type: 'departure' | 'return',
    index: number,
    field: 'date' | 'departureTime' | 'arrivalTime',
    value: Date
  ) => {
    const updatedTimes = [...(data[type] || [])];
    if (!updatedTimes[index]) updatedTimes[index] = { date: new Date(), departureTime: new Date(), arrivalTime: new Date() };
    updatedTimes[index][field] = value;

    onUpdate({ [type]: updatedTimes });
    setShowPicker(null); // Cerrar el picker después de seleccionar
  };

  const addDate = (type: 'departure' | 'return') => {
    const updatedTimes = [...(data[type] || [])];
    if (updatedTimes.length < 3) {
      updatedTimes.push({ date: new Date(), departureTime: new Date(), arrivalTime: new Date() });
      onUpdate({ [type]: updatedTimes });
    }
  };

  const formatDate = (date: Date) => date.toLocaleDateString('es-ES');
  const formatTime = (date: Date) => date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Traslado</Text>

      {/* Ida */}
      <Text style={styles.subtitle}>Ida</Text>
      {(data.departure || []).map((date, index) => (
        <View key={`departure-${index}`} style={styles.dateContainer}>
            <Text style={styles.subtitle}>Fecha</Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowPicker({ type: 'departure', index, field: 'date' })}
          >
            <Text>{date.date ? formatDate(date.date) : 'Seleccionar Fecha'}</Text>
          </TouchableOpacity>
          <Text>Hora de salida</Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowPicker({ type: 'departure', index, field: 'departureTime' })}
          >
            <Text>{date.departureTime ? formatTime(date.departureTime) : 'Seleccionar Hora de Salida'}</Text>
          </TouchableOpacity>
          <Text style={styles.subtitle}>Hora de llegada</Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowPicker({ type: 'departure', index, field: 'arrivalTime' })}
          >
            <Text style={styles.subtitle}>{date.arrivalTime ? formatTime(date.arrivalTime) : 'Seleccionar Hora de Llegada'}</Text>
          </TouchableOpacity>
        </View>
      ))}
      {(data.departure || []).length < 3 && (
        <TouchableOpacity style={styles.addButton} onPress={() => addDate('departure')}>
          <Text style={styles.addButtonText}>+ Agregar Fecha de Ida</Text>
        </TouchableOpacity>
      )}

      {/* Llegada */}
      <Text style={styles.subtitle}>Llegada</Text>
      {(data.return || []).map((date, index) => (
        <View key={`return-${index}`} style={styles.dateContainer}>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowPicker({ type: 'return', index, field: 'date' })}
          >
            <Text>{date.date ? formatDate(date.date) : 'Seleccionar Fecha'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowPicker({ type: 'return', index, field: 'departureTime' })}
          >
            <Text>{date.departureTime ? formatTime(date.departureTime) : 'Seleccionar Hora de Salida'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowPicker({ type: 'return', index, field: 'arrivalTime' })}
          >
            <Text>{date.arrivalTime ? formatTime(date.arrivalTime) : 'Seleccionar Hora de Llegada'}</Text>
          </TouchableOpacity>
        </View>
      ))}
      {(data.return || []).length < 3 && (
        <TouchableOpacity style={styles.addButton} onPress={() => addDate('return')}>
          <Text style={styles.addButtonText}>+ Agregar Fecha de Llegada</Text>
        </TouchableOpacity>
      )}

      {/* DatePicker y TimePicker */}
      {showPicker && (
        <DateTimePicker
          value={data[showPicker.type]?.[showPicker.index]?.[showPicker.field] || new Date()}
          mode={showPicker.field === 'date' ? 'date' : 'time'}
          display="default"
          onChange={(event, selectedDate) => {
            if (selectedDate) {
              handleDateChange(showPicker.type, showPicker.index, showPicker.field, selectedDate);
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
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 8,
    color: '#444',
  },
  dateContainer: {
    marginBottom: 16,
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