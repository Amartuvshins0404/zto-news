import { Check, Upload } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { getMedia, uploadMedia } from '../services/api';
import { useTranslation } from '../services/translationService';
import { MediaItem } from '../types';
import { Button, Input, Modal, Spinner } from './UI';

interface MediaLibraryProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string, width?: number) => void;
  requireWidth?: boolean;
}

export const MediaLibrary: React.FC<MediaLibraryProps> = ({ isOpen, onClose, onSelect, requireWidth = false }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [customWidth, setCustomWidth] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'library' | 'upload'>('library');
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (isOpen) {
      loadMedia();
    }
  }, [isOpen]);

  const loadMedia = async () => {
    setLoading(true);
    try {
      const data = await getMedia();
      setMedia(data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleConfirm = () => {
    if (selectedImage) {
      const width = customWidth ? parseInt(customWidth) : undefined;
      onSelect(selectedImage, width);
      onClose();
      setSelectedImage(null);
      setCustomWidth('');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploading(true);
      try {
        const newMedia = await uploadMedia(e.target.files[0]);
        setMedia([newMedia, ...media]);
        setSelectedImage(newMedia.url);
        setActiveTab('library');
      } catch (err) {
        console.error('Upload failed:', err);
        alert('Upload failed');
      }
      setUploading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('editor_select_library')}>
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-4">
        <button
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'library' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('library')}
        >
          {t('admin_media')}
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'upload' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('upload')}
        >
          {t('editor_change_image')}
        </button>
      </div>

      <div className="min-h-[300px]">
        {activeTab === 'library' ? (
          loading ? (
            <div className="flex justify-center items-center h-64">
              <Spinner />
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4 max-h-[400px] overflow-y-auto p-1">
              {media.length > 0 ? (
                media.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedImage(item.url)}
                    className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${selectedImage === item.url ? 'border-primary-600 ring-2 ring-primary-100' : 'border-transparent hover:border-gray-300'}`}
                  >
                    <img src={item.url} alt="Media" className="w-full h-full object-cover" />
                    {selectedImage === item.url && (
                      <div className="absolute inset-0 bg-primary-600/20 flex items-center justify-center">
                        <div className="bg-primary-600 rounded-full p-1">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="col-span-3 text-center py-10 text-gray-500">
                  {t('no_data')}
                </div>
              )}
            </div>
          )
        ) : (
          <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800/50">
            {uploading ? (
              <Spinner />
            ) : (
              <>
                <Upload className="w-12 h-12 text-gray-400 mb-4" />
                <label className="cursor-pointer">
                  <span className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium">
                    Choose File
                  </span>
                  <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                </label>
                <p className="mt-2 text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
              </>
            )}
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-between items-center pt-4 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-2">
          {requireWidth && (
            <Input
              placeholder="Width (px)"
              value={customWidth}
              onChange={(e) => setCustomWidth(e.target.value)}
              className="w-24"
              type="number"
            />
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={onClose}>{t('cancel')}</Button>
          <Button onClick={handleConfirm} disabled={!selectedImage}>
            {t('editor_insert_btn')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
