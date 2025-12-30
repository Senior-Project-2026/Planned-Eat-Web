import React, { useEffect, useRef } from 'react';
import { Platform, View, ViewProps } from 'react-native';
import Animated, {
    Easing,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withTiming
} from 'react-native-reanimated';

interface SectionTransitionProps extends ViewProps {
  children: React.ReactNode;
  /** Animation type for section entrance */
  variant?: 'fade-up' | 'fade-scale' | 'slide-in' | 'zoom-fade';
  /** Animation duration in ms */
  duration?: number;
}

export function SectionTransition({
  children,
  variant = 'fade-up',
  duration = 600,
  style,
  ...props
}: SectionTransitionProps) {
  const progress = useSharedValue(0);
  const viewRef = useRef<View>(null);

  useEffect(() => {
    if (Platform.OS !== 'web') {
      // On non-web platforms, animate immediately
      progress.value = withTiming(1, { 
        duration, 
        easing: Easing.out(Easing.cubic) 
      });
      return;
    }

    // Web: Use Intersection Observer - bidirectional
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Entering viewport - animate in
            progress.value = withTiming(1, { 
              duration, 
              easing: Easing.out(Easing.cubic) 
            });
          } else {
            // Leaving viewport - animate out
            progress.value = withTiming(0, { 
              duration: duration * 0.5, // Faster exit
              easing: Easing.in(Easing.cubic) 
            });
          }
        });
      },
      { 
        threshold: 0.1,
        rootMargin: '0px 0px -5% 0px'
      }
    );

    const timer = setTimeout(() => {
      if (viewRef.current) {
        const element = viewRef.current as unknown as Element;
        if (element && 'nodeType' in element) {
          observer.observe(element);
        }
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [duration]);

  const animatedStyle = useAnimatedStyle(() => {
    const p = progress.value;
    
    switch (variant) {
      case 'fade-up':
        return {
          opacity: p,
          transform: [
            { translateY: interpolate(p, [0, 1], [50, 0]) },
          ],
        };
      
      case 'fade-scale':
        return {
          opacity: p,
          transform: [
            { scale: interpolate(p, [0, 1], [0.96, 1]) },
            { translateY: interpolate(p, [0, 1], [25, 0]) },
          ],
        };
      
      case 'slide-in':
        return {
          opacity: p,
          transform: [
            { translateX: interpolate(p, [0, 1], [-80, 0]) },
          ],
        };
      
      case 'zoom-fade':
        return {
          opacity: p,
          transform: [
            { scale: interpolate(p, [0, 1], [0.92, 1]) },
          ],
        };
      
      default:
        return {
          opacity: p,
        };
    }
  });

  return (
    <Animated.View
      ref={viewRef}
      style={[animatedStyle, style]}
      {...props}
    >
      {children}
    </Animated.View>
  );
}

