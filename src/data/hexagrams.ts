/**
 * Complete 64 Hexagrams Database
 * Traditional I Ching hexagrams with accurate line patterns and names
 */

export interface HexagramData {
  number: number;
  name: string;
  chinese: string;
  pinyin: string;
  lines: ('yin' | 'yang')[];
  keywords: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: 'self' | 'relationships' | 'work' | 'growth' | 'change' | 'timing';
  upperTrigram: string;
  lowerTrigram: string;
  element?: string;
  season?: string;
}

// Line patterns: read from bottom to top (traditional order)
// yin = broken line, yang = solid line
export const HEXAGRAMS: HexagramData[] = [
  {
    number: 1,
    name: 'The Creative',
    chinese: '乾',
    pinyin: 'qián',
    lines: ['yang', 'yang', 'yang', 'yang', 'yang', 'yang'],
    keywords: ['creativity', 'leadership', 'initiative', 'strength', 'heaven'],
    difficulty: 'intermediate',
    category: 'self',
    upperTrigram: 'Heaven',
    lowerTrigram: 'Heaven',
    element: 'Metal',
    season: 'Late Autumn'
  },
  {
    number: 2,
    name: 'The Receptive',
    chinese: '坤',
    pinyin: 'kūn',
    lines: ['yin', 'yin', 'yin', 'yin', 'yin', 'yin'],
    keywords: ['receptivity', 'nurturing', 'devotion', 'earth', 'support'],
    difficulty: 'beginner',
    category: 'self',
    upperTrigram: 'Earth',
    lowerTrigram: 'Earth',
    element: 'Earth',
    season: 'Late Summer'
  },
  {
    number: 3,
    name: 'Initial Difficulty',
    chinese: '屯',
    pinyin: 'zhūn',
    lines: ['yang', 'yin', 'yin', 'yin', 'yang', 'yin'],
    keywords: ['beginnings', 'difficulty', 'birth', 'struggle', 'potential'],
    difficulty: 'beginner',
    category: 'growth',
    upperTrigram: 'Water',
    lowerTrigram: 'Thunder'
  },
  {
    number: 4,
    name: 'Youthful Folly',
    chinese: '蒙',
    pinyin: 'méng',
    lines: ['yin', 'yang', 'yin', 'yin', 'yin', 'yang'],
    keywords: ['inexperience', 'learning', 'guidance', 'education', 'youth'],
    difficulty: 'beginner',
    category: 'growth',
    upperTrigram: 'Mountain',
    lowerTrigram: 'Water'
  },
  {
    number: 5,
    name: 'Waiting',
    chinese: '需',
    pinyin: 'xū',
    lines: ['yang', 'yang', 'yin', 'yin', 'yang', 'yang'],
    keywords: ['patience', 'nourishment', 'confidence', 'preparation', 'timing'],
    difficulty: 'intermediate',
    category: 'timing',
    upperTrigram: 'Water',
    lowerTrigram: 'Heaven'
  },
  {
    number: 6,
    name: 'Conflict',
    chinese: '訟',
    pinyin: 'sòng',
    lines: ['yang', 'yang', 'yang', 'yin', 'yin', 'yang'],
    keywords: ['conflict', 'argument', 'litigation', 'opposition', 'tension'],
    difficulty: 'advanced',
    category: 'relationships',
    upperTrigram: 'Heaven',
    lowerTrigram: 'Water'
  },
  {
    number: 7,
    name: 'The Army',
    chinese: '師',
    pinyin: 'shī',
    lines: ['yin', 'yang', 'yin', 'yin', 'yin', 'yin'],
    keywords: ['discipline', 'organization', 'leadership', 'strategy', 'collective'],
    difficulty: 'advanced',
    category: 'work',
    upperTrigram: 'Earth',
    lowerTrigram: 'Water'
  },
  {
    number: 8,
    name: 'Holding Together',
    chinese: '比',
    pinyin: 'bǐ',
    lines: ['yin', 'yin', 'yin', 'yin', 'yang', 'yin'],
    keywords: ['unity', 'alliance', 'cooperation', 'support', 'union'],
    difficulty: 'beginner',
    category: 'relationships',
    upperTrigram: 'Water',
    lowerTrigram: 'Earth'
  },
  {
    number: 9,
    name: 'Small Taming',
    chinese: '小畜',
    pinyin: 'xiǎo xù',
    lines: ['yang', 'yang', 'yin', 'yang', 'yang', 'yang'],
    keywords: ['restraint', 'accumulation', 'gentle', 'patience', 'gradual'],
    difficulty: 'intermediate',
    category: 'self',
    upperTrigram: 'Wind',
    lowerTrigram: 'Heaven'
  },
  {
    number: 10,
    name: 'Treading',
    chinese: '履',
    pinyin: 'lǚ',
    lines: ['yang', 'yang', 'yang', 'yin', 'yang', 'yang'],
    keywords: ['conduct', 'careful', 'step', 'behavior', 'propriety'],
    difficulty: 'intermediate',
    category: 'self',
    upperTrigram: 'Heaven',
    lowerTrigram: 'Lake'
  },
  {
    number: 11,
    name: 'Peace',
    chinese: '泰',
    pinyin: 'tài',
    lines: ['yang', 'yang', 'yang', 'yin', 'yin', 'yin'],
    keywords: ['peace', 'harmony', 'prosperity', 'balance', 'communication'],
    difficulty: 'beginner',
    category: 'self',
    upperTrigram: 'Earth',
    lowerTrigram: 'Heaven'
  },
  {
    number: 12,
    name: 'Standstill',
    chinese: '否',
    pinyin: 'pǐ',
    lines: ['yin', 'yin', 'yin', 'yang', 'yang', 'yang'],
    keywords: ['stagnation', 'standstill', 'obstruction', 'withdrawal', 'isolation'],
    difficulty: 'advanced',
    category: 'change',
    upperTrigram: 'Heaven',
    lowerTrigram: 'Earth'
  },
  {
    number: 13,
    name: 'Fellowship',
    chinese: '同人',
    pinyin: 'tóng rén',
    lines: ['yang', 'yin', 'yang', 'yang', 'yang', 'yang'],
    keywords: ['fellowship', 'community', 'partnership', 'cooperation', 'shared'],
    difficulty: 'intermediate',
    category: 'relationships',
    upperTrigram: 'Heaven',
    lowerTrigram: 'Fire'
  },
  {
    number: 14,
    name: 'Great Possession',
    chinese: '大有',
    pinyin: 'dà yǒu',
    lines: ['yang', 'yang', 'yang', 'yang', 'yin', 'yang'],
    keywords: ['abundance', 'possession', 'wealth', 'prosperity', 'success'],
    difficulty: 'intermediate',
    category: 'work',
    upperTrigram: 'Fire',
    lowerTrigram: 'Heaven'
  },
  {
    number: 15,
    name: 'Modesty',
    chinese: '謙',
    pinyin: 'qiān',
    lines: ['yin', 'yang', 'yin', 'yin', 'yin', 'yang'],
    keywords: ['modesty', 'humility', 'restraint', 'discretion', 'yielding'],
    difficulty: 'beginner',
    category: 'self',
    upperTrigram: 'Earth',
    lowerTrigram: 'Mountain'
  },
  {
    number: 16,
    name: 'Enthusiasm',
    chinese: '豫',
    pinyin: 'yù',
    lines: ['yang', 'yin', 'yin', 'yin', 'yang', 'yin'],
    keywords: ['enthusiasm', 'preparation', 'foresight', 'planning', 'anticipation'],
    difficulty: 'intermediate',
    category: 'timing',
    upperTrigram: 'Thunder',
    lowerTrigram: 'Earth'
  },
  {
    number: 17,
    name: 'Following',
    chinese: '隨',
    pinyin: 'suí',
    lines: ['yang', 'yin', 'yin', 'yin', 'yang', 'yang'],
    keywords: ['following', 'adaptation', 'compliance', 'acceptance', 'flow'],
    difficulty: 'intermediate',
    category: 'relationships',
    upperTrigram: 'Lake',
    lowerTrigram: 'Thunder'
  },
  {
    number: 18,
    name: 'Work on the Decayed',
    chinese: '蠱',
    pinyin: 'gǔ',
    lines: ['yang', 'yang', 'yin', 'yin', 'yin', 'yang'],
    keywords: ['corruption', 'decay', 'work', 'repair', 'restoration'],
    difficulty: 'advanced',
    category: 'work',
    upperTrigram: 'Mountain',
    lowerTrigram: 'Wind'
  },
  {
    number: 19,
    name: 'Approach',
    chinese: '臨',
    pinyin: 'lín',
    lines: ['yang', 'yang', 'yin', 'yin', 'yin', 'yin'],
    keywords: ['approach', 'advance', 'supervision', 'leadership', 'influence'],
    difficulty: 'intermediate',
    category: 'work',
    upperTrigram: 'Earth',
    lowerTrigram: 'Lake'
  },
  {
    number: 20,
    name: 'Contemplation',
    chinese: '觀',
    pinyin: 'guān',
    lines: ['yin', 'yin', 'yin', 'yin', 'yang', 'yang'],
    keywords: ['contemplation', 'observation', 'looking', 'meditation', 'reflection'],
    difficulty: 'intermediate',
    category: 'self',
    upperTrigram: 'Wind',
    lowerTrigram: 'Earth'
  },
  {
    number: 21,
    name: 'Biting Through',
    chinese: '噬嗑',
    pinyin: 'shì hé',
    lines: ['yang', 'yin', 'yin', 'yang', 'yin', 'yang'],
    keywords: ['biting', 'legal', 'punishment', 'justice', 'decision'],
    difficulty: 'advanced',
    category: 'work',
    upperTrigram: 'Fire',
    lowerTrigram: 'Thunder'
  },
  {
    number: 22,
    name: 'Grace',
    chinese: '賁',
    pinyin: 'bì',
    lines: ['yang', 'yin', 'yang', 'yin', 'yin', 'yang'],
    keywords: ['grace', 'beauty', 'ornamentation', 'culture', 'refinement'],
    difficulty: 'intermediate',
    category: 'self',
    upperTrigram: 'Mountain',
    lowerTrigram: 'Fire'
  },
  {
    number: 23,
    name: 'Splitting Apart',
    chinese: '剝',
    pinyin: 'bō',
    lines: ['yin', 'yin', 'yin', 'yin', 'yin', 'yang'],
    keywords: ['splitting', 'deterioration', 'decline', 'collapse', 'erosion'],
    difficulty: 'advanced',
    category: 'change',
    upperTrigram: 'Mountain',
    lowerTrigram: 'Earth'
  },
  {
    number: 24,
    name: 'Return',
    chinese: '復',
    pinyin: 'fù',
    lines: ['yang', 'yin', 'yin', 'yin', 'yin', 'yin'],
    keywords: ['return', 'turning', 'revival', 'recovery', 'renewal'],
    difficulty: 'intermediate',
    category: 'change',
    upperTrigram: 'Earth',
    lowerTrigram: 'Thunder'
  },
  {
    number: 25,
    name: 'Innocence',
    chinese: '無妄',
    pinyin: 'wú wàng',
    lines: ['yang', 'yin', 'yin', 'yang', 'yang', 'yang'],
    keywords: ['innocence', 'natural', 'spontaneous', 'unexpected', 'genuine'],
    difficulty: 'intermediate',
    category: 'self',
    upperTrigram: 'Heaven',
    lowerTrigram: 'Thunder'
  },
  {
    number: 26,
    name: 'Great Taming',
    chinese: '大畜',
    pinyin: 'dà xù',
    lines: ['yang', 'yang', 'yang', 'yin', 'yin', 'yang'],
    keywords: ['taming', 'restraint', 'accumulation', 'potential', 'storage'],
    difficulty: 'advanced',
    category: 'self',
    upperTrigram: 'Mountain',
    lowerTrigram: 'Heaven'
  },
  {
    number: 27,
    name: 'Nourishment',
    chinese: '頤',
    pinyin: 'yí',
    lines: ['yang', 'yin', 'yin', 'yin', 'yin', 'yang'],
    keywords: ['nourishment', 'feeding', 'sustenance', 'care', 'nurturing'],
    difficulty: 'beginner',
    category: 'self',
    upperTrigram: 'Mountain',
    lowerTrigram: 'Thunder'
  },
  {
    number: 28,
    name: 'Great Exceeding',
    chinese: '大過',
    pinyin: 'dà guò',
    lines: ['yin', 'yang', 'yang', 'yang', 'yang', 'yin'],
    keywords: ['excess', 'preponderance', 'critical', 'exceptional', 'extreme'],
    difficulty: 'advanced',
    category: 'change',
    upperTrigram: 'Lake',
    lowerTrigram: 'Wind'
  },
  {
    number: 29,
    name: 'The Abysmal Water',
    chinese: '坎',
    pinyin: 'kǎn',
    lines: ['yin', 'yang', 'yin', 'yin', 'yang', 'yin'],
    keywords: ['water', 'danger', 'abyss', 'challenge', 'flow'],
    difficulty: 'advanced',
    category: 'change',
    upperTrigram: 'Water',
    lowerTrigram: 'Water',
    element: 'Water',
    season: 'Winter'
  },
  {
    number: 30,
    name: 'The Clinging Fire',
    chinese: '離',
    pinyin: 'lí',
    lines: ['yang', 'yin', 'yang', 'yang', 'yin', 'yang'],
    keywords: ['fire', 'clinging', 'brightness', 'clarity', 'illumination'],
    difficulty: 'intermediate',
    category: 'self',
    upperTrigram: 'Fire',
    lowerTrigram: 'Fire',
    element: 'Fire',
    season: 'Summer'
  },
  {
    number: 31,
    name: 'Influence',
    chinese: '咸',
    pinyin: 'xián',
    lines: ['yin', 'yang', 'yang', 'yin', 'yin', 'yang'],
    keywords: ['influence', 'attraction', 'courtship', 'mutual', 'stimulation'],
    difficulty: 'intermediate',
    category: 'relationships',
    upperTrigram: 'Lake',
    lowerTrigram: 'Mountain'
  },
  {
    number: 32,
    name: 'Duration',
    chinese: '恆',
    pinyin: 'héng',
    lines: ['yang', 'yin', 'yin', 'yang', 'yang', 'yin'],
    keywords: ['duration', 'perseverance', 'consistency', 'endurance', 'constancy'],
    difficulty: 'intermediate',
    category: 'timing',
    upperTrigram: 'Thunder',
    lowerTrigram: 'Wind'
  },
  {
    number: 33,
    name: 'Retreat',
    chinese: '遯',
    pinyin: 'dùn',
    lines: ['yin', 'yin', 'yang', 'yang', 'yang', 'yang'],
    keywords: ['retreat', 'withdrawal', 'retirement', 'yielding', 'strategic'],
    difficulty: 'advanced',
    category: 'timing',
    upperTrigram: 'Heaven',
    lowerTrigram: 'Mountain'
  },
  {
    number: 34,
    name: 'Great Power',
    chinese: '大壯',
    pinyin: 'dà zhuàng',
    lines: ['yang', 'yang', 'yang', 'yang', 'yin', 'yin'],
    keywords: ['power', 'strength', 'vigor', 'force', 'energy'],
    difficulty: 'intermediate',
    category: 'self',
    upperTrigram: 'Thunder',
    lowerTrigram: 'Heaven'
  },
  {
    number: 35,
    name: 'Progress',
    chinese: '晉',
    pinyin: 'jìn',
    lines: ['yin', 'yin', 'yin', 'yang', 'yin', 'yang'],
    keywords: ['progress', 'advancement', 'promotion', 'sunrise', 'clarity'],
    difficulty: 'intermediate',
    category: 'growth',
    upperTrigram: 'Fire',
    lowerTrigram: 'Earth'
  },
  {
    number: 36,
    name: 'Darkening of the Light',
    chinese: '明夷',
    pinyin: 'míng yí',
    lines: ['yang', 'yin', 'yang', 'yin', 'yin', 'yin'],
    keywords: ['darkening', 'injury', 'censorship', 'persecution', 'concealment'],
    difficulty: 'advanced',
    category: 'change',
    upperTrigram: 'Earth',
    lowerTrigram: 'Fire'
  },
  {
    number: 37,
    name: 'The Family',
    chinese: '家人',
    pinyin: 'jiā rén',
    lines: ['yang', 'yin', 'yang', 'yin', 'yang', 'yang'],
    keywords: ['family', 'household', 'clan', 'domestic', 'relationships'],
    difficulty: 'beginner',
    category: 'relationships',
    upperTrigram: 'Wind',
    lowerTrigram: 'Fire'
  },
  {
    number: 38,
    name: 'Opposition',
    chinese: '睽',
    pinyin: 'kuí',
    lines: ['yang', 'yang', 'yin', 'yang', 'yin', 'yang'],
    keywords: ['opposition', 'conflict', 'estrangement', 'diversity', 'polarity'],
    difficulty: 'advanced',
    category: 'relationships',
    upperTrigram: 'Fire',
    lowerTrigram: 'Lake'
  },
  {
    number: 39,
    name: 'Obstruction',
    chinese: '蹇',
    pinyin: 'jiǎn',
    lines: ['yin', 'yin', 'yang', 'yin', 'yang', 'yin'],
    keywords: ['obstruction', 'limping', 'difficulty', 'halting', 'impediment'],
    difficulty: 'advanced',
    category: 'change',
    upperTrigram: 'Water',
    lowerTrigram: 'Mountain'
  },
  {
    number: 40,
    name: 'Deliverance',
    chinese: '解',
    pinyin: 'xiè',
    lines: ['yin', 'yang', 'yin', 'yang', 'yin', 'yin'],
    keywords: ['deliverance', 'liberation', 'release', 'solution', 'relief'],
    difficulty: 'intermediate',
    category: 'change',
    upperTrigram: 'Thunder',
    lowerTrigram: 'Water'
  },
  {
    number: 41,
    name: 'Decrease',
    chinese: '損',
    pinyin: 'sǔn',
    lines: ['yang', 'yang', 'yin', 'yin', 'yin', 'yang'],
    keywords: ['decrease', 'loss', 'diminishing', 'sacrifice', 'giving'],
    difficulty: 'advanced',
    category: 'change',
    upperTrigram: 'Mountain',
    lowerTrigram: 'Lake'
  },
  {
    number: 42,
    name: 'Increase',
    chinese: '益',
    pinyin: 'yì',
    lines: ['yang', 'yin', 'yang', 'yang', 'yang', 'yin'],
    keywords: ['increase', 'benefit', 'profit', 'gain', 'augmentation'],
    difficulty: 'intermediate',
    category: 'growth',
    upperTrigram: 'Wind',
    lowerTrigram: 'Thunder'
  },
  {
    number: 43,
    name: 'Breakthrough',
    chinese: '夬',
    pinyin: 'guài',
    lines: ['yang', 'yang', 'yang', 'yang', 'yang', 'yin'],
    keywords: ['breakthrough', 'resolution', 'determination', 'decisiveness', 'displacement'],
    difficulty: 'advanced',
    category: 'change',
    upperTrigram: 'Lake',
    lowerTrigram: 'Heaven'
  },
  {
    number: 44,
    name: 'Coming to Meet',
    chinese: '姤',
    pinyin: 'gòu',
    lines: ['yin', 'yang', 'yang', 'yang', 'yang', 'yang'],
    keywords: ['meeting', 'encounter', 'temptation', 'seduction', 'unexpected'],
    difficulty: 'advanced',
    category: 'relationships',
    upperTrigram: 'Heaven',
    lowerTrigram: 'Wind'
  },
  {
    number: 45,
    name: 'Gathering Together',
    chinese: '萃',
    pinyin: 'cuì',
    lines: ['yin', 'yin', 'yin', 'yang', 'yang', 'yin'],
    keywords: ['gathering', 'collecting', 'assembling', 'congregation', 'unity'],
    difficulty: 'intermediate',
    category: 'relationships',
    upperTrigram: 'Lake',
    lowerTrigram: 'Earth'
  },
  {
    number: 46,
    name: 'Pushing Upward',
    chinese: '升',
    pinyin: 'shēng',
    lines: ['yin', 'yang', 'yang', 'yin', 'yin', 'yin'],
    keywords: ['ascending', 'pushing', 'growth', 'promotion', 'rising'],
    difficulty: 'intermediate',
    category: 'growth',
    upperTrigram: 'Earth',
    lowerTrigram: 'Wind'
  },
  {
    number: 47,
    name: 'Oppression',
    chinese: '困',
    pinyin: 'kùn',
    lines: ['yin', 'yang', 'yin', 'yin', 'yin', 'yang'],
    keywords: ['oppression', 'exhaustion', 'adversity', 'confinement', 'depletion'],
    difficulty: 'advanced',
    category: 'change',
    upperTrigram: 'Lake',
    lowerTrigram: 'Water'
  },
  {
    number: 48,
    name: 'The Well',
    chinese: '井',
    pinyin: 'jǐng',
    lines: ['yang', 'yin', 'yin', 'yin', 'yang', 'yin'],
    keywords: ['well', 'source', 'resources', 'nourishment', 'community'],
    difficulty: 'intermediate',
    category: 'work',
    upperTrigram: 'Water',
    lowerTrigram: 'Wind'
  },
  {
    number: 49,
    name: 'Revolution',
    chinese: '革',
    pinyin: 'gé',
    lines: ['yang', 'yang', 'yin', 'yin', 'yin', 'yang'],
    keywords: ['revolution', 'change', 'molting', 'transformation', 'reform'],
    difficulty: 'advanced',
    category: 'change',
    upperTrigram: 'Lake',
    lowerTrigram: 'Fire'
  },
  {
    number: 50,
    name: 'The Cauldron',
    chinese: '鼎',
    pinyin: 'dǐng',
    lines: ['yang', 'yin', 'yang', 'yang', 'yin', 'yang'],
    keywords: ['cauldron', 'transformation', 'nourishment', 'culture', 'refinement'],
    difficulty: 'advanced',
    category: 'growth',
    upperTrigram: 'Fire',
    lowerTrigram: 'Wind'
  },
  {
    number: 51,
    name: 'The Arousing Thunder',
    chinese: '震',
    pinyin: 'zhèn',
    lines: ['yang', 'yin', 'yin', 'yang', 'yin', 'yin'],
    keywords: ['thunder', 'shock', 'arousing', 'initiative', 'movement'],
    difficulty: 'intermediate',
    category: 'change',
    upperTrigram: 'Thunder',
    lowerTrigram: 'Thunder',
    element: 'Wood',
    season: 'Spring'
  },
  {
    number: 52,
    name: 'Keeping Still Mountain',
    chinese: '艮',
    pinyin: 'gèn',
    lines: ['yin', 'yin', 'yang', 'yin', 'yin', 'yang'],
    keywords: ['mountain', 'stillness', 'meditation', 'stopping', 'rest'],
    difficulty: 'intermediate',
    category: 'self',
    upperTrigram: 'Mountain',
    lowerTrigram: 'Mountain'
  },
  {
    number: 53,
    name: 'Development',
    chinese: '漸',
    pinyin: 'jiàn',
    lines: ['yin', 'yin', 'yang', 'yin', 'yang', 'yang'],
    keywords: ['development', 'gradual', 'progress', 'steady', 'advancement'],
    difficulty: 'intermediate',
    category: 'growth',
    upperTrigram: 'Wind',
    lowerTrigram: 'Mountain'
  },
  {
    number: 54,
    name: 'The Marrying Maiden',
    chinese: '歸妹',
    pinyin: 'guī mèi',
    lines: ['yang', 'yang', 'yin', 'yang', 'yin', 'yin'],
    keywords: ['marriage', 'subordinate', 'position', 'relationships', 'propriety'],
    difficulty: 'advanced',
    category: 'relationships',
    upperTrigram: 'Thunder',
    lowerTrigram: 'Lake'
  },
  {
    number: 55,
    name: 'Abundance',
    chinese: '豐',
    pinyin: 'fēng',
    lines: ['yang', 'yin', 'yang', 'yang', 'yin', 'yin'],
    keywords: ['abundance', 'fullness', 'prosperity', 'peak', 'zenith'],
    difficulty: 'intermediate',
    category: 'work',
    upperTrigram: 'Thunder',
    lowerTrigram: 'Fire'
  },
  {
    number: 56,
    name: 'The Wanderer',
    chinese: '旅',
    pinyin: 'lǚ',
    lines: ['yin', 'yin', 'yang', 'yang', 'yin', 'yang'],
    keywords: ['wanderer', 'traveler', 'stranger', 'sojourning', 'temporary'],
    difficulty: 'advanced',
    category: 'change',
    upperTrigram: 'Fire',
    lowerTrigram: 'Mountain'
  },
  {
    number: 57,
    name: 'The Gentle Wind',
    chinese: '巽',
    pinyin: 'xùn',
    lines: ['yang', 'yang', 'yin', 'yang', 'yang', 'yin'],
    keywords: ['wind', 'gentle', 'penetrating', 'influence', 'flexibility'],
    difficulty: 'intermediate',
    category: 'self',
    upperTrigram: 'Wind',
    lowerTrigram: 'Wind',
    element: 'Wood',
    season: 'Late Spring'
  },
  {
    number: 58,
    name: 'The Joyous Lake',
    chinese: '兌',
    pinyin: 'duì',
    lines: ['yin', 'yang', 'yang', 'yin', 'yang', 'yang'],
    keywords: ['joy', 'lake', 'pleasure', 'communication', 'exchange'],
    difficulty: 'beginner',
    category: 'relationships',
    upperTrigram: 'Lake',
    lowerTrigram: 'Lake',
    element: 'Metal',
    season: 'Autumn'
  },
  {
    number: 59,
    name: 'Dispersion',
    chinese: '渙',
    pinyin: 'huàn',
    lines: ['yin', 'yang', 'yin', 'yang', 'yang', 'yin'],
    keywords: ['dispersion', 'dissolution', 'scattering', 'separation', 'release'],
    difficulty: 'advanced',
    category: 'change',
    upperTrigram: 'Wind',
    lowerTrigram: 'Water'
  },
  {
    number: 60,
    name: 'Limitation',
    chinese: '節',
    pinyin: 'jié',
    lines: ['yin', 'yang', 'yin', 'yin', 'yang', 'yin'],
    keywords: ['limitation', 'moderation', 'economy', 'restraint', 'regulation'],
    difficulty: 'intermediate',
    category: 'self',
    upperTrigram: 'Water',
    lowerTrigram: 'Lake'
  },
  {
    number: 61,
    name: 'Inner Truth',
    chinese: '中孚',
    pinyin: 'zhōng fú',
    lines: ['yang', 'yang', 'yin', 'yin', 'yang', 'yang'],
    keywords: ['truth', 'sincerity', 'confidence', 'inner', 'authenticity'],
    difficulty: 'advanced',
    category: 'self',
    upperTrigram: 'Wind',
    lowerTrigram: 'Lake'
  },
  {
    number: 62,
    name: 'Small Exceeding',
    chinese: '小過',
    pinyin: 'xiǎo guò',
    lines: ['yin', 'yin', 'yang', 'yang', 'yin', 'yin'],
    keywords: ['exceeding', 'small', 'preponderance', 'caution', 'modesty'],
    difficulty: 'intermediate',
    category: 'self',
    upperTrigram: 'Thunder',
    lowerTrigram: 'Mountain'
  },
  {
    number: 63,
    name: 'After Completion',
    chinese: '既濟',
    pinyin: 'jì jì',
    lines: ['yang', 'yin', 'yang', 'yin', 'yang', 'yin'],
    keywords: ['completion', 'accomplished', 'order', 'balance', 'perfection'],
    difficulty: 'advanced',
    category: 'timing',
    upperTrigram: 'Water',
    lowerTrigram: 'Fire'
  },
  {
    number: 64,
    name: 'Before Completion',
    chinese: '未濟',
    pinyin: 'wèi jì',
    lines: ['yin', 'yang', 'yin', 'yang', 'yin', 'yang'],
    keywords: ['incompletion', 'transition', 'potential', 'almost', 'preparation'],
    difficulty: 'advanced',
    category: 'timing',
    upperTrigram: 'Fire',
    lowerTrigram: 'Water'
  }
];

// Helper function to get hexagram by number
export function getHexagram(number: number): HexagramData | undefined {
  return HEXAGRAMS.find(h => h.number === number);
}

// Helper function to get hexagrams by category
export function getHexagramsByCategory(category: HexagramData['category']): HexagramData[] {
  return HEXAGRAMS.filter(h => h.category === category);
}

// Helper function to get hexagrams by difficulty
export function getHexagramsByDifficulty(difficulty: HexagramData['difficulty']): HexagramData[] {
  return HEXAGRAMS.filter(h => h.difficulty === difficulty);
}