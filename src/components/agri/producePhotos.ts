import type { MarketPriceRow } from '../../pc/useMarketPrices';

const original: Record<string,string> = {사과:'apple',배:'pear',감귤:'tangerine',단감:'persimmon',바나나:'banana',고구마:'sweetpotato',감자:'potato',배추:'cabbage',무:'radish',양파:'onion',토마토:'tomato',쌀:'rice',고등어:'mackerel',갈치:'hairtail',명태:'pollock',물오징어:'squid',굴:'oyster',전복:'abalone',새우:'shrimp',꽃게:'crab',계란:'egg'};
const generated: Record<string,string> = {찹쌀:'glutinous-rice',혼식곡:'mixed-grains',현미:'brown-rice',보리쌀:'barley',콩:'soybean',팥:'redbean',녹두:'mungbean',양배추:'cabbage-round',시금치:'spinach',갓:'mustard',당근:'carrot',열무:'young-radish',건고추:'dried-chili',붉은고추:'red-chili',생강:'ginger',고춧가루:'chili-powder',깻잎:'perilla',부추:'chives',피망:'green-pepper',파프리카:'bell-pepper',멜론:'melon', '깐마늘(국산)':'garlic',복숭아:'peach',파인애플:'pineapple',오렌지:'orange',레몬:'lemon',망고:'mango',블루베리:'blueberry',아보카도:'avocado',키위:'kiwi',우유:'milk',꽁치:'saury',조기:'croaker',수입조기:'croaker',삼치:'spanish-mackerel',마른멸치:'anchovy',마른오징어:'dried-squid',김:'seaweed',마른미역:'wakame',새우젓:'salted-shrimp',멸치액젓:'fish-sauce',천일염:'salt',홍합:'mussel',가리비:'scallop',건다시마:'kelp',바지락:'clam',고등어필렛:'mackerel-fillet',낙지:'octopus',꼬막:'cockle',가지:'eggplant',브로콜리:'broccoli',풋고추:'greenchili',미나리:'minari',얼갈이배추:'napa',알배기배추:'napa',오이:'cucumber',호박:'zucchini',방울토마토:'cherrytomato',수박:'watermelon',참외:'koreanmelon',딸기:'strawberry',포도:'grapes'};
const meat: Record<string,string> = {안심:'beef-tenderloin',설도:'beef-round',양지:'beef-brisket',갈비:'beef-ribs',갈비살:'beef-ribmeat'};
export function preciseProducePhoto(r: MarketPriceRow): string | null {
  const item=r.itemName; const kind=r.kindName;
  const gen=(file:string)=>`/produce-img/generated-${file}.jpg`;
  if (/돼지/.test(item)) {
    if (/삼겹/.test(kind)) return '/produce-img/porkbelly.jpg';
    if (/목심|목살/.test(kind)) return '/produce-img/porkneck.jpg';
    if (/앞다리/.test(kind)) return gen('pork-shoulder');
    if (/갈비/.test(kind)) return gen('pork-ribs');
    return null;
  }
  if (item==='소'||/소고기|한우/.test(item)) {
    if (/등심/.test(kind)) return '/produce-img/beefsirloin.jpg';
    const cut=Object.keys(meat).sort((a,b)=>b.length-a.length).find(k=>kind.includes(k));
    return cut ? gen(meat[cut]) : null;
  }
  if (/닭/.test(item)) {
    if (/가슴/.test(kind)) return gen('chicken-breast');
    if (/날개/.test(kind)) return gen('chicken-wing');
    if (/넓적|허벅/.test(kind)) return gen('chicken-thigh');
    if (/다리/.test(kind)) return gen('chicken-leg');
    return /절단|토막/.test(kind) ? gen('chicken-cut') : '/produce-img/chicken.jpg';
  }
  if(item==='파') return '/produce-img/greenonion.jpg';
  if(item==='상추') return gen(kind.startsWith('적')?'lettuce-red':'lettuce-green');
  if(original[item]) return `/produce-img/${original[item]}.jpg`;
  return generated[item] ? gen(generated[item]) : null;
}
