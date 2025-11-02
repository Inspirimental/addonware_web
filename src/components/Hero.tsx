import { Button } from "@/components/ui/button";
import { AnimatedClaim } from "./AnimatedClaim";
import { ArrowRight } from "lucide-react";

interface HeroProps {
  onConfiguratorOpen: () => void;
}

export const Hero = ({ onConfiguratorOpen }: HeroProps) => {
  return (
    <section className="relative min-h-[80vh] flex items-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src="/HeaderHero2.webp"
          alt="Digitale Transformation und IT-Beratung - Professionelles Team bei der strategischen Planung"
          className="w-full h-full object-cover object-right"
          loading="eager"
          fetchpriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-transparent" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-[1.2] tracking-tight">
            Transformation beginnt mit
            <AnimatedClaim />
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl">
            <span className="font-semibold">add</span><span className="text-primary font-semibold">on</span><span className="font-semibold">ware</span> begleitet Organisationen, die etwas bewegen wollen.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              size="lg" 
              onClick={onConfiguratorOpen}
              className="text-lg px-8 py-6 shadow-elegant hover:shadow-lg transition-all"
            >
              Wo steht Ihr Unternehmen?
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="text-lg px-8 py-6"
              onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Unsere Leistungen
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};