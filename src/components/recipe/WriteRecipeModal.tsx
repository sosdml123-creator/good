import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Plus, Trash2, ChefHat, Camera, Loader2 } from 'lucide-react';
import { RecipeIngredient } from '../../types';
import { compressAndResizeImage } from '../../utils/imageCompressor';

export const WriteRecipeModal: React.FC = () => {
  const { isWriteRecipeOpen, closeWriteRecipe, addRecipePost, showToast } = useApp();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [prepTime, setPrepTime] = useState('3분');
  const [difficulty, setDifficulty] = useState<'초간단' | '쉬움' | '보통'>('초간단');
  const [totalCost, setTotalCost] = useState(4000);
  const [ingredients, setIngredients] = useState<RecipeIngredient[]>([
    { name: '', store: 'CU', price: 1800, amount: '1개', isKeyItem: true },
    { name: '', store: 'GS25', price: 1500, amount: '1봉' }
  ]);
  const [steps, setSteps] = useState<string[]>([
    '',
    ''
  ]);
  const [tips, setTips] = useState('');
  const [tagInput, setTagInput] = useState('#편의점꿀조합 #신상레시피');

  if (!isWriteRecipeOpen) return null;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('이미지 파일(JPG, PNG 등)만 등록 가능합니다.', 'error');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      showToast('20MB 이하의 사진을 선택해주세요.', 'error');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setIsUploading(true);
    try {
      const compressed = await compressAndResizeImage(file, {
        maxWidth: 1200,
        maxHeight: 1200,
        quality: 0.85,
        mimeType: 'image/jpeg'
      });
      setSelectedImage(compressed);
      showToast('📸 대표 사진이 성공적으로 등록되었습니다.', 'success');
    } catch (err) {
      console.error('Failed to compress/upload image:', err);
      showToast('사진을 처리하는 중 오류가 발생했습니다. 다시 시도해주세요.', 'error');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedImage('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAddIngredient = () => {
    setIngredients(prev => [...prev, { name: '', store: '편의점 전점', price: 1000, amount: '적당량' }]);
  };

  const handleRemoveIngredient = (index: number) => {
    setIngredients(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpdateIngredient = (index: number, field: keyof RecipeIngredient, value: any) => {
    setIngredients(prev => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handleAddStep = () => {
    setSteps(prev => [...prev, '']);
  };

  const handleRemoveStep = (index: number) => {
    setSteps(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpdateStep = (index: number, val: string) => {
    setSteps(prev => {
      const next = [...prev];
      next[index] = val;
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast('레시피 제목을 입력해주세요.', 'error');
      return;
    }
    if (!description.trim()) {
      showToast('레시피 한줄 소개를 입력해주세요.', 'error');
      return;
    }
    if (!selectedImage) {
      showToast('레시피 대표 사진을 앨범에서 선택해주세요.', 'error');
      return;
    }

    const validIngredients = ingredients.filter(ing => ing.name.trim() !== '');
    if (validIngredients.length === 0) {
      showToast('재료를 1개 이상 입력해주세요.', 'error');
      return;
    }

    const validSteps = steps.filter(s => s.trim() !== '');
    if (validSteps.length === 0) {
      showToast('만드는 순서를 1단계 이상 입력해주세요.', 'error');
      return;
    }

    const tags = tagInput
      .split(' ')
      .map(t => t.trim())
      .filter(t => t.length > 0)
      .map(t => (t.startsWith('#') ? t : `#${t}`));

    await addRecipePost({
      title: title.trim(),
      description: description.trim(),
      image: selectedImage,
      prepTime,
      difficulty,
      totalCost: Number(totalCost) || 3000,
      ingredients: validIngredients,
      steps: validSteps,
      tips: tips.trim() || undefined,
      tags: tags.length > 0 ? tags : ['#편의점꿀조합', '#신상픽']
    });

    closeWriteRecipe();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-center items-end sm:items-center animate-in fade-in duration-200">
      <div 
        className="w-full max-w-[430px] bg-white rounded-t-3xl sm:rounded-3xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom-6 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-white sticky top-0 z-20">
          <div className="flex items-center gap-1.5 font-black text-sm text-gray-900">
            <ChefHat className="w-4 h-4 text-gray-900" />
            <span>나만의 꿀조합 레시피 등록</span>          </div>

          <button
            onClick={closeWriteRecipe}
            className="p-1.5 text-gray-500 hover:text-gray-900 rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-4">
          {/* 1. Title */}
          <div>
            <label className="text-xs font-bold text-gray-800 block mb-1">
              레시피 제목 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="예: 불닭 콘치즈마요 황금 레시피"
              className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-gray-900"
            />
          </div>

          {/* 2. One-line Intro */}
          <div>
            <label className="text-xs font-bold text-gray-800 block mb-1">
              한줄 소개 <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="이 꿀조합의 맛과 특징을 한 줄로 자랑해주세요!"
              className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-gray-900 resize-none"
            />
          </div>

          {/* 3. Recipe Image Upload from Album */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-gray-800 flex items-center gap-1">
                대표 완성 사진 <span className="text-red-500">*</span>
              </label>
              <span className="text-[11px] text-gray-500 font-medium">
                내 앨범에서 사진 첨부
              </span>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />

            {selectedImage ? (
              <div className="relative rounded-2xl overflow-hidden aspect-[16/10] bg-gray-100 border border-gray-200 group shadow-xs">
                <img
                  src={selectedImage}
                  alt="레시피 대표 사진"
                  className="w-full h-full object-cover"
                />

                {/* PC 호버 오버레이 */}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="px-3 py-1.5 bg-white/95 hover:bg-white text-gray-900 text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5 active:scale-95 transition-all"
                  >
                    <Camera className="w-3.5 h-3.5 text-gray-700" />
                    사진 변경
                  </button>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="px-3 py-1.5 bg-rose-600/90 hover:bg-rose-600 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5 active:scale-95 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    삭제
                  </button>
                </div>

                {/* 모바일 상시 노출 액션 버튼 */}
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2.5 right-2.5 p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-full shadow-md backdrop-blur-xs transition-colors active:scale-90"
                  aria-label="사진 삭제"
                >
                  <X className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="absolute bottom-2.5 left-2.5 px-2.5 py-1.5 bg-black/60 hover:bg-black/80 text-white rounded-xl text-[11px] font-medium shadow-md backdrop-blur-xs flex items-center gap-1.5 transition-colors active:scale-95"
                >
                  <Camera className="w-3.5 h-3.5" />
                  앨범에서 다시 선택
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className={`w-full rounded-2xl border-2 border-dashed border-gray-200 hover:border-gray-800 bg-gray-50/70 hover:bg-gray-100/70 py-6 px-4 flex flex-col items-center justify-center gap-2 transition-all active:scale-[0.99] group ${
                  isUploading ? 'opacity-70 pointer-events-none' : ''
                }`}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-6 h-6 text-gray-600 animate-spin" />
                    <span className="text-xs font-semibold text-gray-600">
                      사진 최적화 처리 중...
                    </span>
                  </>
                ) : (
                  <>
                    <div className="w-11 h-11 rounded-2xl bg-white shadow-xs border border-gray-200 flex items-center justify-center text-gray-500 group-hover:text-gray-900 group-hover:scale-105 transition-all">
                      <Camera className="w-5 h-5" />
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-bold text-gray-800 group-hover:text-gray-900">
                        내 앨범에서 사진 올리기
                      </p>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        요리 완성 사진이나 꿀조합 이미지를 첨부해주세요
                      </p>
                    </div>
                  </>
                )}
              </button>
            )}
          </div>

          {/* 4. Prep Time, Difficulty, Total Cost */}
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-[11px] font-bold text-gray-700 block mb-1">소요시간</label>
              <select
                value={prepTime}
                onChange={(e) => setPrepTime(e.target.value)}
                className="w-full text-xs p-2 rounded-xl border border-gray-200 bg-white"
              >
                <option value="1분">1분</option>
                <option value="2분">2분</option>
                <option value="3분">3분</option>
                <option value="5분">5분</option>
                <option value="10분">10분</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-gray-700 block mb-1">난이도</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
                className="w-full text-xs p-2 rounded-xl border border-gray-200 bg-white"
              >
                <option value="초간단">초간단</option>
                <option value="쉬움">쉬움</option>
                <option value="보통">보통</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-gray-700 block mb-1">예상비용(원)</label>
              <input
                type="number"
                step="500"
                value={totalCost}
                onChange={(e) => setTotalCost(Number(e.target.value))}
                className="w-full text-xs p-2 rounded-xl border border-gray-200"
              />
            </div>
          </div>

          {/* 5. Ingredients List */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-gray-800">
                필요한 재료 목록 <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={handleAddIngredient}
                className="text-[11px] font-bold text-gray-900 flex items-center gap-0.5 hover:underline"
              >
                <Plus className="w-3.5 h-3.5" /> 재료 추가
              </button>
            </div>

            <div className="space-y-1.5">
              {ingredients.map((ing, idx) => (
                <div key={idx} className="flex gap-1.5 items-center">
                  <input
                    type="text"
                    placeholder="재료명 (예: 불닭볶음면)"
                    value={ing.name}
                    onChange={(e) => handleUpdateIngredient(idx, 'name', e.target.value)}
                    className="flex-1 text-xs p-2 rounded-xl border border-gray-200"
                  />
                  <input
                    type="text"
                    placeholder="구입처 (CU/GS25)"
                    value={ing.store || ''}
                    onChange={(e) => handleUpdateIngredient(idx, 'store', e.target.value)}
                    className="w-24 text-xs p-2 rounded-xl border border-gray-200"
                  />
                  {ingredients.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveIngredient(idx)}
                      className="p-1.5 text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 6. Steps List */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-gray-800">
                만드는 순서 (단계별) <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={handleAddStep}
                className="text-[11px] font-bold text-gray-900 flex items-center gap-0.5 hover:underline"
              >
                <Plus className="w-3.5 h-3.5" /> 단계 추가
              </button>
            </div>

            <div className="space-y-1.5">
              {steps.map((step, idx) => (
                <div key={idx} className="flex gap-1.5 items-center">
                  <span className="w-5 h-5 rounded-full bg-gray-100 text-gray-900 font-bold text-[11px] flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <input
                    type="text"
                    placeholder={`Step ${idx + 1} 조리 순서를 적어주세요`}
                    value={step}
                    onChange={(e) => handleUpdateStep(idx, e.target.value)}
                    className="flex-1 text-xs p-2 rounded-xl border border-gray-200"
                  />
                  {steps.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveStep(idx)}
                      className="p-1.5 text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 7. Secret Tip */}
          <div>
            <label className="text-xs font-bold text-gray-800 block mb-1">
              맛있게 먹는 꿀팁 (선택)
            </label>
            <input
              type="text"
              value={tips}
              onChange={(e) => setTips(e.target.value)}
              placeholder="예: 후추를 두 번 톡톡 털어 넣으면 풍미가 2배!"
              className="w-full text-xs p-2.5 rounded-xl border border-gray-200"
            />
          </div>

          {/* 8. Tags */}
          <div>
            <label className="text-xs font-bold text-gray-800 block mb-1">
              태그 (공백으로 구분)
            </label>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="#불닭꿀조합 #야식 #편의점요리"
              className="w-full text-xs p-2.5 rounded-xl border border-gray-200"
            />
          </div>

          {/* Bottom Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl shadow-xs transition-colors active:scale-98"
            >
              레시피 등록하기 ✨
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
