declare module 'expo-camera' {
  import { ViewProps } from 'react-native';
  import React from 'react';

  export type CameraType = 'front' | 'back';
  export type FlashMode = 'on' | 'off' | 'auto' | 'torch';

  export interface CameraProps extends ViewProps {
    type: CameraType;
    flashMode: FlashMode;
    ref?: React.RefObject<Camera>;
    onCameraReady?: () => void;
    onMountError?: (error: any) => void;
  }

  export class Camera extends React.Component<CameraProps> {
    takePictureAsync(options?: {
      quality?: number;
      base64?: boolean;
      exif?: boolean;
    }): Promise<{ uri: string; width: number; height: number; base64?: string }>;
  }

  export function requestCameraPermissionsAsync(): Promise<{ status: 'granted' | 'denied' }>;
  export function getCameraPermissionsAsync(): Promise<{ status: 'granted' | 'denied' }>;
}
