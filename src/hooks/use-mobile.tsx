import * as React from 'react';

const MOBILE_BREAKPOINT = 768;
const TABLET_BREAKPOINT = 1024;

type DeviceType = 'mobile' | 'tablet' | 'desktop';

export function useDeviceDetection() {
  const [deviceType, setDeviceType] = React.useState<DeviceType>('desktop');
  const [isTouchDevice, setIsTouchDevice] = React.useState(false);

  React.useEffect(() => {
    // Screen size detection
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < MOBILE_BREAKPOINT) {
        setDeviceType('mobile');
      } else if (width < TABLET_BREAKPOINT) {
        setDeviceType('tablet');
      } else {
        setDeviceType('desktop');
      }
    };

    // Touch device detection
    // Type augmentation for IE-specific property
    interface Navigator {
      msMaxTouchPoints?: number;
    }

    setIsTouchDevice(
      'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        (navigator.msMaxTouchPoints ?? 0) > 0
    );

    // Initial check
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    isMobile: deviceType === 'mobile',
    isTablet: deviceType === 'tablet',
    isDesktop: deviceType === 'desktop',
    isTouchDevice,
    deviceType,
  };
}

// Backwards compatibility
export function useIsMobile() {
  const { isMobile } = useDeviceDetection();
  return isMobile;
}
