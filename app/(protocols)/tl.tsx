import AcceptanceAndConformity from "@/components/protocols/tl/AcceptanceAndConformity";
import EquipmentData from "@/components/protocols/tl/EquipmentData";
import ExecutionData from "@/components/protocols/tl/ExecutionData";
import GeneralData from "@/components/protocols/tl/GeneralData";
import MeasurementAndEnvironment from "@/components/protocols/tl/MeasurementAndEnvironment";
import SectionControls from "@/components/protocols/tl/SectionControls";
import TransferData from "@/components/protocols/tl/TransferData";
import Validation from "@/components/protocols/tl/Validation";
import TechnicalIntervention from "@/components/TechnicalIntervention";
import { useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet } from "react-native";

type GeneralData = {
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
type TechnicalInterventionData = {
  arrangementAndStartup?: boolean;
  maintenance?: "preventivo" | "correctivo" | null;
  onSiteInspection?: boolean;
  onSiteAssistance?: boolean;
  installation?: boolean;
  batteryAutonomyTest?: boolean;
  batteryCapacityTest?: boolean;
  phoneAssistance?: boolean;
  other?: string;
};
type EquipmentData = {
  type?: string;
  model?: string;
  serial?: string;
  input?: {
    type?: "AC" | "DC";
    phases?: string;
    current?: string;
  };
  output?: {
    type?: "AC" | "DC";
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

type TransferData = {
  departure?: Array<{ date?: Date; departureTime?: Date; arrivalTime?: Date }>;
  return?: Array<{ date?: Date; departureTime?: Date; arrivalTime?: Date }>;
};

type ExecutionData = {
  data: Array<{
    dayOfWeek?: string;
    date?: Date;
    startTime?: Date;
    endTime?: Date;
    numberOfTechnicians?: string;
    technicalLeader?: string;
  }>;
};

type MeasurementAndEnvironmentData = {
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

type AcceptanceAndConformityData = {
  technicalInterventionConform?: boolean;
  comments?: string;
};

type ValidationData = {
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

export default function TLScreen() {
  const [currentSection, setCurrentSection] = useState<number>(0);
  const [generalData, setGeneralData] = useState<GeneralData>({});
  const [technicalInterventionData, setTechnicalInterventionData] =
    useState<TechnicalInterventionData>({});
  const [equipmentData, setEquipmentData] = useState<EquipmentData>({});
  const [transferData, setTransferData] = useState<TransferData>({});
  const [executionData, setExecutionData] = useState<ExecutionData["data"]>([]);
  const [measurementAndEnvironmentData, setMeasurementAndEnvironmentData] =
    useState<MeasurementAndEnvironmentData>({});
  const [acceptanceAndConformityData, setAcceptanceAndConformityData] =
    useState<AcceptanceAndConformityData>({});
  const [validationData, setValidationData] = useState<ValidationData>({});

  const sections = [
    <GeneralData
      key="general-data"
      data={generalData}
      onUpdate={(data: Partial<GeneralData>) =>
        setGeneralData((prev) => ({ ...prev, ...data }))
      }
    />,
    <TechnicalIntervention
      key="TechnicalIntervention-data"
      data={technicalInterventionData}
      onUpdate={(data: Partial<TechnicalInterventionData>) =>
        setTechnicalInterventionData((prev) => ({ ...prev, ...data }))
      }
    />,
    <EquipmentData
      key="equipment-data"
      data={equipmentData}
      onUpdate={(data: Partial<EquipmentData>) =>
        setEquipmentData((prev) => ({ ...prev, ...data }))
      }
    />,
    <TransferData
      key="transfer-data"
      data={transferData}
      onUpdate={(data: Partial<TransferData>) =>
        setTransferData((prev) => ({ ...prev, ...data }))
      }
    />,
    <ExecutionData
      key="execution-data"
      data={executionData}
      onUpdate={(newData) => setExecutionData(newData)}
    />,
    <MeasurementAndEnvironment
      key="measurement-and-environment-data"
      data={measurementAndEnvironmentData}
      onUpdate={(data: Partial<MeasurementAndEnvironmentData>) =>
        setMeasurementAndEnvironmentData((prev) => ({ ...prev, ...data }))
      }
    />,
    <AcceptanceAndConformity
      key="acceptance-and-conformity-data"
      data={acceptanceAndConformityData}
      onUpdate={(data: Partial<AcceptanceAndConformityData>) =>
        setAcceptanceAndConformityData((prev) => ({ ...prev, ...data }))
      }
    />,
    <Validation
      key="validation-data"
      data={validationData}
      onUpdate={(data: Partial<ValidationData>) =>
        setValidationData((prev) => ({ ...prev, ...data }))
      }
    />,
  ];

  // Función para combinar todos los datos del formulario
  const getAllFormData = () => {
    return {
      generalData,
      technicalInterventionData,
      equipmentData,
      transferData,
      executionData,
      measurementAndEnvironmentData,
      acceptanceAndConformityData,
      validationData,
    };
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        
        contentContainerStyle={{ flexGrow: 1 }}
      >
        {sections[currentSection]}
        <SectionControls
          currentSection={currentSection}
          totalSections={sections.length}
          onChangeSection={setCurrentSection}
          formData={getAllFormData()}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
});
