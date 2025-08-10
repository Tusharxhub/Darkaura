import { MorphingText } from "@/components/textAnimations/morphing-text";

interface PageHeaderProps {
  texts: readonly string[];
  className?: string;
}

export const PageHeader = ({ texts, className = "" }: PageHeaderProps) => (
  <div className={`mb-12 ${className}`}>
    <MorphingText
      className="text-fluid-page-title font-bold text-center text-balance"
      texts={texts}
    />
  </div>
);
