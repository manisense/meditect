// User types
export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  createdAt: string;
}

// Medicine types
export interface Medicine {
  id: string;
  name: string;
  manufacturer: string;
  expiryDate: string;
  batchNumber: string;
  dosage: string;
  description?: string;
  imageUrl?: string;
  userId: string;
  createdAt: string;
  scannedAt: string;
}

// Navigation types
export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
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
  ScanResult: { 
    result: { 
      medicine: {
        name: string;
        expiryDate: string;
        manufacturer: string;
        batchNumber: string;
        dosage: string;
      };
      confidence: number;
    } 
  };
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
