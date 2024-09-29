export const compressImage = (file: File, quality: number = 0.9): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = (event: ProgressEvent<FileReader>) => {
            const img = new Image();
            img.src = event.target?.result as string;

            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                if (!ctx) {
                    reject(new Error('Canvas context not found'));
                    return;
                }

                // Set canvas dimensions based on the original image dimensions
                canvas.width = img.width;
                canvas.height = img.height;

                // Draw the image on the canvas
                ctx.drawImage(img, 0, 0);

                // Convert canvas to a Base64-encoded string with the desired quality
                const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);

                resolve(compressedDataUrl);
            };

            img.onerror = (error) => reject(error);
        };

        reader.onerror = (error) => reject(error);
    });
};
