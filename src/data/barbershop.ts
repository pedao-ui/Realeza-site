export interface ServiceItem {
  id: string;
  name: string;
  category: 'corte' | 'barba' | 'combo' | 'quimica' | 'clube';
  price: number;
  billingCycle?: 'mensal';
  durationMinutes: number;
  summary: string;
  highlights: string[];
  weekdaysOnly?: boolean;
  posterImage?: string;
}

export interface GalleryPhoto {
  id: string;
  src: string;
  alt: string;
  title: string;
  category: 'Visagismo' | 'Degradê e Fade' | 'Barba e Toalha' | 'Platinado';
}

export const BUSINESS_INFO = {
  brandName: 'Realeza Visagismo',
  city: 'Salvador, BA',
  address: 'Endereço Comercial, Salvador, BA',
  phoneDisplay: '(71) 99652-9436',
  whatsappDigits: '5571996529436',
  instagramHandle: '@realezavisagismo',
  instagramUrl: 'https://www.instagram.com/realezavisagismo/',
  hoursSummary: 'Segunda a Sexta das 09h às 20h | Sábado das 09h às 18h',
  logoSrc: '/assets/aistudio/Screenshot_2026-11-20-12-00-23-178_com.instagram.android_4030521e.jpg',
  heroImageSrc: '/assets/aistudio/Screenshot_2026-11-20-12-08-43-954_com.instagram.android_2e5a0afd.jpg',
  videoSrc: '/assets/aistudio/gmaps-video-1795188201_c23a0875.mp4',
  videoPosterSrc: '/assets/aistudio/video-poster-original.jpg',
} as const;

export const BEFORE_AFTER_DATA = {
  headline: 'Antes e depois de quem entende o seu rosto',
  subheadline:
    'Sem corte genérico. A gente analisa proporção facial, caimento natural dos fios e desenho da barba para você sair da cadeira com presença.',
  beforeSrc: '/assets/aistudio/Screenshot_2026-11-20-12-09-57-034_com.instagram.android_4d209b7b.jpg',
  beforeAlt: 'Antes do atendimento na Realeza Visagismo, cabelo volumoso sem definição e barba sem contorno',
  afterSrc: '/assets/aistudio/Screenshot_2026-11-20-12-09-59-903_com.instagram.android_1096fb3e.jpg',
  afterAlt: 'Depois do visagismo na Realeza Visagismo, corte estruturado e barba desenhada com precisão',
  details: [
    'Leitura de formato do rosto antes da primeira tesourada',
    'Alinhamento de costeleta, nuca e contorno da barba na navalha',
    'Finalização pensada para funcionar no seu dia a dia sem esforço',
  ],
};

export const SERVICES: ServiceItem[] = [
  {
    id: 'corte-visagista',
    name: 'Corte Visagista',
    category: 'corte',
    price: 65,
    durationMinutes: 45,
    summary: 'Consultoria rápida de formato facial, corte na tesoura e máquina com acabamento na navalha.',
    highlights: ['Análise de perfil', 'Degradê limpo ou social clássico', 'Lavagem e finalização'],
  },
  {
    id: 'barba-terapia',
    name: 'Barba Terapia na Toalha Quente',
    category: 'barba',
    price: 50,
    durationMinutes: 35,
    summary: 'Alinhamento geométrico da barba com vapor de toalha quente, óleo essencial e pós barba calmante.',
    highlights: ['Toalha quente relaxante', 'Contorno na navalha', 'Hidratação dos fios'],
  },
  {
    id: 'combo-realeza',
    name: 'Combo Corte e Barba Realeza',
    category: 'combo',
    price: 105,
    durationMinutes: 75,
    summary: 'O atendimento completo da casa para alinhar cabelo e barba na mesma sessão.',
    highlights: ['Corte visagista completo', 'Barba com toalha quente', 'Finalização completa'],
  },
  {
    id: 'platinado-nevou',
    name: 'Platinado e Nevou com Degradê',
    category: 'quimica',
    price: 160,
    durationMinutes: 120,
    summary: 'Descoloração controlada para tom branco uniforme preservando a saúde do couro cabeludo.',
    highlights: ['Matização sem amarelado', 'Proteção capilar', 'Corte degradê incluso'],
  },
  {
    id: 'clube-corte-ilimitado',
    name: 'Clube Corte Ilimitado',
    category: 'clube',
    price: 97,
    billingCycle: 'mensal',
    durationMinutes: 45,
    weekdaysOnly: true,
    summary: 'Para manter o corte sempre na régua toda semana pagando um valor fixo mensal.',
    highlights: [
      'Corte ilimitado de segunda a quinta',
      '10% de desconto em serviços extras',
      '10% de desconto em produtos para cabelo',
    ],
    posterImage: '/assets/aistudio/Screenshot_2026-11-20-12-07-39-810_com.instagram.android_0e2ae18e.jpg',
  },
  {
    id: 'clube-barba-ilimitada',
    name: 'Clube Barba Ilimitada',
    category: 'clube',
    price: 129,
    billingCycle: 'mensal',
    durationMinutes: 35,
    weekdaysOnly: true,
    summary: 'Barba sempre desenhada e hidratada durante o mês inteiro sem surpresa no valor.',
    highlights: [
      'Barba ilimitada de segunda a quinta',
      '10% de desconto em serviços extras',
      '10% de desconto em produtos para barba',
    ],
    posterImage: '/assets/aistudio/Screenshot_2026-11-20-12-07-42-566_com.instagram.android_c87c7fd8.jpg',
  },
];

