import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Modal, Dimensions } from 'react-native';
import SignatureCanvas from 'react-native-signature-canvas';

interface ValidationProps {
  data: {
    technicalLeader?: {
      signature?: string;
      name?: string;
      id?: string;
    };
    endUser?: {
      signature?: string;
      name?: string;
      id?: string;
    };
  };
  onUpdate: (data: Partial<ValidationProps['data']>) => void;
}

export default function Validation({ data, onUpdate }: ValidationProps) {
  const [technicalLeaderSignature, setTechnicalLeaderSignature] = useState<string | null>(null);
  const [endUserSignature, setEndUserSignature] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentSigner, setCurrentSigner] = useState<'technicalLeader' | 'endUser' | null>(null);

  const handleTextChange = (type: 'technicalLeader' | 'endUser', field: 'name' | 'id', value: string) => {
    onUpdate({ [type]: { ...data[type], [field]: value } });
  };

  const handleSignatureSave = (signature: string) => {
    console.log(signature)
    if (currentSigner === 'technicalLeader') {
      setTechnicalLeaderSignature(signature);
      onUpdate({ technicalLeader: { ...data.technicalLeader, signature } });
    } else if (currentSigner === 'endUser') {
      setEndUserSignature(signature);
      onUpdate({ endUser: { ...data.endUser, signature } });
    }
    setIsModalVisible(false); 
  };

  const openSignatureModal = (type: 'technicalLeader' | 'endUser') => {
    setCurrentSigner(type);
    setIsModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Validación</Text>

      {/* Líder Técnico */}
      <Text style={styles.subtitle}>Firma Líder Técnico</Text>
      <TouchableOpacity style={styles.signatureButton} onPress={() => openSignatureModal('technicalLeader')}>
        <Text style={styles.signatureButtonText}>Firmar</Text>
      </TouchableOpacity>
      <FormField
        label="Nombre"
        value={data.technicalLeader?.name}
        onChangeText={(t: string) => handleTextChange('technicalLeader', 'name', t)}
      />
      <FormField
        label="Cédula"
        value={data.technicalLeader?.id}
        onChangeText={(t: string) => handleTextChange('technicalLeader', 'id', t)}
        keyboardType="numeric"
      />

      {/* Usuario Final */}
      <Text style={styles.subtitle}>Firma Usuario Final</Text>
      <TouchableOpacity style={styles.signatureButton} onPress={() => openSignatureModal('endUser')}>
        <Text style={styles.signatureButtonText}>Firmar</Text>
      </TouchableOpacity>
      <FormField
        label="Nombre"
        value={data.endUser?.name}
        onChangeText={(t: string) => handleTextChange('endUser', 'name', t)}
      />
      <FormField
        label="Cédula"
        value={data.endUser?.id}
        onChangeText={(t: string) => handleTextChange('endUser', 'id', t)}
        keyboardType="numeric"
      />

      {/* Modal para la firma */}
      <Modal visible={isModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <SignatureCanvas
              onOK={handleSignatureSave}
              style={styles.signatureCanvas}
              penColor="#000"
              backgroundColor="#fff"
            />
            <TouchableOpacity style={styles.closeButton} onPress={() => setIsModalVisible(false)}>
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
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
  signatureButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  signatureButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  clearButton: {
    backgroundColor: '#ff4444',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    height: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  signatureCanvas: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  closeButton: {
    marginTop: 16,
    backgroundColor: '#ff4444',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});