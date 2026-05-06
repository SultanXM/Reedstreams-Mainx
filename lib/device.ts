export const isIOS = () => {
  if (typeof window === 'undefined') return false;
  
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
  
  // Basic iOS detection
  if (/iPad|iPhone|iPod/.test(userAgent)) {
    return true;
  }
  
  // iPad on iOS 13+ detection
  if (/Macintosh/.test(userAgent) && navigator.maxTouchPoints > 1) {
    return true;
  }
  
  return false;
};
