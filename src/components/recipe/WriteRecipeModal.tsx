import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Plus, Trash2, ChefHat } from 'lucide-react';
import { RecipeIngredient } from '../../types';

const PRESET_IMAGES = [
  { label: '라면·분식', url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=700&auto=format&fit=crop&q=80' },
  { label: '음료·카페', url: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=700&auto=format&fit=crop&q=80' },
  { label: '베이커리·디저트', url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=700&auto=format&fit=crop&q=80' },
  { label: '탕·찌개·식사', url: 'https://images.unsplash.com/photo-1547928576-a4a33237cbc3?w=700&auto=format&fit=crop&q=80' },
  { label: '스낵·안주', url: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=700&auto=format&fit=crop&q=80' },
];

export const WriteRecipeModal: React.FC = () => {
  const { isWriteRecipeOpen, closeWriteRecipe, addRecipePost, showToast } = useApp();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedImage, setSelectedImage] = useState(PRESET_IMAGES[0].url);
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
            <span>나만의 꿀조합 레시피 등록</span>
            <span className="text-[10px] font-bold bg-amber-50 text-amber-600 px-1.5 py-0.2 rounded">
              +50P 적립
            </span>
          </div>

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

          {/* 3. Image Preset Select */}
          <div>
            <label className="text-xs font-bold text-gray-800 block mb-1">
              대표 비주얼 사진 선택
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {PRESET_IMAGES.map((preset) => (
                <button
                  type="button"
                  key={preset.label}
                  onClick={() => setSelectedImage(preset.url)}
                  className={`relative rounded-xl overflow-hidden aspect-square border-2 transition-all ${
                    selectedImage === preset.url ? 'border-gray-900 ring-2 ring-gray-900/20' : 'border-transparent opacity-60'
                  }`}
                >
                  <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                  <span className="absolute bottom-0 inset-x-0 bg-black/60 text-[9px] text-white py-0.5 text-center truncate">
                    {preset.label}
                  </span>
                </button>
              ))}
            </div>
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
              레시피 등록하고 50P 받기 ✨
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
