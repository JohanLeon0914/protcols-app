import { View, Text, TextInput, StyleSheet } from "react-native";

interface ActivitiesAndDescriptionData {
  data: {
    comments?: string;
  };
  onUpdate: (data: Partial<ActivitiesAndDescriptionData["data"]>) => void;
}

export default function ActivtiesDescription({
  data,
  onUpdate,
}: ActivitiesAndDescriptionData) {
  const handleTextChange = (
    field: keyof ActivitiesAndDescriptionData["data"],
    value: string
  ) => {
    onUpdate({ [field]: value });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header} >
        <Text style={styles.title}>Descripción de actividades</Text>
      </View>

      {/* Comentarios */}
      <FormField
        label="Comentarios"
        value={data.comments}
        onChangeText={(t: string) => handleTextChange("comments", t)}
        multiline
      />
    </View>
  );
}

interface FormFieldProps {
  label: string;
  value?: string;
  onChangeText: (text: string) => void;
  multiline?: boolean;
}

function FormField({
  label,
  value,
  onChangeText,
  multiline = false,
}: FormFieldProps) {
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

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    padding: 10,
    backgroundColor: "#3fa5f2",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 7,
  },
  title: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  checkboxChecked: {
    backgroundColor: "#007bff",
    borderColor: "#007bff",
  },
  checkboxIcon: {
    color: "#fff",
    fontSize: 14,
  },
  checkboxLabel: {
    fontSize: 16,
    color: "#333",
  },
  fieldContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  multilineInput: {
    height: 600,
    textAlignVertical: "top",
  },
});
