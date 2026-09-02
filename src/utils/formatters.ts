export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('ko-KR').format(price) + '원';
};

export const formatCount = (count: number): string => {
  if (count >= 10000) {
    return (count / 10000).toFixed(1).replace(/\.0$/, '') + '만';
  }
  if (count >= 1000) {
    return (count / 1000).toFixed(1).replace(/\.0$/, '') + '천';
  }
  return count.toString();
};

export const formatRating = (rating: number): string => {
  return rating.toFixed(1);
};

export const getStoreBadgeStyle = (store: string) => {
  switch (store) {
    case 'CU':
      return { bg: 'bg-[#6C2DB9]/10 text-[#6C2DB9] border-[#6C2DB9]/30', dot: 'bg-[#6C2DB9]' };
    case 'GS25':
      return { bg: 'bg-[#007AFF]/10 text-[#007AFF] border-[#007AFF]/30', dot: 'bg-[#007AFF]' };
    case '세븐일레븐':
      return { bg: 'bg-[#008542]/10 text-[#008542] border-[#008542]/30', dot: 'bg-[#008542]' };
    case '이마트24':
      return { bg: 'bg-[#FF9500]/10 text-[#FF9500] border-[#FF9500]/30', dot: 'bg-[#FF9500]' };
    default:
      return { bg: 'bg-gray-100 text-gray-700 border-gray-200', dot: 'bg-gray-400' };
  }
};
