import { View, Text, TextInput, StyleSheet } from 'react-native';

interface GeneralDataProps {
  data: {
    projects?: string;
    purchaseOrder?: string;
    address?: string;
    requestedBy?: {
      businessName?: string;
      contact?: string;
      phone?: string;
      email?: string;
    };
    endUser?: {
      businessName?: string;
      contact?: string;
      phone?: string;
      email?: string;
    };
  };
  onUpdate: (data: Partial<GeneralDataProps['data']>) => void;
}

export default function GeneralData({ data, onUpdate }: GeneralDataProps) {
  const handleChange = (field: string, value: string, section?: 'requestedBy' | 'endUser') => {
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Información General</Text>

      <FormField
        label="Proyecto"
        value={data.projects}
        onChangeText={(t: string) => handleChange('projects', t)}
      />

      <FormField
        label="Orden de compra"
        value={data.purchaseOrder}
        onChangeText={(t: string) => handleChange('purchaseOrder', t)}
      />

      <FormField
        label="Dirección"
        value={data.address}
        onChangeText={(t: string) => handleChange('address', t)}
      />

      {/* Sección Solicitado por */}
      <Text style={styles.subtitle}>Solicitado por</Text>
      <FormField
        label="Razón Social"
        value={data.requestedBy?.businessName}
        onChangeText={(t: string) => handleChange('businessName', t, 'requestedBy')}
      />
      <FormField
        label="Contacto"
        value={data.requestedBy?.contact}
        onChangeText={(t: string) => handleChange('contact', t, 'requestedBy')}
      />
      <FormField
        label="Teléfono"
        value={data.requestedBy?.phone}
        onChangeText={(t: string) => handleChange('phone', t, 'requestedBy')}
      />
      <FormField
        label="e-mail"
        value={data.requestedBy?.email}
        onChangeText={(t: string) => handleChange('email', t, 'requestedBy')}
      />

      {/* Sección Usuario final */}
      <Text style={styles.subtitle}>Usuario final</Text>
      <FormField
        label="Razón Social"
        value={data.endUser?.businessName}
        onChangeText={(t: string) => handleChange('businessName', t, 'endUser')}
      />
      <FormField
        label="Contacto"
        value={data.endUser?.contact}
        onChangeText={(t: string) => handleChange('contact', t, 'endUser')}
      />
      <FormField
        label="Teléfono"
        value={data.endUser?.phone}
        onChangeText={(t: string) => handleChange('phone', t, 'endUser')}
      />
      <FormField
        label="e-mail"
        value={data.endUser?.email}
        onChangeText={(t: string) => handleChange('email', t, 'endUser')}
      />
    </View>
  );
}

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
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 12,
    color: '#444',
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