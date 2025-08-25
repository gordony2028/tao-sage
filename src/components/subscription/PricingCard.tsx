import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { SubscriptionPlan } from '@/types/subscription';

interface PricingCardProps {
  plan: SubscriptionPlan;
  featured?: boolean;
  onSelect: (planId: string) => void;
}

export default function PricingCard({
  plan,
  featured = false,
  onSelect,
}: PricingCardProps) {
  const formatPrice = (price: number, period: string) => {
    if (price === 0) return 'Free';
    return `$${price.toFixed(2)}`;
  };

  const formatPeriod = (period: string) => {
    if (period === 'forever') return 'Forever';
    return `per ${period}`;
  };

  const getButtonText = (plan: SubscriptionPlan) => {
    if (plan.id === 'free') return 'Start Free';
    if (plan.id === 'sage_plus') return 'Start Full Experience';
    return 'Start Pro Trial';
  };

  const getYearlyDiscount = (plan: SubscriptionPlan) => {
    if (plan.id === 'sage_plus') return '$59.99/year (save 30%)';
    if (plan.id === 'sage_pro') return '$149.99/year (save 30%)';
    return null;
  };

  return (
    <Card
      variant={featured ? 'elevated' : 'default'}
      className={`text-center ${
        featured ? 'relative ring-2 ring-flowing-water' : ''
      } transition-all duration-300 hover:shadow-xl`}
    >
      {featured && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 transform rounded-full bg-gradient-to-r from-flowing-water to-bamboo-green px-4 py-1 text-sm font-medium text-cloud-white">
          Most Popular
        </div>
      )}

      <CardHeader className="pb-4">
        <CardTitle className="text-xl text-mountain-stone">
          {plan.name}
        </CardTitle>
        <div className="text-center">
          <div className="mb-1 text-3xl font-bold text-mountain-stone">
            {formatPrice(plan.price, plan.period)}
          </div>
          <p className="text-sm text-soft-gray">{formatPeriod(plan.period)}</p>
        </div>
        <p className="mt-2 text-sm text-soft-gray">{plan.description}</p>
      </CardHeader>

      <CardContent className="pt-0">
        <ul className="mb-6 space-y-3">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start text-sm text-soft-gray">
              <span className="mr-2 mt-0.5 text-bamboo-green">✓</span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <Button
          variant={featured ? 'default' : 'outline'}
          onClick={() => onSelect(plan.id)}
          className="w-full"
        >
          {getButtonText(plan)}
        </Button>

        {getYearlyDiscount(plan) && (
          <p className="mt-2 text-xs text-soft-gray">
            {getYearlyDiscount(plan)}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
