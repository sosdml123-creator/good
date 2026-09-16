import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Check, Camera, Zap, Sparkles } from 'lucide-react';
import { DEFAULT_AVATAR, AVATAR_PRESETS, compressImageFile } from '../../utils/avatars';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, updateUserProfile } = useApp();
  
  const [nicknameInput, setNicknameInput] = useState(currentUser.displayName || '');
  const [selectedPhoto, setSelectedPhoto] = useState<string>(currentUser.photoURL || DEFAULT_AVATAR);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setNicknameInput(currentUser.displayName || '');
      setSelectedPhoto(currentUser.photoURL || DEFAULT_AVATAR);
      setErrorMessage('');
      setIsProcessingImage(false);
    }
  }, [isOpen, currentUser]);

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('이미지 파일만 선택할 수 있습니다.');
      return;
    }

    try {
      setIsProcessingImage(true);
      setErrorMessage('');
      const compressedDataUrl = await compressImageFile(file, 360, 0.85);
      setSelectedPhoto(compressedDataUrl);
    } catch (err) {
      console.error('Image compression error:', err);
      setErrorMessage('이미지를 불러오는데 실패했습니다.');
    } finally {
      setIsProcessingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleResetToDefault = () => {
    setSelectedPhoto(DEFAULT_AVATAR);
    setErrorMessage('');
  };

  const handleSelectPreset = (url: string) => {
    setSelectedPhoto(url);
    setErrorMessage('');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = nicknameInput.trim();
    if (!trimmed) {
      setErrorMessage('닉네임을 입력해 주세요.');
      return;
    }
    if (trimmed.length < 2) {
      setErrorMessage('닉네임은 최소 2글자 이상이어야 합니다.');
      return;
    }
    if (trimmed.length > 15) {
      setErrorMessage('닉네임은 최대 15글자까지 가능합니다.');
      return;
    }

    try {
      await updateUserProfile({
        displayName: trimmed,
        photoURL: selectedPhoto,
      });
      onClose();
    } catch (err) {
      console.error('Profile save error:', err);
      setErrorMessage('프로필 저장 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-sm rounded-3xl p-5 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150 border border-gray-100">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-1 border-b border-gray-100">
          <div className="flex items-center gap-1.5">
            <span className="text-base font-black text-gray-900">프로필 수정</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="닫기"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Profile Avatar Section */}
        <div className="flex flex-col items-center space-y-3 pt-1">
          <div className="relative group">
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-200 shadow-md bg-slate-900 flex items-center justify-center">
              <img
                src={selectedPhoto || DEFAULT_AVATAR}
                alt="Profile Preview"
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Camera Overlay Trigger */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 p-1.5 bg-gray-900 text-white rounded-full shadow-lg border-2 border-white hover:bg-black active:scale-95 transition-all"
              title="사진 변경"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Quick Photo Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessingImage}
              className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 active:scale-95"
            >
              <Camera className="w-3.5 h-3.5 text-gray-600" />
              <span>사진 변경</span>
            </button>

            <button
              type="button"
              onClick={handleResetToDefault}
              className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 active:scale-95"
              title="번개 N 기본 프로필로 초기화"
            >
              <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
              <span>기본 프로필</span>
            </button>
          </div>

          {/* Preset Avatar Selection */}
          <div className="w-full bg-gray-50/80 rounded-2xl p-2.5 border border-gray-100 space-y-1.5">
            <div className="flex items-center justify-between px-1">
              <span className="text-[11px] font-bold text-gray-500 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                번개 N 캐릭터 테마
              </span>
            </div>
            <div className="flex items-center justify-center gap-2.5 pt-1">
              {AVATAR_PRESETS.map((preset) => {
                const isSelected = selectedPhoto === preset.url;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectPreset(preset.url)}
                    className={`relative rounded-full p-0.5 transition-all ${
                      isSelected
                        ? 'ring-2 ring-gray-900 scale-110 shadow-sm'
                        : 'opacity-70 hover:opacity-100 hover:scale-105'
                    }`}
                    title={preset.name}
                  >
                    <img
                      src={preset.url}
                      alt={preset.name}
                      className="w-8 h-8 rounded-full bg-slate-900 border border-white/20 object-cover"
                    />
                    {isSelected && (
                      <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-gray-900 rounded-full flex items-center justify-center border border-white text-white">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Nickname Form */}
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 flex items-center justify-between">
              <span>닉네임</span>
              <span className="text-[11px] text-gray-400 font-normal">
                {nicknameInput.length}/15자
              </span>
            </label>
            <input
              type="text"
              value={nicknameInput}
              onChange={(e) => {
                setNicknameInput(e.target.value);
                setErrorMessage('');
              }}
              maxLength={15}
              placeholder="새로운 닉네임을 입력하세요"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 outline-none focus:border-gray-900 focus:bg-white transition-colors"
            />
            {errorMessage && (
              <p className="text-[11px] text-rose-500 font-medium px-1">
                {errorMessage}
              </p>
            )}
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isProcessingImage}
              className="flex-1 py-2.5 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-bold transition-colors flex items-center justify-center gap-1 shadow-sm active:scale-98"
            >
              <Check className="w-3.5 h-3.5" />
              <span>변경 완료</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
