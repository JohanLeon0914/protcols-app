import { View, TouchableOpacity, Text, StyleSheet, Alert, Linking } from "react-native";
import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import { translateKey } from "@/constants/TranslateKey";

interface SectionControlsProps {
  currentSection: number;
  totalSections: number;
  onChangeSection: (newSection: number) => void;
  formData: Record<string, unknown>;
}

export default function SectionControls({ 
  currentSection, 
  totalSections, 
  onChangeSection,
  formData 
}: SectionControlsProps) {
  const canGoForward = currentSection < totalSections - 1;
  const canGoBack = currentSection > 0;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses comienzan en 0
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
  
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  };

  const generatePDF = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'No se puede guardar el PDF sin permisos de almacenamiento.');
        return;
      }
  
      // Función para formatear valores
      const formatValue = (value: unknown) => {
        if (typeof value === 'object' && value !== null) {
          if (Array.isArray(value)) {
            return value.map((item, index) => {
              if (typeof item === 'object' && item !== null) {
                return Object.entries(item)
                  .map(([subKey, subValue]) => {
                    if (subKey === 'signature' && typeof subValue === 'string') {
                      return `<strong>${translateKey(subKey)}:</strong> <img class="signature-img" src="${subValue}" />`;
                    }
                    // Formatear fechas
                    if (subKey === 'date' || subKey === 'departureTime' || subKey === 'arrivalTime' || subKey === 'startTime' || subKey === 'endTime') {
                      return `<strong>${translateKey(subKey)}:</strong> ${formatDate(subValue as any)}`;
                    }
                    // Traducir solo la clave, no el valor
                    return `<strong>${translateKey(subKey)}:</strong> ${subValue}`;
                  })
                  .join('<br>');
              }
              return `<strong>${index}:</strong> ${item}`;
            }).join('<br>');
          } else {
            return Object.entries(value)
              .map(([subKey, subValue]) => {
                if (subKey === 'signature' && typeof subValue === 'string') {
                  return `<strong>${translateKey(subKey)}:</strong> <img class="signature-img" src="${subValue}" />`;
                }
                // Formatear fechas
                if (subKey === 'date' || subKey === 'departureTime' || subKey === 'arrivalTime' || subKey === 'startTime' || subKey === 'endTime') {
                  return `<strong>${translateKey(subKey)}:</strong> ${formatDate(subValue as any)}`;
                }
                // Traducir solo la clave, no el valor
                return `<strong>${translateKey(subKey)}:</strong> ${subValue}`;
              })
              .join('<br>');
          }
        }
        // Convertir true/false a Sí/No
        if (value === true) return "Sí";
        if (value === false) return "No";
        return String(value);
      };
  
      // Crear el contenido HTML del PDF
      const htmlContent = `
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              h1 { color: #333; border-bottom: 2px solid #444; padding-bottom: 10px; }
              h2 { color: #444; margin-top: 20px; margin-bottom: 10px; }
              .section { margin-bottom: 30px; }
              table { width: 100%; border-collapse: collapse; margin-top: 10px; }
              th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
              th { background-color: #f5f5f5; font-weight: bold; }
              .signature-img { max-width: 200px; margin: 10px 0; }
            </style>
          </head>
          <body>
            <h1>Formulario de Intervención Técnica</h1>
  
            <!-- Sección de Datos Generales -->
            <div class="section">
              <h2>Datos Generales</h2>
              <table>
                ${Object.entries(formData.generalData || {}).map(([key, value]) => `
                  <tr>
                    <td><strong>${translateKey(key)}</strong></td>
                    <td>${formatValue(value)}</td>
                  </tr>
                `).join('')}
              </table>
            </div>
  
            <!-- Sección de Intervención Técnica -->
            <div class="section">
              <h2>Intervención Técnica</h2>
              <table>
                ${Object.entries(formData.technicalInterventionData || {}).map(([key, value]) => `
                  <tr>
                    <td><strong>${translateKey(key)}</strong></td>
                    <td>${formatValue(value)}</td>
                  </tr>
                `).join('')}
              </table>
            </div>
  
            <!-- Sección de Datos del Equipo -->
            <div class="section">
              <h2>Datos del Equipo</h2>
              <table>
                ${Object.entries(formData.equipmentData || {}).map(([key, value]) => `
                  <tr>
                    <td><strong>${translateKey(key)}</strong></td>
                    <td>${formatValue(value)}</td>
                  </tr>
                `).join('')}
              </table>
            </div>
  
            <!-- Sección de Traslado -->
            <div class="section">
              <h2>Traslado</h2>
              <table>
                ${Object.entries(formData.transferData || {}).map(([key, value]) => `
                  <tr>
                    <td><strong>${translateKey(key)}</strong></td>
                    <td>${formatValue(value)}</td>
                  </tr>
                `).join('')}
              </table>
            </div>
  
            <!-- Sección de Ejecución -->
            <div class="section">
              <h2>Ejecución</h2>
              <table>
                ${Object.entries(formData.executionData || {}).map(([key, value]) => `
                  <tr>
                    <td><strong>${translateKey(key)}</strong></td>
                    <td>${formatValue(value)}</td>
                  </tr>
                `).join('')}
              </table>
            </div>
  
            <!-- Sección de Instrumentos de Medición y Ambiente -->
            <div class="section">
              <h2>Instrumentos de Medición y Ambiente</h2>
              <table>
                ${Object.entries(formData.measurementAndEnvironmentData || {}).map(([key, value]) => `
                  <tr>
                    <td><strong>${translateKey(key)}</strong></td>
                    <td>${formatValue(value)}</td>
                  </tr>
                `).join('')}
              </table>
            </div>
  
            <!-- Sección de Aceptación y Conformidad -->
            <div class="section">
              <h2>Aceptación y Conformidad</h2>
              <table>
                ${Object.entries(formData.acceptanceAndConformityData || {}).map(([key, value]) => `
                  <tr>
                    <td><strong>${translateKey(key)}</strong></td>
                    <td>${formatValue(value)}</td>
                  </tr>
                `).join('')}
              </table>
            </div>
  
            <!-- Sección de Validación -->
            <div class="section">
              <h2>Validación</h2>
              <table>
                ${Object.entries(formData.validationData || {}).map(([key, value]) => `
                  <tr>
                    <td><strong>${translateKey(key)}</strong></td>
                    <td>${formatValue(value)}</td>
                  </tr>
                `).join('')}
              </table>
            </div>
          </body>
        </html>
      `;
  
      // Generar el PDF
      const { uri } = await Print.printToFileAsync({
        html: htmlContent,
        base64: false,
      });
  
      // Crear una carpeta específica para los PDFs
      const pdfFolder = `${FileSystem.documentDirectory}PDFs/`;
      await FileSystem.makeDirectoryAsync(pdfFolder, { intermediates: true });
  
      // Mover el PDF a la carpeta PDFs con un nombre más legible
      const fileName = `Formulario_Intervencion_Tecnica.pdf`;
      const newPath = `${pdfFolder}${fileName}`;
      await FileSystem.moveAsync({
        from: uri,
        to: newPath,
      });
  
      // Compartir el archivo usando Sharing.shareAsync
      await Sharing.shareAsync(newPath, {
        mimeType: 'application/pdf',
        dialogTitle: 'Compartir PDF',
      });
  
      // Mostrar alerta con la ruta simplificada
      Alert.alert(
        'PDF Generado ✅',
        `Archivo guardado como: ${fileName}`,
        [{ text: 'OK' }]
      );
  
    } catch (error) {
      console.error('Error al generar el PDF:', error);
      Alert.alert('Error', 'No se pudo generar el PDF');
    }
  };

  return (
    <View style={styles.container}>
      {canGoBack && (
        <ControlButton
          text="Anterior"
          onPress={() => onChangeSection(currentSection - 1)}
        />
      )}
      
      <View style={styles.spacer} />
      
      {canGoForward ? (
        <ControlButton
          text="Siguiente"
          onPress={() => onChangeSection(currentSection + 1)}
        />
      ) : (
        <ControlButton
          text="Enviar"
          onPress={generatePDF}
        />
      )}
    </View>
  );
}

// Componente ControlButton (sin cambios)
interface ControlButtonProps {
  text: string;
  onPress: () => void;
}

function ControlButton({ text, onPress }: ControlButtonProps) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{text}</Text>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
  },
  spacer: {
    flex: 1,
  },
  button: {
    backgroundColor: "#007bff",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
