import React, { useEffect, useState, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Sparkles, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import Button from './Button';
import styles from './OfferCarousel.module.css';

interface Offer {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  button_text?: string;
  link_url?: string;
}

const OfferCarousel = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 5000 })]);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const fetchOffers = useCallback(async () => {
    const { data, error } = await (supabase as any).from('offers')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (data) setOffers(data as any as Offer[]);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchOffers();
  }, [fetchOffers]);

  const handleCtaClick = (offer: Offer, e?: React.MouseEvent) => {
    e?.stopPropagation();
    
    // Priority: If the button text mentions "Reserver", go to booking page
    if (offer.button_text?.toLowerCase().includes('reser')) {
      navigate('/booking');
      return;
    }

    // Otherwise, follow the link_url if provided
    if (offer.link_url) {
      if (offer.link_url.startsWith('http')) {
        window.open(offer.link_url, '_blank');
      } else {
        navigate(offer.link_url);
      }
    }
  };

  const displayOffers = offers;

  if (isLoading) return <div className={styles.skeleton} />;
  if (displayOffers.length === 0) return null;

  return (
    <div className={styles.viewport} ref={emblaRef}>
      <div className={styles.container}>
        {displayOffers.map((offer) => (
          <div 
            className={styles.slide} 
            key={offer.id}
            onClick={(e) => handleCtaClick(offer, e)}
            style={{ cursor: 'pointer' }}
          >
            <div className={styles.card}>
              <div className={styles.content}>
                <span className={styles.badge}>
                  <Sparkles size={14} />
                  Offre Spéciale
                </span>
                <h2 className={styles.title}>{offer.title}</h2>
                <p className={styles.description}>{offer.description}</p>
                {offer.button_text && (
                  <Button 
                    size="sm" 
                    className={styles.cta}
                    onClick={(e) => handleCtaClick(offer, e)}
                  >
                    {offer.button_text}
                    {offer.link_url?.startsWith('http') && <ExternalLink size={14} />}
                  </Button>
                )}
              </div>

              {offer.image_url && (
                <div className={styles.imageBox}>
                  <img src={offer.image_url} alt={offer.title} className={styles.image} />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {displayOffers.length > 1 && (
        <>
          <button className={styles.prevBtn} onClick={scrollPrev}>
            <ChevronLeft size={20} />
          </button>
          <button className={styles.nextBtn} onClick={scrollNext}>
            <ChevronRight size={20} />
          </button>
        </>
      )}
    </div>
  );
};

export default OfferCarousel;
