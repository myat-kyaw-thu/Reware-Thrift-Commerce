import { cn } from "@/lib/utils";

interface ProductPriceProps {
  value: number;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const ProductPrice = ({ value, className, size = "md" }: ProductPriceProps) => {
  const stringValue = value.toFixed(2);
  const [intValue, floatValue] = stringValue.split(".");

  const sizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  };

  const currencySizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  return (
    <p className={cn("font-semibold text-foreground", sizeClasses[size], className)}>
      <span className={cn("align-top text-muted-foreground", currencySizeClasses[size])}>$</span>
      {intValue}
      <span className={cn("align-top text-muted-foreground", currencySizeClasses[size])}>.{floatValue}</span>
    </p>
  );
};

export default ProductPrice;
