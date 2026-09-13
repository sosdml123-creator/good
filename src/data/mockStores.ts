import { StoreChannelInfo } from '../types';

export const INITIAL_STORE_CHANNELS: StoreChannelInfo[] = [
  {
    id: 'cu',
    name: 'CU',
    category: 'convenience',
    logo: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=120&auto=format&fit=crop&q=80',
    defaultLink: 'https://cu.bgfretail.com',
    deliveryBadge: '매장 픽업 🛍️',
    color: '#652D90',
    isActive: true,
    order: 1
  },
  {
    id: 'gs25',
    name: 'GS25',
    category: 'convenience',
    logo: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=120&auto=format&fit=crop&q=80',
    defaultLink: 'http://gs25.gsretail.com',
    deliveryBadge: '매장 픽업 🛍️',
    color: '#007BC3',
    isActive: true,
    order: 2
  },
  {
    id: 'seven_eleven',
    name: '세븐일레븐',
    category: 'convenience',
    logo: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=120&auto=format&fit=crop&q=80',
    defaultLink: 'https://www.7-eleven.co.kr',
    deliveryBadge: '매장 픽업 🛍️',
    color: '#008054',
    isActive: true,
    order: 3
  },
  {
    id: 'emart24',
    name: '이마트24',
    category: 'convenience',
    logo: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=120&auto=format&fit=crop&q=80',
    defaultLink: 'https://www.emart24.co.kr',
    deliveryBadge: '매장 픽업 🛍️',
    color: '#FFB81C',
    isActive: true,
    order: 4
  },
  {
    id: 'kurly',
    name: '마켓컬리',
    category: 'online',
    logo: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=120&auto=format&fit=crop&q=80',
    defaultLink: 'https://www.kurly.com',
    deliveryBadge: '샛별배송 🚀',
    color: '#5F0080',
    isActive: true,
    order: 5
  },
  {
    id: 'coupang_fresh',
    name: '쿠팡프레시',
    category: 'online',
    logo: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=120&auto=format&fit=crop&q=80',
    defaultLink: 'https://www.coupang.com',
    deliveryBadge: '로켓프레시 🚀',
    color: '#E02020',
    isActive: true,
    order: 6
  },
  {
    id: 'bmart',
    name: 'B마트',
    category: 'online',
    logo: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=120&auto=format&fit=crop&q=80',
    defaultLink: 'https://www.baemin.com',
    deliveryBadge: '즉시 배달 ⚡',
    color: '#2AC1BC',
    isActive: true,
    order: 7
  },
  {
    id: 'emart',
    name: '이마트',
    category: 'mart',
    logo: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=120&auto=format&fit=crop&q=80',
    defaultLink: 'https://emart.ssg.com',
    deliveryBadge: '쓱배송 ⚡',
    color: '#FFB81C',
    isActive: true,
    order: 8
  },
  {
    id: 'homeplus',
    name: '홈플러스',
    category: 'mart',
    logo: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=120&auto=format&fit=crop&q=80',
    defaultLink: 'https://front.homeplus.co.kr',
    deliveryBadge: '당일 배송 ⚡',
    color: '#E31B23',
    isActive: true,
    order: 9
  },
  {
    id: 'lottemart',
    name: '롯데마트',
    category: 'mart',
    logo: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=120&auto=format&fit=crop&q=80',
    defaultLink: 'https://www.lottemart.com',
    deliveryBadge: '새벽 배송 🚀',
    color: '#ED1C24',
    isActive: true,
    order: 10
  },
  {
    id: 'official_store',
    name: '공식몰',
    category: 'official',
    logo: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=120&auto=format&fit=crop&q=80',
    defaultLink: '',
    deliveryBadge: '브랜드 직영 🏢',
    color: '#4F46E5',
    isActive: true,
    order: 11
  },
  {
    id: 'oliveyoung',
    name: '올리브영',
    category: 'specialty',
    logo: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=120&auto=format&fit=crop&q=80',
    defaultLink: 'https://www.oliveyoung.co.kr',
    deliveryBadge: '오늘드림 ⚡',
    color: '#84B741',
    isActive: true,
    order: 12
  }
];
