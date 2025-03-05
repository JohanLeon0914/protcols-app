import { View, TouchableOpacity, Text, StyleSheet, Alert } from "react-native";
import * as Print from "expo-print";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as MediaLibrary from "expo-media-library";
import { translateKey } from "@/constants/TranslateKey";

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { PhotoRecord } from "./photographicRecord";

pdfMake.vfs = pdfFonts.vfs;

interface SectionControlsProps {
  currentSection: number;
  totalSections: number;
  onChangeSection: (newSection: number) => void;
  formData: Record<string, any>;
}

export default function SectionControls({
  currentSection,
  totalSections,
  onChangeSection,
  formData,
}: SectionControlsProps) {
  const canGoForward = currentSection < totalSections - 1;
  const canGoBack = currentSection > 0;

  // Función para formatear valores
  const formatValue = (value: unknown) => {
    if (typeof value === "object" && value !== null) {
      if (Array.isArray(value)) {
        return value
          .map((item, index) => {
            if (typeof item === "object" && item !== null) {
              return Object.entries(item)
                .map(([subKey, subValue]) => {
                  if (
                    (subKey === "signature" || subKey === "base64") &&
                    typeof subValue === "string"
                  ) {
                    return `<strong>${translateKey(
                      subKey
                    )}:</strong> <img class="signature-img" src="${subValue}" />`;
                  }
                  // Formatear fechas
                  if (
                    subKey === "date" ||
                    subKey === "departureTime" ||
                    subKey === "arrivalTime" ||
                    subKey === "startTime" ||
                    subKey === "endTime"
                  ) {
                    return `<strong>${translateKey(
                      subKey
                    )}:</strong> ${formatDate(subValue as any)}`;
                  }
                  // Traducir solo la clave, no el valor
                  return `<strong>${translateKey(
                    subKey
                  )}:</strong> ${subValue}`;
                })
                .join("<br>");
            }
            return `<strong>${index + 1}:</strong> ${item}`; 
          })
          .join("<br>");
      } else {
        return Object.entries(value)
          .map(([subKey, subValue]) => {
            if ((subKey === "signature" && typeof subValue === "string") || (subKey === "base64" && typeof subValue === "string")) {
              return `<strong>${translateKey(
                subKey
              )}:</strong> <img class="signature-img" src="${subValue}" />`;
            }
            // Formatear fechas
            if (
              subKey === "date" ||
              subKey === "departureTime" ||
              subKey === "arrivalTime" ||
              subKey === "startTime" ||
              subKey === "endTime"
            ) {
              return `<strong>${translateKey(
                subKey
              )}:</strong> ${formatDate(subValue as any)}`;
            }
            // Traducir solo la clave, no el valor
            return `<strong>${translateKey(subKey)}:</strong> ${subValue}`;
          })
          .join("<br>");
      }
    }
    // Convertir true/false a Sí/No
    if (value === true) return "Sí";
    if (value === false) return "No";
    return String(value);
  };

  const formatDate = (dateString: string, getJustDate?: boolean) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    if (getJustDate) {
      return `${day}/${month}/${year}`;
    }

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  };

  const generatePDF = async () => {
    try {
      // Solicitar permisos para almacenamiento
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permiso denegado",
          "No se puede guardar el PDF sin permisos de almacenamiento."
        );
        return;
      }

      const htmlContent = `
        <html>
          <head>
            <style>
              h1 { color: #333; border-bottom: 2px solid #444; padding-bottom: 10px; }
              h2 { color: #444; margin-top: 20px; margin-bottom: 10px; }
              .section { margin-bottom: 30px; }
              table { width: 100%; border-collapse: collapse; margin-top: 30px; }
              th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
              th { background-color: #f5f5f5; font-weight: bold; }
              
              body { 
                font-family: Arial, sans-serif; 
                padding: 20px;
                margin-top: 120px; 
              }

            @page {
              margin-top: 70px; 
              margin-bottom: 20px;
              margin-left: 20px;
              margin-right: 20px;
            }

            .header {
              position: absolute;
              top: -20px; 
              left: 0;
              width: 100%;
              height: 100px;
              background-color: white;
              padding: 10px 20px;
              box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
              display: flex;
              align-items: center;
              gap: 20px;
            }

            .signature-img, .photo-record-img {
              max-width: 200px;
              margin: 10px 0;
              display: block;
            }

            .validation {
              margin-top: 350px; 
            }

            .header-logo img {
              width: 400px; 
              height: auto; 
            }

            .header-info {
              flex: 1; 
              margin-left: 160px;
            }

            .header-info h2, .header-info h3, .header-info p {
              margin: 0; 
              line-height: 1.5; 
            }

            .title {
              background-color: #3fa5f2;
              color: white;
              padding: 10px;
            }

            .sub-title {
              background-color: #60b1f0;
              color: white;
              padding: 10px;
            }

            .unite-code {
              color: red;
            }
            </style>
          </head>
          <body>
          <!-- Header -->
             <div class="header">
              <div>
                <img src='https://i.ibb.co/B2g367nm/logo.jpg' alt="logo-empresa" />
              </div>
              <div class="header-info">
                <h3>INFORME TÉCNICO</h3>
              </div>
            </div>

            <h1 class="title">Formulario de Intervención Técnica</h1>
  
            <!-- Sección de Datos Generales -->
            <div class="section">
              <h2 class="sub-title">Datos Generales</h2>
              <table>
                ${Object.entries(formData.generalData || {})
                  .map(
                    ([key, value]) => `
                  <tr>
                    <td><strong>${translateKey(key)}</strong></td>
                    <td>${formatValue(value)}</td>
                  </tr>
                `
                  )
                  .join("")}
              </table>
            </div>
  
            <!-- Sección de Intervención Técnica -->
            <div class="section">
              <h2 class="sub-title">Intervención Técnica</h2>
              <table>
                ${Object.entries(formData.technicalInterventionData || {})
                  .map(
                    ([key, value]) => `
                  <tr>
                    <td><strong>${translateKey(key)}</strong></td>
                    <td>${formatValue(value)}</td>
                  </tr>
                `
                  )
                  .join("")}
              </table>
            </div>
  
            <!-- Sección de Datos del Equipo -->
            <div class="section">
              <h2 class="sub-title">Datos del Equipo</h2>
              <table>
                ${Object.entries(formData.equipmentData || {})
                  .map(
                    ([key, value]) => `
                  <tr>
                    <td><strong>${translateKey(key)}</strong></td>
                    <td>${formatValue(value)}</td>
                  </tr>
                `
                  )
                  .join("")}
              </table>
            </div>
  
            <!-- Sección de Traslado -->
            <div class="section">
              <h2 class="sub-title">Traslado</h2>
              <table>
                ${Object.entries(formData.transferData || {})
                  .map(
                    ([key, value]) => `
                  <tr>
                    <td><strong>${translateKey(key)}</strong></td>
                    <td>${formatValue(value)}</td>
                  </tr>
                `
                  )
                  .join("")}
              </table>
            </div>
  
            <!-- Sección de Ejecución -->
            <div class="section">
              <h2 class="sub-title">Ejecución</h2>
              <table>
                ${Object.entries(formData.executionData || {})
                  .map(
                    ([key, value]) => `
                  <tr>
                    <td><strong>${translateKey(key)}</strong></td>
                    <td>${formatValue(value)}</td>
                  </tr>
                `
                  )
                  .join("")}
              </table>
            </div>
  
            <!-- Sección de Instrumentos de Medición y Ambiente -->
            <div class="section">
              <h2 class="sub-title">Instrumentos de Medición y Ambiente</h2>
              <table>
                ${Object.entries(formData.measurementAndEnvironmentData || {})
                  .map(
                    ([key, value]) => `
                  <tr>
                    <td><strong>${translateKey(key)}</strong></td>
                    <td>${formatValue(value)}</td>
                  </tr>
                `
                  )
                  .join("")}
              </table>
            </div>
  
            <!-- Sección de Aceptación y Conformidad -->
            <div class="section">
              <h2 class="sub-title">Aceptación y Conformidad</h2>
              <table>
                ${Object.entries(formData.acceptanceAndConformityData || {})
                  .map(
                    ([key, value]) => `
                  <tr>
                    <td><strong>${translateKey(key)}</strong></td>
                    <td>${formatValue(value)}</td>
                  </tr>
                `
                  )
                  .join("")}
              </table>
            </div>

            <!-- Sección de Descripcion de actividades -->
            <div class="section">
              <h2 class="sub-title">Descripción de actividades</h2>
              <table>
                ${Object.entries(formData.activitiesDescriptionData || {})
                  .map(
                    ([key, value]) => `
                  <tr>
                    <td><strong>${translateKey(key)}</strong></td>
                    <td>${formatValue(value)}</td>
                  </tr>
                `
                  )
                  .join("")}
              </table>
            </div>

            <!-- Sección de registro fotográfico -->
            <div class="section validation">
              <h2 class="sub-title">Registro fotográfico</h2>
              <table>
                ${Object.entries(formData.photographicRecordData || {})
                  .map(
                    ([key, value]) => `
                  <tr>
                    <td><strong>${translateKey(key)}</strong></td>
                    <td>${formatValue(value)}</td>
                  </tr>
                `
                  )
                  .join("")}
              </table>
            </div>
  
            <!-- Sección de Validación -->
            <div class="section validation">
              <h2 class="sub-title">Validación</h2>
              <table>
                ${Object.entries(formData.validationData || {})
                  .map(
                    ([key, value]) => `
                  <tr>
                    <td><strong>${translateKey(key)}</strong></td>
                    <td>${formatValue(value)}</td>
                  </tr>
                `
                  )
                  .join("")}
              </table>
            </div>
          </body>
          <style>
            
          </style>
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
        mimeType: "application/pdf",
        dialogTitle: "Compartir PDF",
      });

        Alert.alert("PDF Generado ✅", `Archivo guardado como: ${fileName}`);
    } catch (error) {
      console.error("Error al generar el PDF:", error);
      Alert.alert("Error", "No se pudo generar el PDF");
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
        <ControlButton text="Enviar" onPress={generatePDF} />
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
