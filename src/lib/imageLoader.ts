const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const STORAGE_BASE = `${SUPABASE_URL}/storage/v1/object/public/images`;

export const getImageUrl = (imageName: string): string => {
  if (!imageName) return '/placeholder.svg';

  if (imageName.startsWith('http://') || imageName.startsWith('https://')) {
    return imageName;
  }

  return `${STORAGE_BASE}/${imageName}`;
};

export const getOptimizedImageUrl = (imageName: string, width?: number): string => {
  const baseUrl = getImageUrl(imageName);

  if (width && baseUrl.includes('supabase.co')) {
    return `${baseUrl}?width=${width}&quality=80`;
  }

  return baseUrl;
};
