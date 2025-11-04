import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import * as Icons from "lucide-react";
import { ArrowRight, ChevronLeft, ChevronRight, LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface Card {
  id?: string;
  category: string;
  icon?: LucideIcon;
  title: string;
  subtitle: string;
  teaser: string;
  link_type?: string;
  link_value: string;
  background_image: string;
  order_index?: number;
}

export const Services = () => {
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isDraggingSlider, setIsDraggingSlider] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const touchStartXRef = useRef<number>(0);
  const touchMoveDistanceRef = useRef<number>(0);

  useEffect(() => {
    const checkTouchDevice = () => {
      setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };
    checkTouchDevice();
  }, []);

  useEffect(() => {
    const fetchHomepageCards = async () => {
      const { data: homepageCards } = await supabase
        .from('service_cards')
        .select('*')
        .eq('is_active', true)
        .order('order_index');

      if (homepageCards && homepageCards.length > 0) {
        const mappedCards: Card[] = homepageCards.map((card) => {
          const IconComponent = (Icons as Record<string, LucideIcon>)[card.icon] || Icons.FileText;

          return {
            id: card.id,
            category: card.category,
            icon: IconComponent,
            title: card.title,
            subtitle: card.subtitle,
            teaser: card.teaser,
            link_type: card.link_type,
            link_value: card.link_value,
            background_image: card.background_image,
            order_index: card.order_index
          };
        });

        setCards(mappedCards);
      }
    };

    fetchHomepageCards();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!scrollContainerRef.current) return;

      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 10);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);

      const maxScroll = scrollWidth - clientWidth;
      const progress = maxScroll > 0 ? scrollLeft / maxScroll : 0;
      setScrollProgress(progress);
    };

    const container = scrollContainerRef.current;
    if (container) {
      handleScroll();
      container.addEventListener('scroll', handleScroll);
      window.addEventListener('resize', handleScroll);

      let touchStartX = 0;
      let touchStartY = 0;
      const handleTouchStart = (e: TouchEvent) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      };

      const handleTouchMove = (e: TouchEvent) => {
        if (!container) return;
        const touchEndX = e.touches[0].clientX;
        const touchEndY = e.touches[0].clientY;
        const deltaX = touchStartX - touchEndX;
        const deltaY = touchStartY - touchEndY;

        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          e.preventDefault();
        }
      };

      container.addEventListener('touchstart', handleTouchStart, { passive: true });
      container.addEventListener('touchmove', handleTouchMove, { passive: false });

      return () => {
        container.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', handleScroll);
        container.removeEventListener('touchstart', handleTouchStart);
        container.removeEventListener('touchmove', handleTouchMove);
      };
    }
  }, [cards]);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;

    const scrollAmount = 350;
    const newScrollLeft = direction === 'left'
      ? scrollContainerRef.current.scrollLeft - scrollAmount
      : scrollContainerRef.current.scrollLeft + scrollAmount;

    scrollContainerRef.current.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth'
    });
  };

  const getLinkPath = (card: Card) => {
    if (card.link_type === 'case-study') {
      return `/case-studies/${card.link_value}`;
    } else if (card.link_type === 'external') {
      return card.link_value;
    } else {
      return card.link_value;
    }
  };

  const handleSliderPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDraggingSlider(true);
    const target = e.currentTarget;
    target.setPointerCapture(e.pointerId);
    updateScrollFromSliderPosition(e);
  };

  const handleSliderPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDraggingSlider) {
      updateScrollFromSliderPosition(e);
    }
  };

  const handleSliderPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDraggingSlider(false);
    const target = e.currentTarget;
    target.releasePointerCapture(e.pointerId);
  };

  const updateScrollFromSliderPosition = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!scrollContainerRef.current || !sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));

    const { scrollWidth, clientWidth } = scrollContainerRef.current;
    const maxScroll = scrollWidth - clientWidth;
    scrollContainerRef.current.scrollLeft = percentage * maxScroll;
  };

  return (
    <section id="services" className="py-16 bg-muted/30 overflow-hidden" itemScope itemType="https://schema.org/Service">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
            Unsere Leistungen & Erfolge
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto" itemProp="description">
            Klar strukturiert. Dialogfähig. Auf Ihre Herausforderungen zugeschnitten.
          </p>
        </div>

        {/* Horizontal scrolling container */}
        <div className="relative -mx-4 px-4">
          {/* Left Navigation Arrow */}
          {showLeftArrow && (
            <button
              onClick={() => scroll('left')}
              className="hidden md:flex absolute left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 items-center justify-center rounded-full bg-white/90 hover:bg-white shadow-lg transition-all duration-300 hover:scale-110"
              aria-label="Vorherige Kacheln"
            >
              <ChevronLeft className="w-6 h-6 text-gray-800" />
            </button>
          )}

          {/* Right Navigation Arrow */}
          {showRightArrow && (
            <button
              onClick={() => scroll('right')}
              className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 items-center justify-center rounded-full bg-white/90 hover:bg-white shadow-lg transition-all duration-300 hover:scale-110"
              aria-label="Nächste Kacheln"
            >
              <ChevronRight className="w-6 h-6 text-gray-800" />
            </button>
          )}

          {/* Left Fade Overlay */}
          {showLeftArrow && (
            <div className="hidden md:block absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-muted/30 to-transparent z-10 pointer-events-none" />
          )}

          {/* Right Fade Overlay */}
          {showRightArrow && (
            <div className="hidden md:block absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-muted/30 to-transparent z-10 pointer-events-none" />
          )}

          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide scroll-smooth"
          >
            {cards.map((card, index) => (
              <Link
                key={card.id || index}
                to={getLinkPath(card)}
                className="group relative flex-shrink-0 overflow-hidden rounded-lg cursor-pointer snap-start
                  w-[325px] aspect-[3/4]"
                onMouseEnter={() => !isTouchDevice && setActiveCard(index)}
                onMouseLeave={() => !isTouchDevice && setActiveCard(null)}
                onTouchStart={(e) => {
                  touchStartXRef.current = e.touches[0].clientX;
                  touchMoveDistanceRef.current = 0;
                }}
                onTouchMove={(e) => {
                  const touchX = e.touches[0].clientX;
                  touchMoveDistanceRef.current = Math.abs(touchX - touchStartXRef.current);
                }}
                onClick={(e) => {
                  if (isTouchDevice) {
                    if (touchMoveDistanceRef.current > 10) {
                      e.preventDefault();
                      return;
                    }
                    if (activeCard === index) {
                      return;
                    }
                    e.preventDefault();
                    setActiveCard(index);
                  }
                }}
              >
                {/* Background Image */}
                <div
                  className={`absolute inset-0 bg-cover bg-center transition-transform duration-700 ${
                    !isTouchDevice ? 'group-hover:scale-110' : ''
                  }`}
                  style={{
                    backgroundImage: `url(${card.background_image})`
                  }}
                />

                {/* Overlay - switches between dark and light based on theme */}
                <div className={`absolute inset-0 bg-gradient-to-t transition-all duration-500
                  from-white/90 via-white/50 to-white/30 ${!isTouchDevice ? 'group-hover:from-white/95 group-hover:via-white/80 group-hover:to-white/60' : ''}
                  dark:from-black/90 dark:via-black/50 dark:to-black/30 ${!isTouchDevice ? 'dark:group-hover:from-black/95 dark:group-hover:via-black/80 dark:group-hover:to-black/60' : ''}`} />

                {/* Category Badge - Top Right */}
                <div className="absolute top-6 right-6 z-10">
                  <Badge variant="secondary" className="bg-[rgb(34,38,42)]/20 text-[rgb(34,38,42)] border-[rgb(34,38,42)]/30 dark:bg-white/20 dark:text-white dark:border-white/30 backdrop-blur-sm">
                    {card.category}
                  </Badge>
                </div>

                {/* Icon - Top Left */}
                {card.icon && (
                  <div className={`absolute top-6 left-6 p-3 rounded-lg backdrop-blur-sm border transition-all duration-500
                    bg-[rgb(34,38,42)]/10 border-[rgb(34,38,42)]/20 ${!isTouchDevice ? 'group-hover:bg-[rgb(34,38,42)]/20' : ''}
                    dark:bg-white/10 dark:border-white/20 ${!isTouchDevice ? 'dark:group-hover:bg-white/20' : ''}`}>
                    <card.icon className="w-6 h-6 text-[rgb(34,38,42)] dark:text-white" />
                  </div>
                )}

                {/* Title - Always visible at bottom */}
                <div className={`absolute bottom-0 left-0 right-0 p-6 transition-all duration-500 ${!isTouchDevice ? 'group-hover:pb-8' : ''}`}>
                  <h3 className={`text-[rgb(34,38,42)] dark:text-white text-xl font-bold mb-2 tracking-tight transition-all duration-500 ${!isTouchDevice ? 'group-hover:text-2xl' : ''}`}>
                    {card.title}
                  </h3>
                  <p className="text-[rgb(34,38,42)]/80 dark:text-white/80 text-sm font-light transition-opacity duration-300">
                    {card.subtitle}
                  </p>
                </div>

                {/* Content Overlay - Revealed on hover/click */}
                <div
                  className={`absolute inset-0 bg-gradient-to-t flex flex-col justify-end p-6 transition-all duration-500
                    from-white/95 via-white/90 to-white/80
                    dark:from-black/95 dark:via-black/90 dark:to-black/80 ${
                    activeCard === index
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-4 pointer-events-none'
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      {card.icon && (
                        <div className="p-2 rounded-lg backdrop-blur-sm flex-shrink-0
                          bg-[rgb(34,38,42)]/20 dark:bg-white/20">
                          <card.icon className="w-5 h-5 text-[rgb(34,38,42)] dark:text-white" />
                        </div>
                      )}
                      <div>
                        <h3 className="text-[rgb(34,38,42)] dark:text-white text-lg font-bold mb-1 tracking-tight">
                          {card.title}
                        </h3>
                        <p className="text-[rgb(34,38,42)]/70 dark:text-white/70 text-xs font-light">
                          {card.subtitle}
                        </p>
                      </div>
                    </div>

                    <p className="text-[rgb(34,38,42)]/90 dark:text-white/90 text-sm leading-relaxed">
                      {card.teaser}
                    </p>

                    <Button
                      variant="secondary"
                      size="sm"
                      className="w-full group/btn
                        bg-[rgb(34,38,42)]/20 hover:bg-[rgb(34,38,42)]/30 text-[rgb(34,38,42)] border-[rgb(34,38,42)]/20
                        dark:bg-white/20 dark:hover:bg-white/30 dark:text-white dark:border-white/20"
                    >
                      Mehr erfahren
                      <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Horizontal Slider */}
          <div className="max-w-md mx-auto mt-8 px-4">
            <div
              ref={sliderRef}
              className="relative h-2 w-full cursor-pointer rounded-full bg-secondary"
              onPointerDown={handleSliderPointerDown}
              onPointerMove={handleSliderPointerMove}
              onPointerUp={handleSliderPointerUp}
              onPointerCancel={handleSliderPointerUp}
            >
              <div
                className={`absolute top-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-primary shadow-md transition-transform ${
                  isDraggingSlider ? 'scale-125' : 'scale-100'
                }`}
                style={{
                  left: `calc(${scrollProgress * 100}% - 8px)`,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};