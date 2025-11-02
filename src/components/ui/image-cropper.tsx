import React, { useRef, useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { ZoomIn, ZoomOut, RotateCw, Upload, Check } from "lucide-react";

interface ImageCropperProps {
  onImageChange: (croppedImageDataUrl: string | null) => void;
  onGetCurrentCrop?: React.MutableRefObject<(() => string | null) | null>;
  initialImage?: string;
  cropSize?: number;
}

export const ImageCropper: React.FC<ImageCropperProps> = ({ 
  onImageChange, 
  onGetCurrentCrop,
  initialImage, 
  cropSize = 200 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Expose getCurrentCrop function to parent
  useEffect(() => {
    if (onGetCurrentCrop) {
      onGetCurrentCrop.current = getCurrentCrop;
    }
  }, [onGetCurrentCrop, image, scale, position]);

  useEffect(() => {
    if (initialImage) {
      loadImageFromUrl(initialImage);
    }
  }, [initialImage]);

  const loadImageFromUrl = (url: string) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      setImage(img);
      resetImagePosition(img);
    };
    img.src = url;
  };

  const resetImagePosition = (img: HTMLImageElement) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Calculate initial scale to fill the entire circle
    const imgAspect = img.width / img.height;
    let initialScale;
    
    if (imgAspect > 1) {
      // Landscape image - scale by height
      initialScale = cropSize / img.height;
    } else {
      // Portrait or square image - scale by width
      initialScale = cropSize / img.width;
    }
    
    setScale(initialScale);
    setPosition({ x: 0, y: 0 });
  };

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || !image) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Calculate image dimensions
    const imgWidth = image.width * scale;
    const imgHeight = image.height * scale;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    // Draw image
    ctx.drawImage(
      image,
      centerX - imgWidth / 2 + position.x,
      centerY - imgHeight / 2 + position.y,
      imgWidth,
      imgHeight
    );
    
    // Create overlay that covers everything except the circle
    ctx.save();
    
    // First, create a clipping path for the circle (inverted)
    ctx.beginPath();
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.arc(centerX, centerY, cropSize / 2, 0, 2 * Math.PI, true); // true for counter-clockwise creates inverted clip
    ctx.clip();
    
    // Draw overlay only in the clipped area (outside the circle)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.restore();
  }, [image, scale, position, cropSize]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setImage(img);
        resetImagePosition(img);
        // Inform parent that an image is present (clears deletion state)
        try { onImageChange(img.src); } catch {}
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const adjustScale = (delta: number) => {
    setScale(prev => Math.max(0.1, Math.min(3, prev + delta)));
  };

  const getCroppedImage = () => {
    const canvas = canvasRef.current;
    if (!canvas || !image) return null;

    // Create crop canvas - square, not circular
    const cropCanvas = document.createElement('canvas');
    const cropCtx = cropCanvas.getContext('2d');
    if (!cropCtx) return null;

    cropCanvas.width = cropSize;
    cropCanvas.height = cropSize;

    // Calculate the center of the canvas
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    // Calculate image position and size
    const imgWidth = image.width * scale;
    const imgHeight = image.height * scale;
    
    // Calculate the top-left corner of the image
    const imgX = centerX - imgWidth / 2 + position.x;
    const imgY = centerY - imgHeight / 2 + position.y;
    
    // Calculate crop area relative to the image
    const cropX = centerX - cropSize / 2;
    const cropY = centerY - cropSize / 2;
    
    // Calculate source coordinates on the original image
    const sourceX = (cropX - imgX) / scale;
    const sourceY = (cropY - imgY) / scale;
    const sourceWidth = cropSize / scale;
    const sourceHeight = cropSize / scale;
    
    // Draw the cropped portion (square, not circular)
    cropCtx.drawImage(
      image,
      sourceX, sourceY, sourceWidth, sourceHeight,
      0, 0, cropSize, cropSize
    );
    
    return cropCanvas.toDataURL('image/png');
  };

  const getCurrentCrop = () => {
    const croppedDataUrl = getCroppedImage();
    return croppedDataUrl;
  };

  const handleClear = () => {
    console.log('Clearing image');
    setImage(null);
    setScale(1);
    setPosition({ x: 0, y: 0 });
    onImageChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="image-upload">Profilbild hochladen</Label>
        <div className="flex gap-2">
          <Input
            id="image-upload"
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="flex-1"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {image && (
        <Card>
          <CardContent className="p-4">
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                Ziehen Sie das Bild um es zu positionieren. Verwenden Sie die Zoom-Buttons für die Größe.
              </div>
              
              <div className="flex justify-center">
                <canvas
                  ref={canvasRef}
                  width={cropSize}
                  height={cropSize}
                  className="border border-gray-200 cursor-move"
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                />
              </div>
              
              <div className="flex justify-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => adjustScale(-0.1)}
                >
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => adjustScale(0.1)}
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleClear}
                >
                  Löschen
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};