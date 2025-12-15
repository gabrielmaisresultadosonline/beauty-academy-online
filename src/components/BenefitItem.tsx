import { Check } from 'lucide-react';

interface BenefitItemProps {
  title: string;
  description: string;
}

const BenefitItem = ({ title, description }: BenefitItemProps) => {
  return (
    <div className="flex gap-4 items-start">
      <div className="w-8 h-8 gradient-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
        <Check className="w-5 h-5 text-primary-foreground" />
      </div>
      <div>
        <h4 className="font-semibold text-foreground mb-1">{title}</h4>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
    </div>
  );
};

export default BenefitItem;
