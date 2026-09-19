import { Product } from '../types';

/**
 * 상품 객체로부터 고유하고 일관된 상품 코드(Product Code)를 가져오거나 생성합니다.
 * 형식: SP-001, SP-002, SP-2026-001 등
 */
export function getProductCode(product?: Partial<Product> | { id: string; code?: string } | null): string {
  if (!product || !product.id) return '';

  if (product.code && product.code.trim().length > 0) {
    return product.code.trim().toUpperCase();
  }

  const idStr = String(product.id).trim();

  // 순수 숫자인 경우 3자리 이상 0-패딩 (예: "1" -> "SP-001", "12" -> "SP-012", "105" -> "SP-105")
  if (/^\d+$/.test(idStr)) {
    const num = parseInt(idStr, 10);
    return `SP-${String(num).padStart(3, '0')}`;
  }

  // "prod-1", "product-12" 형태인 경우
  const matchNum = idStr.match(/\d+/);
  if (matchNum) {
    const num = parseInt(matchNum[0], 10);
    return `SP-${String(num).padStart(3, '0')}`;
  }

  // 영숫자/UUID 형태인 경우 고유 해시 기반 코드 생성
  let hash = 0;
  for (let i = 0; i < idStr.length; i++) {
    hash = (hash << 5) - hash + idStr.charCodeAt(i);
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).toUpperCase().padStart(4, '0').slice(-4);
  return `SP-${hex}`;
}

/**
 * 신규 상품 추가 시 중복되지 않는 다음 상품 코드를 발급합니다.
 */
export function generateNextProductCode(existingProducts: Product[]): string {
  let maxNum = 0;
  existingProducts.forEach((p) => {
    const code = getProductCode(p);
    const match = code.match(/^SP-(\d+)$/);
    if (match) {
      const num = parseInt(match[1], 10);
      if (num > maxNum) maxNum = num;
    }
  });

  const nextNum = Math.max(maxNum + 1, existingProducts.length + 1);
  return `SP-${String(nextNum).padStart(3, '0')}`;
}

/**
 * ID 또는 상품 코드(SP-001, SP-002 등)로 상품 목록에서 상품을 검색합니다.
 */
export function findProductByCodeOrId(products: Product[], codeOrId: string): Product | undefined {
  if (!codeOrId) return undefined;
  const target = codeOrId.trim().toUpperCase();
  const normalizedTarget = target.replace(/^SP-/, ''); // "001" 또는 "1"

  return products.find((p) => {
    if (String(p.id).toUpperCase() === target) return true;
    if (String(p.id).toUpperCase() === normalizedTarget) return true;
    const pCode = getProductCode(p);
    if (pCode.toUpperCase() === target) return true;
    if (pCode.replace(/^SP-/, '').toUpperCase() === normalizedTarget) return true;
    return false;
  });
}

/**
 * 상품 공유 및 딥링크용 정규 URL을 생성합니다.
 */
export function getProductShareUrl(product: Product): string {
  const code = getProductCode(product);
  const baseUrl = window.location.origin;
  return `${baseUrl}/?p=${encodeURIComponent(code)}`;
}
