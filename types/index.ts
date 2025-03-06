export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface Medicine {
  id: string;
  name: string;
  expiryDate: string;
  batchNumber?: string;
  manufacturer?: string;
  dosage?: string;
  imageUri?: string;
  scannedAt: string;
  userId: string;
}

export interface ScanResult {
  medicine: Partial<Medicine>;
  confidence: number;
}

export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  Main: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Scan: undefined;
  History: undefined;
  Profile: undefined;
};

export type HomeStackParamList = {
  HomeScreen: undefined;
  MedicineDetails: { medicineId: string };
};

export type ScanStackParamList = {
  ScanScreen: undefined;
  ScanResult: { result: ScanResult };
};

export type HistoryStackParamList = {
  HistoryScreen: undefined;
  MedicineDetails: { medicineId: string };
};

export type ProfileStackParamList = {
  ProfileScreen: undefined;
  Settings: undefined;
  Help: undefined;
};
