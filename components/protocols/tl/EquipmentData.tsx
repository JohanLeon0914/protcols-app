import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';

interface EquipmentDataProps {
  data: {
    type?: string;
    model?: string;
    serial?: string;
    input?: {
      type?: 'AC' | 'DC';
      phases?: string;
      current?: string;
    };
    output?: {
      type?: 'AC' | 'DC';
      currentOrPower?: string;
      frequency?: string;
    };
    batteryBank?: {
      hasBatteryBank?: boolean;
      numberOfBanks?: string;
      brand?: string;
      model?: string;
      capacity?: string;
      numberOfCells?: string;
    };
  };
  onUpdate: (data: Partial<EquipmentDataProps['data']>) => void;
}

export default function EquipmentData({ data, onUpdate }: EquipmentDataProps) {
  const handleInputChange = (field: string, value: string, section?: 'input' | 'output' | 'batteryBank') => {
    if (section) {
      onUpdate({
        [section]: {
          ...data[section],
          [field]: value,
        },
      });
    } else {
      onUpdate({ [field]: value });
    }
  };

  const handleBatteryBankChange = (hasBatteryBank: boolean) => {
    onUpdate({
      batteryBank: {
        ...data.batteryBank,
        hasBatteryBank,
      },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Datos del Equipo</Text>

      {/* Tipo, Modelo, Serial */}
      <View style={styles.row}>
        <FormField
          label="Tipo"
          value={data.type}
          onChangeText={(t: string) => handleInputChange('type', t)}
          style={styles.column}
        />
        <FormField
          label="Modelo"
          value={data.model}
          onChangeText={(t: string) => handleInputChange('model', t)}
          style={styles.column}
        />
        <FormField
          label="Serial"
          value={data.serial}
          onChangeText={(t: string) => handleInputChange('serial', t)}
          style={styles.column}
        />
      </View>

      {/* Entrada */}
      <Text style={styles.subtitle}>Entrada</Text>
      <View style={styles.row}>
        <RadioButtonGroup
          label="Tipo"
          options={['AC', 'DC']}
          selected={data.input?.type}
          onSelect={(value: 'AC' | 'DC') => handleInputChange('type', value, 'input')}
          style={styles.column}
        />
        <FormField
          label="Nº Fases"
          value={data.input?.phases}
          onChangeText={(t: string) => handleInputChange('phases', t, 'input')}
          style={styles.column}
        />
        <FormField
          label="Corriente (A)"
          value={data.input?.current}
          onChangeText={(t: string) => handleInputChange('current', t, 'input')}
          style={styles.column}
        />
      </View>

      {/* Salida */}
      <Text style={styles.subtitle}>Salida</Text>
      <View style={styles.row}>
        <RadioButtonGroup
          label="Tipo"
          options={['AC', 'DC']}
          selected={data.output?.type}
          onSelect={(value: 'AC' | 'DC') => handleInputChange('type', value, 'output')}
          style={styles.column}
        />
        <FormField
          label="Corriente (A) / Potencia (RVA)"
          value={data.output?.currentOrPower}
          onChangeText={(t: string) => handleInputChange('currentOrPower', t, 'output')}
          style={styles.column}
        />
        <FormField
          label="Frecuencia (HZ)"
          value={data.output?.frequency}
          onChangeText={(t: string) => handleInputChange('frequency', t, 'output')}
          style={styles.column}
        />
      </View>

      {/* Banco de Baterías */}
      <Text style={styles.subtitle}>Banco de Baterías</Text>
      <View style={styles.row}>
        <RadioButtonGroup
          label="Tiene Banco de Baterías"
          options={['Sí', 'No']}
          selected={data.batteryBank?.hasBatteryBank ? 'Sí' : 'No'}
          onSelect={(value: string) => handleBatteryBankChange(value === 'Sí')}
          style={styles.column}
        />
        <FormField
          label="Nº de Bancos"
          value={data.batteryBank?.numberOfBanks}
          onChangeText={(t: string) => handleInputChange('numberOfBanks', t, 'batteryBank')}
          style={styles.column}
        />
        <FormField
          label="Marca"
          value={data.batteryBank?.brand}
          onChangeText={(t: string) => handleInputChange('brand', t, 'batteryBank')}
          style={styles.column}
        />
      </View>
      <View style={styles.row}>
        <FormField
          label="Modelo"
          value={data.batteryBank?.model}
          onChangeText={(t: string) => handleInputChange('model', t, 'batteryBank')}
          style={styles.column}
        />
        <FormField
          label="Capacidad (A/H)"
          value={data.batteryBank?.capacity}
          onChangeText={(t: string) => handleInputChange('capacity', t, 'batteryBank')}
          style={styles.column}
        />
        <FormField
          label="Nº de Celdas"
          value={data.batteryBank?.numberOfCells}
          onChangeText={(t: string) => handleInputChange('numberOfCells', t, 'batteryBank')}
          style={styles.column}
        />
      </View>
    </View>
  );
}

// Componente RadioButtonGroup
interface RadioButtonGroupProps {
  label: string;
  options: string[];
  selected?: string;
  onSelect: (value: string) => void;
  style?: any;
}

function RadioButtonGroup({ label, options, selected, onSelect, style }: RadioButtonGroupProps) {
  return (
    <View style={[styles.radioGroup, style]}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.radioOptions}>
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            style={styles.radioOption}
            onPress={() => onSelect(option)}
          >
            <View style={[styles.radio, selected === option && styles.radioSelected]}>
              {selected === option && <View style={styles.radioInner} />}
            </View>
            <Text style={styles.radioLabel}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

// Componente FormField (reutilizado del anterior)
interface FormFieldProps {
  label: string;
  value?: string;
  onChangeText: (text: string) => void;
  style?: any;
}

function FormField({ label, value, onChangeText, style }: FormFieldProps) {
  return (
    <View style={[styles.fieldContainer, style]}>
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  column: {
    width: '30%',
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
  radioGroup: {
    marginBottom: 12,
  },
  radioOptions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioOption: {
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
});