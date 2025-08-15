'use client';

import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { generateHexagram, getHexagramName } from '@/lib/iching/hexagram';
import type { Hexagram, LineValue } from '@/types/iching';

interface CoinCastingProps {
  question: string;
  onComplete: (hexagram: Hexagram) => void;
}

type CoinResult = 'heads' | 'tails';
type CastingState = 'waiting' | 'casting' | 'revealing' | 'complete';

interface LineResult {
  coins: [CoinResult, CoinResult, CoinResult];
  value: LineValue;
  headsCount: number;
}

export default function CoinCasting({
  question,
  onComplete,
}: CoinCastingProps) {
  const [castingState, setCastingState] = useState<CastingState>('waiting');
  const [currentLine, setCurrentLine] = useState(0);
  const [lines, setLines] = useState<LineResult[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);

  const calculateLineValue = (headsCount: number): LineValue => {
    switch (headsCount) {
      case 3:
        return 9; // old yang (changing)
      case 2:
        return 7; // young yang (stable)
      case 1:
        return 8; // young yin (stable)
      case 0:
        return 6; // old yin (changing)
      default:
        return 7; // fallback
    }
  };

  const getLineDescription = (value: LineValue) => {
    switch (value) {
      case 6:
        return {
          name: 'Old Yin',
          symbol: '⚋',
          changing: true,
          description: 'Broken line, changing to solid',
        };
      case 7:
        return {
          name: 'Young Yang',
          symbol: '⚊',
          changing: false,
          description: 'Solid line, stable',
        };
      case 8:
        return {
          name: 'Young Yin',
          symbol: '⚋',
          changing: false,
          description: 'Broken line, stable',
        };
      case 9:
        return {
          name: 'Old Yang',
          symbol: '⚊',
          changing: true,
          description: 'Solid line, changing to broken',
        };
    }
  };

  const castCoins = useCallback(async () => {
    setIsAnimating(true);

    // Simulate coin casting animation delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Generate three random coin results
    const coins: [CoinResult, CoinResult, CoinResult] = [
      Math.random() < 0.5 ? 'heads' : 'tails',
      Math.random() < 0.5 ? 'heads' : 'tails',
      Math.random() < 0.5 ? 'heads' : 'tails',
    ];

    const headsCount = coins.filter(coin => coin === 'heads').length;
    const value = calculateLineValue(headsCount);

    const newLine: LineResult = { coins, value, headsCount };
    const newLines = [...lines, newLine];
    setLines(newLines);
    setIsAnimating(false);

    if (currentLine === 5) {
      // All 6 lines cast, generate hexagram
      setCastingState('revealing');

      // Extract line values for hexagram
      const lineValues = newLines.map(line => line.value) as [
        LineValue,
        LineValue,
        LineValue,
        LineValue,
        LineValue,
        LineValue,
      ];

      // Calculate hexagram number using our backend logic
      const generatedHexagram = generateHexagram();
      const hexagramName = getHexagramName(generatedHexagram.number);

      // Create hexagram with our actual cast lines but use generated number for consistency
      const hexagram: Hexagram = {
        number: generatedHexagram.number,
        name: hexagramName,
        lines: lineValues,
        changingLines: newLines
          .map((line, index) => ({ line, index }))
          .filter(({ line }) => line.value === 6 || line.value === 9)
          .map(({ index }) => index + 1),
      };

      // Show result after extended delay for deep contemplative spiritual experience
      setTimeout(() => {
        setCastingState('complete');
        onComplete(hexagram);
      }, 12000);
    } else {
      setCurrentLine(currentLine + 1);
    }
  }, [currentLine, lines, onComplete]);

  const startCasting = () => {
    setCastingState('casting');
    setCurrentLine(0);
    setLines([]);
    // Automatically start the first coin cast
    setTimeout(() => castCoins(), 100);
  };

  const FengShuiCoin = ({
    coinNum,
    isActive,
    result,
  }: {
    coinNum: number;
    isActive: boolean;
    result?: CoinResult;
  }) => (
    <div
      className={`relative h-20 w-20 transition-transform duration-1000 ${
        isActive ? 'animate-bounce' : ''
      }`}
      style={{
        animationDelay: `${coinNum * 100}ms`,
        transform: isActive ? 'rotateY(720deg)' : 'rotateY(0deg)',
      }}
    >
      {/* Outer coin circle */}
      <div className="h-20 w-20 rounded-full border-2 border-earth-brown bg-gradient-to-br from-sunset-gold via-earth-brown to-sunset-gold shadow-lg">
        {/* Inner square hole - traditional feng shui design */}
        <div className="relative flex h-full w-full items-center justify-center">
          <div className="flex h-6 w-6 items-center justify-center border border-earth-brown/50 bg-yin">
            {/* Traditional Chinese characters or symbols */}
            <div className="text-xs font-bold text-yang">
              {result === 'heads' ? '陽' : result === 'tails' ? '陰' : '易'}
            </div>
          </div>

          {/* Outer ring inscriptions - traditional Chinese coin markings */}
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Top character */}
            <div className="absolute top-1 text-xs font-bold text-yin">康</div>
            {/* Right character */}
            <div className="absolute right-1 text-xs font-bold text-yin">
              熙
            </div>
            {/* Bottom character */}
            <div className="absolute bottom-1 text-xs font-bold text-yin">
              通
            </div>
            {/* Left character */}
            <div className="absolute left-1 text-xs font-bold text-yin">寶</div>
          </div>
        </div>
      </div>
    </div>
  );

  const CoinAnimation = ({ isActive }: { isActive: boolean }) => (
    <div className="mb-8 flex justify-center space-x-6">
      {[1, 2, 3].map(coinNum => (
        <FengShuiCoin key={coinNum} coinNum={coinNum} isActive={isActive} />
      ))}
    </div>
  );

  if (castingState === 'waiting') {
    return (
      <div className="mx-auto max-w-2xl">
        <Card variant="elevated">
          <CardHeader>
            <CardTitle className="text-center">
              Ready to Cast the Coins
            </CardTitle>
            <p className="text-center text-soft-gray">
              Your question: <em>&ldquo;{question}&rdquo;</em>
            </p>
          </CardHeader>
          <CardContent className="text-center">
            <CoinAnimation isActive={false} />

            <div className="mb-6">
              <p className="mb-4 text-ink-black">
                In the traditional I Ching method, three ancient Chinese feng
                shui coins are cast six times to create a hexagram. Each cast
                determines one line of your hexagram, from bottom to top.
              </p>
              <div className="space-y-2 text-sm text-gentle-silver">
                <p>
                  • <strong>3 Yang (陽)</strong> = Old Yang (⚊) - changing line
                </p>
                <p>
                  • <strong>2 Yang (陽)</strong> = Young Yang (⚊) - stable line
                </p>
                <p>
                  • <strong>1 Yang (陽)</strong> = Young Yin (⚋) - stable line
                </p>
                <p>
                  • <strong>0 Yang (陽)</strong> = Old Yin (⚋) - changing line
                </p>
              </div>
              <p className="mt-3 text-xs text-gentle-silver">
                <em>康熙通寶</em> - Traditional Kangxi Emperor coins (1661-1722)
              </p>
            </div>

            <Button onClick={startCasting} size="lg" className="min-w-48">
              Cast the Coins
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (castingState === 'casting') {
    const currentLineResult = lines[lines.length - 1];

    return (
      <div className="mx-auto max-w-2xl">
        <Card variant="elevated">
          <CardHeader>
            <CardTitle className="text-center">
              Casting Line {currentLine + 1} of 6
            </CardTitle>
            <p className="text-center text-soft-gray">
              Focus on your question as the coins reveal your guidance
            </p>
          </CardHeader>
          <CardContent className="text-center">
            <CoinAnimation isActive={isAnimating} />

            {/* Show result after animation */}
            {currentLineResult && !isAnimating && (
              <div className="mb-6 rounded-lg bg-morning-mist/30 p-4">
                <div className="mb-4 flex justify-center space-x-4">
                  {currentLineResult.coins.map((coin, index) => (
                    <FengShuiCoin
                      key={index}
                      coinNum={index + 1}
                      isActive={false}
                      result={coin}
                    />
                  ))}
                </div>
                <p className="font-medium text-mountain-stone">
                  {currentLineResult.headsCount} Heads ={' '}
                  {getLineDescription(currentLineResult.value).name}
                </p>
                <p className="text-sm text-soft-gray">
                  {getLineDescription(currentLineResult.value).description}
                </p>
                <div className="mt-3 text-4xl">
                  {getLineDescription(currentLineResult.value).symbol}
                </div>
              </div>
            )}

            {/* Lines cast so far */}
            {lines.length > 0 && (
              <div className="mb-6">
                <h4 className="mb-3 text-sm font-medium text-mountain-stone">
                  Lines Cast (bottom to top):
                </h4>
                <div className="flex justify-center space-x-2">
                  {lines.map((line, index) => (
                    <div key={index} className="text-center">
                      <div className="mb-1 text-2xl">
                        {getLineDescription(line.value).symbol}
                      </div>
                      <div className="text-xs text-soft-gray">
                        Line {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!isAnimating && currentLine < 6 && (
              <Button onClick={castCoins} size="lg">
                Cast Next Line
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (castingState === 'revealing' || castingState === 'complete') {
    return (
      <div className="mx-auto max-w-2xl">
        <Card variant="elevated">
          <CardHeader>
            <CardTitle className="text-center">
              {castingState === 'revealing'
                ? 'Revealing Your Hexagram...'
                : 'Your Hexagram is Complete'}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="mb-6">
              <div className="mb-4 text-6xl">
                {lines
                  .map((line, index) => (
                    <div key={index}>
                      {getLineDescription(line.value).symbol}
                    </div>
                  ))
                  .reverse()}
              </div>
            </div>

            {castingState === 'revealing' && (
              <div className="animate-pulse text-flowing-water">
                Interpreting your guidance...
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}
