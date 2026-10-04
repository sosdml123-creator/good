// src/components/admin/instagram/types.ts
import { AspectRatioType } from './theme';

export type TemplateType =
  | 'cover_new'
  | 'hook_photo'
  | 'review_card'
  | 'top5'
  | 'reels_cover'
  | 'rating_detail'
  | 'photo_dessert'
  | 'versus'
  | 'cta_app';

export interface CoverNewProps {
  title1?: string;
  title2?: string;
  handwriting?: string;
  badge?: string;
}

export interface HookPhotoProps {
  badge?: string;
  hookTitle?: string;
  subText?: string;
  tag?: string;
  pageIndicator?: string;
  bgImage?: string;
}

export interface ReviewCardProps {
  badge?: string;
  brand?: string;
  productName?: string;
  rating?: number;
  reviewCount?: number | string;
  description?: string;
  recommendationTitle?: string;
  recommendations?: string[];
  productImage?: string;
  handwriting?: string;
}

export interface Top5Item {
  rank: number;
  image: string;
  name: string;
  category: string;
}

export interface Top5Props {
  badge?: string;
  title?: string;
  subText?: string;
  items?: Top5Item[];
}

export interface ReelsCoverProps {
  stickerText?: string;
  bgImage?: string;
  stickerTag?: string;
  viewsCount?: string;
}

export interface RatingScoreItem {
  label: string;
  score: number;
}

export interface RatingDetailProps {
  badge?: string;
  brand?: string;
  productName?: string;
  ratings?: RatingScoreItem[];
  quote?: string;
  productImage?: string;
}

export interface PhotoDessertProps {
  handwriting?: string;
  badge?: string;
  title?: string;
  description?: string;
  bgImage?: string;
}

export interface VersusProduct {
  name: string;
  image: string;
}

export interface VersusProps {
  badge?: string;
  question?: string;
  product1?: VersusProduct;
  product2?: VersusProduct;
  buttonText?: string;
}

export interface CtaAppProps {
  handwriting?: string;
  buttonText?: string;
  mockImage?: string;
}

// 각 슬라이드 데이터 유니온
export type SlidePropsMap = {
  cover_new: CoverNewProps;
  hook_photo: HookPhotoProps;
  review_card: ReviewCardProps;
  top5: Top5Props;
  reels_cover: ReelsCoverProps;
  rating_detail: RatingDetailProps;
  photo_dessert: PhotoDessertProps;
  versus: VersusProps;
  cta_app: CtaAppProps;
};

export interface SlideData {
  id: string;
  templateType: TemplateType;
  props: any; // 각 템플릿별 props
}

export interface GeneratedContentPackage {
  id?: string;
  prompt: string;
  aspectRatio: AspectRatioType;
  caption: string;
  hashtags: string[];
  slides: SlideData[];
  created_at?: string;
}
