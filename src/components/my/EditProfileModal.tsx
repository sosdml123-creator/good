import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Check, Camera, Sparkles, Image as ImageIcon, Loader2 } from 'lucide-react';
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'character' | 'food'>('all');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setNicknameInput(currentUser.displayName || '');
      setSelectedPhoto(currentUser.photoURL || DEFAULT_AVATAR);
      setErrorMessage('');
      setIsProcessingImage(false);
      setIsSubmitting(false);
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
      setIsSubmitting(true);
      await updateUserProfile({
        displayName: trimmed,
        photoURL: selectedPhoto,
      });
      onClose();
    } catch (err) {
      console.error('Profile save error:', err);
      setErrorMessage('프로필 저장 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredPresets = AVATAR_PRESETS.filter(p => {
    if (selectedCategory === 'all') return true;
    return p.category === selectedCategory || p.category === 'official';
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md max-h-[90vh] rounded-3xl p-5 shadow-2xl flex flex-col animate-in zoom-in-95 duration-200 border border-gray-100 overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[17px] font-black text-gray-900">프로필 수정</span>
            <span className="text-[11px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
              원하는 프로필로 변경
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto flex-1 py-3 px-1 space-y-5 -mr-1 pr-1 custom-scrollbar">
          
          {/* Main Selected Avatar Preview */}
          <div className="flex flex-col items-center justify-center space-y-3 pt-1">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-amber-400/80 shadow-lg bg-gray-50 flex items-center justify-center relative">
                {isProcessingImage ? (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                  </div>
                ) : null}
                <img
                  src={selectedPhoto || DEFAULT_AVATAR}
                  alt="Profile Preview"
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Camera Trigger Badge */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessingImage}
                className="absolute bottom-0 right-0 p-2 bg-gray-900 text-white rounded-full shadow-lg border-2 border-white hover:bg-black active:scale-90 transition-transform"
                title="내 기기에서 사진 직접 올리기"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>

            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            {/* Upload Button */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessingImage}
                className="px-3.5 py-1.5 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
              >
                <ImageIcon className="w-3.5 h-3.5 text-amber-300" />
                <span>내 사진 업로드</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectPreset(DEFAULT_AVATAR)}
                className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 active:scale-95"
                title="신상픽 공식 로고로 변경"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                <span>공식 로고</span>
              </button>
            </div>
          </div>

          {/* Preset Avatar Selection Grid */}
          <div className="space-y-2.5 bg-gray-50/80 p-3.5 rounded-2xl border border-gray-150">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-gray-800 flex items-center gap-1">
                <span>✨ 신상픽 추천 프로필 아바타</span>
                <span className="text-[11px] text-gray-400 font-normal">({AVATAR_PRESETS.length}종)</span>
              </span>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-1 text-[11px]">
                <button
                  type="button"
                  onClick={() => setSelectedCategory('all')}
                  className={`px-2 py-0.5 rounded-full font-bold transition-colors ${
                    selectedCategory === 'all'
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  전체
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCategory('character')}
                  className={`px-2 py-0.5 rounded-full font-bold transition-colors ${
                    selectedCategory === 'character'
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  캐릭터
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCategory('food')}
                  className={`px-2 py-0.5 rounded-full font-bold transition-colors ${
                    selectedCategory === 'food'
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  스낵·음료
                </button>
              </div>
            </div>

            <p className="text-[11px] text-gray-500">
              마음에 드는 프로필을 터치하면 바로 내 프로필로 적용됩니다!
            </p>

            {/* Grid */}
            <div className="grid grid-cols-4 gap-2.5 pt-1">
              {filteredPresets.map((preset) => {
                const isSelected = selectedPhoto === preset.url;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectPreset(preset.url)}
                    className={`relative flex flex-col items-center p-2 rounded-2xl transition-all duration-150 group ${
                      isSelected
                        ? 'bg-amber-100/70 border-2 border-amber-500 ring-2 ring-amber-400/40 shadow-sm scale-102'
                        : 'bg-white border border-gray-200 hover:border-gray-400 hover:bg-gray-50 active:scale-95'
                    }`}
                  >
                    <div className="w-13 h-13 rounded-full overflow-hidden bg-white shadow-xs border border-gray-100 flex items-center justify-center">
                      <img
                        src={preset.url}
                        alt={preset.name}
                        className="w-full h-full object-cover transition-transform group-hover:scale-108"
                        loading="lazy"
                      />
                    </div>
                    <span className="text-[10px] font-bold text-gray-800 mt-1.5 truncate max-w-full text-center">
                      {preset.name}
                    </span>

                    {/* Selected Badge */}
                    {isSelected && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 text-white rounded-full flex items-center justify-center shadow-md animate-in zoom-in-50">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Nickname Form */}
          <form id="edit-profile-form" onSubmit={handleSave} className="space-y-3">
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
          </form>

        </div>

        {/* Modal Footer Buttons */}
        <div className="pt-3 border-t border-gray-100 flex gap-2 shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            취소
          </button>
          <button
            type="submit"
            form="edit-profile-form"
            disabled={isProcessingImage || isSubmitting}
            className="flex-1 py-2.5 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md active:scale-98 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>저장 중...</span>
              </>
            ) : (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>변경 완료</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
