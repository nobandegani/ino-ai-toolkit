'use client';

import { useEffect, useState } from 'react';
import useSettings from '@/hooks/useSettings';
import { TopBar, MainContent } from '@/components/layout';
import { apiClient } from '@/utils/api';

export default function Settings() {
  const { settings, setSettings } = useSettings();
  const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('saving');

    apiClient
      .post('/api/settings', settings)
      .then(() => {
        setStatus('success');
      })
      .catch(error => {
        console.error('Error saving settings:', error);
        setStatus('error');
      })
      .finally(() => {
        setTimeout(() => setStatus('idle'), 2000);
      });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <TopBar>
        <div>
          <h1 className="text-lg">Settings</h1>
        </div>
        <div className="flex-1"></div>
      </TopBar>
      <MainContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <div className="space-y-4">
                <div>
                  <label htmlFor="HF_TOKEN" className="block text-sm font-medium mb-2">
                    Hugging Face Token
                    <div className="text-gray-500 text-sm ml-1">
                      Create a Read token on{' '}
                      <a href="https://huggingface.co/settings/tokens" target="_blank" rel="noreferrer">
                        {' '}
                        Huggingface
                      </a>{' '}
                      if you need to access gated/private models.
                    </div>
                  </label>
                  <input
                    type="password"
                    id="HF_TOKEN"
                    name="HF_TOKEN"
                    value={settings.HF_TOKEN}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-gray-600 focus:border-transparent"
                    placeholder="Enter your Hugging Face token"
                  />
                </div>

                <div>
                  <label htmlFor="TRAINING_FOLDER" className="block text-sm font-medium mb-2">
                    Training Folder Path
                    <div className="text-gray-500 text-sm ml-1">
                      We will store your training information here. Must be an absolute path. If blank, it will default
                      to the output folder in the project root.
                    </div>
                  </label>
                  <input
                    type="text"
                    id="TRAINING_FOLDER"
                    name="TRAINING_FOLDER"
                    value={settings.TRAINING_FOLDER}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-gray-600 focus:border-transparent"
                    placeholder="Enter training folder path"
                  />
                </div>

                <div>
                  <label htmlFor="DATASETS_FOLDER" className="block text-sm font-medium mb-2">
                    Dataset Folder Path
                    <div className="text-gray-500 text-sm ml-1">
                      Where we store and find your datasets.{' '}
                      <span className="text-orange-800">
                        Warning: This software may modify datasets so it is recommended you keep a backup somewhere else
                        or have a dedicated folder for this software.
                      </span>
                    </div>
                  </label>
                  <input
                    type="text"
                    id="DATASETS_FOLDER"
                    name="DATASETS_FOLDER"
                    value={settings.DATASETS_FOLDER}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-gray-600 focus:border-transparent"
                    placeholder="Enter datasets folder path"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <h2 className="text-md font-medium mb-4">S3 Compatible Configs</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="S3_ENDPOINT_URL" className="block text-sm font-medium mb-2">
                    S3 Endpoint URL
                    <div className="text-gray-500 text-sm ml-1">
                      The endpoint URL for your S3-compatible storage provider (e.g. https://s3.amazonaws.com).
                    </div>
                  </label>
                  <input
                    type="text"
                    id="S3_ENDPOINT_URL"
                    name="S3_ENDPOINT_URL"
                    value={settings.S3_ENDPOINT_URL}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-gray-600 focus:border-transparent"
                    placeholder="Enter S3 endpoint URL"
                  />
                </div>

                <div>
                  <label htmlFor="S3_REGION_NAME" className="block text-sm font-medium mb-2">
                    S3 Region Name
                    <div className="text-gray-500 text-sm ml-1">
                      The region for your S3 bucket (e.g. us-east-1).
                    </div>
                  </label>
                  <input
                    type="text"
                    id="S3_REGION_NAME"
                    name="S3_REGION_NAME"
                    value={settings.S3_REGION_NAME}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-gray-600 focus:border-transparent"
                    placeholder="Enter S3 region name"
                  />
                </div>

                <div>
                  <label htmlFor="S3_BUCKET_NAME" className="block text-sm font-medium mb-2">
                    S3 Bucket Name
                    <div className="text-gray-500 text-sm ml-1">
                      The name of your S3 bucket.
                    </div>
                  </label>
                  <input
                    type="text"
                    id="S3_BUCKET_NAME"
                    name="S3_BUCKET_NAME"
                    value={settings.S3_BUCKET_NAME}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-gray-600 focus:border-transparent"
                    placeholder="Enter S3 bucket name"
                  />
                </div>

                <div>
                  <label htmlFor="S3_ACCESS_KEY" className="block text-sm font-medium mb-2">
                    S3 Access Key
                    <div className="text-gray-500 text-sm ml-1">
                      Your S3 access key ID.
                    </div>
                  </label>
                  <input
                    type="password"
                    id="S3_ACCESS_KEY"
                    name="S3_ACCESS_KEY"
                    value={settings.S3_ACCESS_KEY}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-gray-600 focus:border-transparent"
                    placeholder="Enter S3 access key"
                  />
                </div>

                <div>
                  <label htmlFor="S3_ACCESS_SECRET" className="block text-sm font-medium mb-2">
                    S3 Access Secret
                    <div className="text-gray-500 text-sm ml-1">
                      Your S3 secret access key.
                    </div>
                  </label>
                  <input
                    type="password"
                    id="S3_ACCESS_SECRET"
                    name="S3_ACCESS_SECRET"
                    value={settings.S3_ACCESS_SECRET}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-gray-600 focus:border-transparent"
                    placeholder="Enter S3 access secret"
                  />
                </div>

                <div>
                  <label htmlFor="S3_ROOT_PATH" className="block text-sm font-medium mb-2">
                    S3 Root Path
                    <div className="text-gray-500 text-sm ml-1">
                      The root path prefix inside your bucket (e.g. my-project/training).
                    </div>
                  </label>
                  <input
                    type="text"
                    id="S3_ROOT_PATH"
                    name="S3_ROOT_PATH"
                    value={settings.S3_ROOT_PATH}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-gray-600 focus:border-transparent"
                    placeholder="Enter S3 root path"
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={status === 'saving'}
            className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === 'saving' ? 'Saving...' : 'Save Settings'}
          </button>

          {status === 'success' && <p className="text-green-500 text-center">Settings saved successfully!</p>}
          {status === 'error' && <p className="text-red-500 text-center">Error saving settings. Please try again.</p>}
        </form>
      </MainContent>
    </>
  );
}
