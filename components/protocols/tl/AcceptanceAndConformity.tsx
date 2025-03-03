import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';

interface AcceptanceAndConformityProps {
  data: {
    technicalInterventionConform?: boolean;
    comments?: string;
  };
  onUpdate: (data: Partial<AcceptanceAndConformityProps['data']>) => void;
}

export default function AcceptanceAndConformity({ data, onUpdate }: AcceptanceAndConformityProps) {
  const handleCheckboxChange = (field: keyof AcceptanceAndConformityProps['data'], value: boolean) => {
    onUpdate({ [field]: value });
  };

  const handleTextChange = (field: keyof AcceptanceAndConformityProps['data'], value: string) => {
    onUpdate({ [field]: value });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Aceptación y Conformidad</Text>

      {/* Intervención técnica conforme */}
      <Checkbox
        label="Intervención técnica conforme"
        checked={data.technicalInterventionConform || false}
        onChange={(checked) => handleCheckboxChange('technicalInterventionConform', checked)}
      />

      {/* Comentarios */}
      <FormField
        label="Comentarios"
        value={data.comments}
        onChangeText={(t: string) => handleTextChange('comments', t)}
        multiline
      />
    </View>
  );
}

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

interface FormFieldProps {
  label: string;
  value?: string;
  onChangeText: (text: string) => void;
  multiline?: boolean;
}

function FormField({ label, value, onChangeText, multiline = false }: FormFieldProps) {
  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && styles.multilineInput]}
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
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
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
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
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
});