export const GALLERY_CATEGORIES = [
  'Todos',
  'Visagismo',
  'Degradê e Fade',
  'Barba e Toalha',
  'Platinado',
] as const;

export const GALLERY_PHOTOS: GalleryPhoto[] = [
  {
    id: 'gal-1',
    src: '/assets/aistudio/Screenshot_2026-11-20-12-08-43-954_com.instagram.android_2e5a0afd.jpg',
    alt: 'Corte executivo com degradê baixo e barba desenhada na Realeza Visagismo',
    title: 'Corte Executivo e Barba Alinhada',
    category: 'Visagismo',
  },
  {
    id: 'gal-2',
    src: '/assets/aistudio/Screenshot_2026-11-20-12-15-45-301_com.google.android.apps.maps_7f4cb5a4.jpg',
    alt: 'Taper fade com topo cacheado e contorno preciso na navalha',
    title: 'Taper Fade com Cachos Definidos',
    category: 'Degradê e Fade',
  },
  {
    id: 'gal-3',
    src: '/assets/aistudio/Screenshot_2026-11-20-12-09-13-579_com.instagram.android_03411ac4.jpg',
    alt: 'Corte social clássico com barba cheia estruturada em Salvador',
    title: 'Social Clássico e Barba Cheia',
    category: 'Visagismo',
  },
  {
    id: 'gal-4',
    src: '/assets/aistudio/Screenshot_2026-11-20-12-09-16-315_com.instagram.android_11d628f6.jpg',
    alt: 'Mid fade limpo com pezinho marcado e barba baixa desenhada',
    title: 'Mid Fade de Precisão',
    category: 'Degradê e Fade',
  },
  {
    id: 'gal-5',
    src: '/assets/aistudio/Screenshot_2026-11-20-12-15-29-830_com.google.android.apps.maps_cdd86be8.jpg',
    alt: 'Ritual de barba terapia com toalha quente e capa tradicional',
    title: 'Ritual da Toalha Quente',
    category: 'Barba e Toalha',
  },
  {
    id: 'gal-6',
    src: '/assets/aistudio/Screenshot_2026-11-20-12-16-35-590_com.google.android.apps.maps_146b14ac.jpg',
    alt: 'Corte nevou platinado com degradê navalhado e risco lateral',
    title: 'Nevou Platinado Navalhado',
    category: 'Platinado',
  },
  {
    id: 'gal-7',
    src: '/assets/aistudio/Screenshot_2026-11-20-12-08-28-316_com.instagram.android_5cede8f7.jpg',
    alt: 'Topete texturizado grisalho com fade lateral e barba alinhada',
    title: 'Textura Alta e Barba Grisalha',
    category: 'Visagismo',
  },
  {
    id: 'gal-8',
    src: '/assets/aistudio/Screenshot_2026-11-20-12-09-38-674_com.instagram.android_b42ea322.jpg',
    alt: 'Cabelo cacheado com luzes platinadas e acabamento na nuca',
    title: 'Cachos com Luzes e Pezinho Limpo',
    category: 'Platinado',
  },
  {
    id: 'gal-9',
    src: '/assets/aistudio/Screenshot_2026-11-20-12-13-08-140_com.google.android.apps.maps_5cb6490e.jpg',
    alt: 'Acabamento de barba com toalha quente em fotografia preto e branco',
    title: 'Desenho de Barba na Navalha',
    category: 'Barba e Toalha',
  },
  {
    id: 'gal-10',
    src: '/assets/aistudio/Screenshot_2026-11-20-12-08-40-836_com.instagram.android_cc510d20.jpg',
    alt: 'Corte curto social com fade suave e barba grisalha desenhada',
    title: 'Social Curto e Barba Desenhada',
    category: 'Degradê e Fade',
  },
  {
    id: 'gal-11',
    src: '/assets/aistudio/Screenshot_2026-11-20-12-15-50-994_com.google.android.apps.maps_66e2d177.jpg',
    alt: 'Platinado global penteado para trás com acabamento limpo',
    title: 'Platinado Global Penteado',
    category: 'Platinado',
  },
  {
    id: 'gal-12',
    src: '/assets/aistudio/Screenshot_2026-11-20-12-08-16-220_com.instagram.android_3c255916.jpg',
    alt: 'Corte médio ondulado com caimento natural na capa Realeza Visagismo',
    title: 'Ondulado Médio na Tesoura',
    category: 'Visagismo',
  },
];
