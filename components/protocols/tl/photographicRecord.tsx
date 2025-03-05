import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export interface PhotoRecord {
  name? : string;
  base64?: string;
}

interface PhotographicRecordProps {
  data: PhotoRecord[];
  onUpdate: (data: PhotoRecord[]) => void;
}

export default function PhotographicRecord({ data, onUpdate }: PhotographicRecordProps) {
  const handleAddPhoto = () => {
    onUpdate([...data, { name: '' }]);
  };

  const handleNameChange = (index: number, text: string) => {
    const newData = [...data];
    newData[index].name = text;
    onUpdate(newData);
  };

  const handleImagePick = async (index: number, useCamera: boolean) => {
    const options: ImagePicker.ImagePickerOptions = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 0.8,
      base64: true,
    };
  
    try {
      let result: ImagePicker.ImagePickerResult;
  
      if (useCamera) {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permiso requerido", "Necesitamos acceso a la cámara");
          return;
        }
        result = await ImagePicker.launchCameraAsync(options);
      } else {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permiso requerido", "Necesitamos acceso a la galería");
          return;
        }
        result = await ImagePicker.launchImageLibraryAsync(options);
      }
  
      if (result.canceled) return;
  
      if (result.assets && result.assets.length > 0) {
        const image = result.assets[0];
        if (image.base64) {
          const newData = [...data];
          newData[index] = {
            ...newData[index],
            base64: `data:image/jpeg;base64,${image.base64}`,
          };
          onUpdate(newData);
        }
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo acceder a la cámara o galería");
      console.error("Error detallado:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registro Fotográfico</Text>

      {data.map((photo, index) => (
        <View key={index} style={styles.photoContainer}>
          <TextInput
            style={styles.input}
            placeholder="Nombre de la foto"
            value={photo.name}
            onChangeText={(text) => handleNameChange(index, text)}
          />
          
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={[styles.button, styles.spaceRight]}
              onPress={() => handleImagePick(index, true)}
            >
              <Text style={styles.buttonText}>Tomar Foto</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={() => handleImagePick(index, false)}
            >
              <Text style={styles.buttonText}>Seleccionar</Text>
            </TouchableOpacity>
          </View>

          {photo.base64 && (
            <Image
              source={{ uri: photo.base64 }}
              style={styles.previewImage}
            />
          )}
        </View>
      ))}

      <TouchableOpacity style={styles.addButton} onPress={handleAddPhoto}>
        <Text style={styles.addButtonText}>+ Agregar Foto</Text>
      </TouchableOpacity>
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
  photoContainer: {
    marginBottom: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  buttonGroup: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  button: {
    flex: 1,
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  spaceRight: {
    marginRight: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    resizeMode: 'contain',
  },
  addButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});