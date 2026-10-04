// src/components/admin/instagram/templates/TemplateRenderer.tsx
import { forwardRef } from 'react';
import { SlideData } from '../types';
import { AspectRatioType, INSTA_THEME } from '../theme';
import { CoverNewTemplate } from './CoverNewTemplate';
import { HookPhotoTemplate } from './HookPhotoTemplate';
import { ReviewCardTemplate } from './ReviewCardTemplate';
import { Top5Template } from './Top5Template';
import { ReelsCoverTemplate } from './ReelsCoverTemplate';
import { RatingDetailTemplate } from './RatingDetailTemplate';
import { PhotoDessertTemplate } from './PhotoDessertTemplate';
import { VersusTemplate } from './VersusTemplate';
import { CtaAppTemplate } from './CtaAppTemplate';

interface TemplateRendererProps {
  slide: SlideData;
  aspectRatio?: AspectRatioType;
  className?: string;
}

export const TemplateRenderer = forwardRef<HTMLDivElement, TemplateRendererProps>(
  ({ slide, aspectRatio = '1:1', className = '' }, ref) => {
    const { templateType, props } = slide;

    // 종횡비 스타일 매핑
    const ratioAspectClass =
      aspectRatio === '4:5'
        ? 'aspect-[4/5]'
        : aspectRatio === '9:16'
        ? 'aspect-[9/16]'
        : 'aspect-square';

    const renderContent = () => {
      switch (templateType) {
        case 'cover_new':
          return <CoverNewTemplate {...props} />;
        case 'hook_photo':
          return <HookPhotoTemplate {...props} />;
        case 'review_card':
          return <ReviewCardTemplate {...props} />;
        case 'top5':
          return <Top5Template {...props} />;
        case 'reels_cover':
          return <ReelsCoverTemplate {...props} />;
        case 'rating_detail':
          return <RatingDetailTemplate {...props} />;
        case 'photo_dessert':
          return <PhotoDessertTemplate {...props} />;
        case 'versus':
          return <VersusTemplate {...props} />;
        case 'cta_app':
          return <CtaAppTemplate {...props} />;
        default:
          return (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500 font-bold">
              알 수 없는 템플릿입니다 ({templateType})
            </div>
          );
      }
    };

    return (
      <div
        ref={ref}
        data-slide-id={slide.id}
        data-template-type={slide.templateType}
        className={`relative w-full ${ratioAspectClass} overflow-hidden rounded-2xl shadow-md border border-gray-100 transition-all ${className}`}
        style={{
          fontFamily: INSTA_THEME.fonts.body,
        }}
      >
        {renderContent()}
      </div>
    );
  }
);

TemplateRenderer.displayName = 'TemplateRenderer';
