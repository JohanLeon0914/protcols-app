import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

interface TechnicalInterventionProps {
  data: {
    arrangementAndStartup?: boolean;
    maintenance?: 'preventivo' | 'correctivo' | null;
    onSiteInspection?: boolean;
    onSiteAssistance?: boolean;
    installation?: boolean;
    batteryAutonomyTest?: boolean;
    batteryCapacityTest?: boolean;
    phoneAssistance?: boolean;
    other?: string;
  };
  onUpdate: (data: Partial<TechnicalInterventionProps['data']>) => void;
}

export default function TechnicalIntervention({ data, onUpdate }: TechnicalInterventionProps) {
  const handleCheckboxChange = (field: keyof TechnicalInterventionProps['data'], value: boolean) => {
    onUpdate({ [field]: value });
  };

  const handleMaintenanceChange = (value: 'preventivo' | 'correctivo') => {
    onUpdate({ maintenance: value });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tipo de Intervención Técnica</Text>

      {/* Checkboxes */}
      <Checkbox
        label="Arranque y puesta en marcha"
        checked={data.arrangementAndStartup || false}
        onChange={(checked) => handleCheckboxChange('arrangementAndStartup', checked)}
      />
      <Checkbox
        label="Inspección en sitio"
        checked={data.onSiteInspection || false}
        onChange={(checked) => handleCheckboxChange('onSiteInspection', checked)}
      />
      <Checkbox
        label="Asistencia en sitio"
        checked={data.onSiteAssistance || false}
        onChange={(checked) => handleCheckboxChange('onSiteAssistance', checked)}
      />
      <Checkbox
        label="Instalación"
        checked={data.installation || false}
        onChange={(checked) => handleCheckboxChange('installation', checked)}
      />
      <Checkbox
        label="Prueba Autonomía Baterías"
        checked={data.batteryAutonomyTest || false}
        onChange={(checked) => handleCheckboxChange('batteryAutonomyTest', checked)}
      />
      <Checkbox
        label="Prueba capacidad Baterías"
        checked={data.batteryCapacityTest || false}
        onChange={(checked) => handleCheckboxChange('batteryCapacityTest', checked)}
      />
      <Checkbox
        label="Asistencia telefónica"
        checked={data.phoneAssistance || false}
        onChange={(checked) => handleCheckboxChange('phoneAssistance', checked)}
      />

      {/* Radio buttons para Mantenimiento */}
      <Text style={styles.subtitle}>Mantenimiento</Text>
      <View style={styles.radioGroup}>
        <RadioButton
          label="Preventivo"
          selected={data.maintenance === 'preventivo'}
          onPress={() => handleMaintenanceChange('preventivo')}
        />
        <RadioButton
          label="Correctivo"
          selected={data.maintenance === 'correctivo'}
          onPress={() => handleMaintenanceChange('correctivo')}
        />
      </View>

      {/* Input para Otro */}
      <FormField
        label="Otro"
        value={data.other || ''}
        onChangeText={(t: string) => onUpdate({ other: t })}
      />
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

// Componente RadioButton
interface RadioButtonProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

function RadioButton({ label, selected, onPress }: RadioButtonProps) {
  return (
    <TouchableOpacity
      style={styles.radioContainer}
      onPress={onPress}
    >
      <View style={[styles.radio, selected && styles.radioSelected]}>
        {selected && <View style={styles.radioInner} />}
      </View>
      <Text style={styles.radioLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

// Componente FormField (reutilizado del anterior)
interface FormFieldProps {
  label: string;
  value?: string;
  onChangeText: (text: string) => void;
}

function FormField({ label, value, onChangeText }: FormFieldProps) {
  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
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
  radioGroup: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  radio: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  radioSelected: {
    borderColor: '#007bff',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#007bff',
  },
  radioLabel: {
    fontSize: 16,
    color: '#333',
  },
  fieldContainer: {
    marginBottom: 16,
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