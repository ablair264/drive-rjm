const TARGET_WIDTH = 1600;
const TARGET_HEIGHT = 900;

export const convertImageToWebp = (file) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = TARGET_WIDTH;
      canvas.height = TARGET_HEIGHT;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, TARGET_WIDTH, TARGET_HEIGHT);

      const imageAspect = img.width / img.height;
      const targetAspect = TARGET_WIDTH / TARGET_HEIGHT;
      let drawWidth;
      let drawHeight;
      let offsetX = 0;
      let offsetY = 0;

      if (imageAspect > targetAspect) {
        drawHeight = TARGET_HEIGHT;
        drawWidth = TARGET_HEIGHT * imageAspect;
        offsetX = (TARGET_WIDTH - drawWidth) / 2;
      } else {
        drawWidth = TARGET_WIDTH;
        drawHeight = TARGET_WIDTH / imageAspect;
        offsetY = (TARGET_HEIGHT - drawHeight) / 2;
      }

      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Unable to process image.'));
            return;
          }
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        },
        'image/webp',
        0.9
      );
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
};
