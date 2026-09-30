export type TrainingTier = "core" | "extended";

export interface TrainingSource {
  label: string;
  url: string;
  reviewedOn: string;
  available: boolean;
}

export interface ProtocolStep {
  label: string;
  detail: string;
  condition?: string;
}

export interface VisitProtocol {
  visitType: string;
  summary: string;
  steps: ProtocolStep[];
}

export interface DoctorProtocol {
  id: string;
  doctorName: string;
  source: TrainingSource;
  visits: VisitProtocol[];
  reminders: string[];
}

export interface ClinicProtocolGuide {
  id: string;
  title: string;
  source: TrainingSource;
  summary: string;
  points: string[];
}
