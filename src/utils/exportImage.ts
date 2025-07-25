export const exportCanvasAsImage = (
  canvas: HTMLCanvasElement,
  filename: string = 'fractal-wallpaper',
  resolution: '1080p' | '4K' = '1080p'
): void => {
  try {
    // Get the data URL from canvas
    const dataURL = canvas.toDataURL('image/png', 1.0);
    
    // Create download link
    const link = document.createElement('a');
    link.download = `${filename}-${resolution}-${Date.now()}.png`;
    link.href = dataURL;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Show success message
    showNotification(`Fractal exported as ${resolution} wallpaper!`, 'success');
  } catch (error) {
    console.error('Export failed:', error);
    showNotification('Export failed. Please try again.', 'error');
  }
};

const showNotification = (message: string, type: 'success' | 'error'): void => {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `
    fixed top-4 left-1/2 transform -translate-x-1/2 z-50 
    px-6 py-3 rounded-lg text-white font-medium
    transition-all duration-300 animate-fade-in
    ${type === 'success' 
      ? 'bg-green-500/90 border border-green-400/50' 
      : 'bg-red-500/90 border border-red-400/50'
    }
    backdrop-blur-sm shadow-lg
  `;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transform = 'translateX(-50%) translateY(-20px)';
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
};

export const generateRandomFractalParams = () => {
  return {
    center: [
      (Math.random() - 0.5) * 2,
      (Math.random() - 0.5) * 2
    ] as [number, number],
    zoom: Math.pow(10, Math.random() * 3 - 1),
    juliaC: [
      (Math.random() - 0.5) * 2,
      (Math.random() - 0.5) * 2
    ] as [number, number],
    colorShift: Math.random() * Math.PI * 2,
    animationSpeed: 0.5 + Math.random() * 1.5,
    isJulia: Math.random() > 0.5
  };
};