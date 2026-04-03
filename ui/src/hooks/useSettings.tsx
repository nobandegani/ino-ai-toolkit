'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/utils/api';

export interface Settings {
  HF_TOKEN: string;
  TRAINING_FOLDER: string;
  DATASETS_FOLDER: string;
  S3_ENDPOINT_URL: string;
  S3_REGION_NAME: string;
  S3_BUCKET_NAME: string;
  S3_ACCESS_KEY: string;
  S3_ACCESS_SECRET: string;
  S3_ROOT_PATH: string;
}

export default function useSettings() {
  const [settings, setSettings] = useState({
    HF_TOKEN: '',
    TRAINING_FOLDER: '',
    DATASETS_FOLDER: '',
    S3_ENDPOINT_URL: '',
    S3_REGION_NAME: '',
    S3_BUCKET_NAME: '',
    S3_ACCESS_KEY: '',
    S3_ACCESS_SECRET: '',
    S3_ROOT_PATH: '',
  });
  const [isSettingsLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    apiClient
      .get('/api/settings')
      .then(res => res.data)
      .then(data => {
        console.log('Settings:', data);
        setSettings({
          HF_TOKEN: data.HF_TOKEN || '',
          TRAINING_FOLDER: data.TRAINING_FOLDER || '',
          DATASETS_FOLDER: data.DATASETS_FOLDER || '',
          S3_ENDPOINT_URL: data.S3_ENDPOINT_URL || '',
          S3_REGION_NAME: data.S3_REGION_NAME || '',
          S3_BUCKET_NAME: data.S3_BUCKET_NAME || '',
          S3_ACCESS_KEY: data.S3_ACCESS_KEY || '',
          S3_ACCESS_SECRET: data.S3_ACCESS_SECRET || '',
          S3_ROOT_PATH: data.S3_ROOT_PATH || '',
        });
        setIsLoaded(true);
      })
      .catch(error => console.error('Error fetching settings:', error));
  }, []);

  return { settings, setSettings, isSettingsLoaded };
}
