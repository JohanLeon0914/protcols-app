import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';

interface MeasurementAndEnvironmentProps {
  data: {
    digitalMultimeter?: boolean;
    clampMeter?: boolean;
    batteryTester?: boolean;
    torqueWrench?: boolean;
    temperatureMeter?: boolean;
    otherInstruments?: string;
    ambientTemperature?: string;
    relativeHumidity?: string;
    excessiveDust?: boolean;
  };
  onUpdate: (data: Partial<MeasurementAndEnvironmentProps['data']>) => void;
}

export default function MeasurementAndEnvironment({ data, onUpdate }: MeasurementAndEnvironmentProps) {
  const handleCheckboxChange = (field: keyof MeasurementAndEnvironmentProps['data'], value: boolean) => {
    onUpdate({ [field]: value });
  };

  const handleTextChange = (field: keyof MeasurementAndEnvironmentProps['data'], value: string) => {
    onUpdate({ [field]: value });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Datos de Instrumentos de Medición y Ambiente de Operación</Text>

      {/* Instrumentos de Medición */}
      <Text style={styles.subtitle}>Instrumentos de Medición</Text>
      <View style={styles.column}>
        <Checkbox
          label="Multímetro Digital"
          checked={data.digitalMultimeter || false}
          onChange={(checked) => handleCheckboxChange('digitalMultimeter', checked)}
        />
        <Checkbox
          label="Pinza Amperimétrica"
          checked={data.clampMeter || false}
          onChange={(checked) => handleCheckboxChange('clampMeter', checked)}
        />
        <Checkbox
          label="Probador de Baterías"
          checked={data.batteryTester || false}
          onChange={(checked) => handleCheckboxChange('batteryTester', checked)}
        />
        <Checkbox
          label="Torquímetro"
          checked={data.torqueWrench || false}
          onChange={(checked) => handleCheckboxChange('torqueWrench', checked)}
        />
        <Checkbox
          label="Medidor de Temperatura"
          checked={data.temperatureMeter || false}
          onChange={(checked) => handleCheckboxChange('temperatureMeter', checked)}
        />
        <FormField
          label="Otros"
          value={data.otherInstruments}
          onChangeText={(t: string) => handleTextChange('otherInstruments', t)}
        />
      </View>

      {/* Ambiente de Operación */}
      <Text style={styles.subtitle}>Ambiente de Operación</Text>
      <View style={styles.column}>
        <FormField
          label="Temperatura Ambiente (°C)"
          value={data.ambientTemperature}
          onChangeText={(t: string) => handleTextChange('ambientTemperature', t)}
          keyboardType="numeric"
        />
        <FormField
          label="Humedad Relativa (%)"
          value={data.relativeHumidity}
          onChangeText={(t: string) => handleTextChange('relativeHumidity', t)}
          keyboardType="numeric"
        />
        <Checkbox
          label="Presencia de Polvo Excesivo"
          checked={data.excessiveDust || false}
          onChange={(checked) => handleCheckboxChange('excessiveDust', checked)}
        />
      </View>
    </View>
  );
}

// Componente Checkbox
interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

function Checkbox({ label, checked, onChange }: CheckboxProps) {
  return (
    <TouchableOpacity
      style={styles.checkboxContainer}
      onPress={() => onChange(!checked)}
    >
      <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
        {checked && <Text style={styles.checkboxIcon}>✓</Text>}
      </View>
      <Text style={styles.checkboxLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

// Componente FormField (reutilizado del anterior)
interface FormFieldProps {
  label: string;
  value?: string;
  onChangeText: (text: string) => void;
  keyboardType?: 'default' | 'numeric';
}

function FormField({ label, value, onChangeText, keyboardType = 'default' }: FormFieldProps) {
  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
      />
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
  column: {
    marginBottom: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  checkboxChecked: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  checkboxIcon: {
    color: '#fff',
    fontSize: 14,
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#333',
  },
  fieldContainer: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
    fontSize: 16,
  },
});