import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface FacebookPixelProps {
  productSlug: string;
}

export function FacebookPixel({ productSlug }: FacebookPixelProps) {
  const [pixelCode, setPixelCode] = useState<string | null>(null);

  useEffect(() => {
    const loadPixel = async () => {
      const { data } = await supabase
        .from('platform_settings')
        .select('facebook_pixel_code')
        .eq('product_slug', productSlug)
        .maybeSingle();

      if (data?.facebook_pixel_code) {
        setPixelCode(data.facebook_pixel_code);
      }
    };

    loadPixel();
  }, [productSlug]);

  useEffect(() => {
    if (!pixelCode) return;

    // Create a container for the pixel script
    const container = document.createElement('div');
    container.innerHTML = pixelCode;
    
    // Extract and execute scripts
    const scripts = container.querySelectorAll('script');
    scripts.forEach((script) => {
      const newScript = document.createElement('script');
      if (script.src) {
        newScript.src = script.src;
      } else {
        newScript.textContent = script.textContent;
      }
      document.head.appendChild(newScript);
    });

    // Add noscript content
    const noscripts = container.querySelectorAll('noscript');
    noscripts.forEach((noscript) => {
      const newNoscript = document.createElement('noscript');
      newNoscript.innerHTML = noscript.innerHTML;
      document.head.appendChild(newNoscript);
    });

    return () => {
      // Cleanup on unmount (optional)
    };
  }, [pixelCode]);

  return null;
}

// Helper to track custom events with retry logic
export function trackFacebookEvent(eventName: string, params?: Record<string, any>) {
  const track = () => {
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', eventName, params);
      console.log(`[FB Pixel] Event tracked: ${eventName}`, params);
      return true;
    }
    return false;
  };

  // Try immediately
  if (track()) return;

  // Retry up to 5 times with increasing delays
  let attempts = 0;
  const maxAttempts = 5;
  const retry = () => {
    attempts++;
    if (track()) return;
    if (attempts < maxAttempts) {
      setTimeout(retry, 500 * attempts);
    } else {
      console.warn(`[FB Pixel] Failed to track event after ${maxAttempts} attempts: ${eventName}`);
    }
  };
  setTimeout(retry, 500);
}
