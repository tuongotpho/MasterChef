
import { put } from '@vercel/blob';

/**
 * Lấy token từ nhiều nguồn: 
 * 1. process.env (nếu có build step)
 * 2. localStorage (do người dùng dán vào giao diện)
 */
const getBlobToken = () => {
  return (window as any).process?.env?.BLOB_READ_WRITE_TOKEN || localStorage.getItem('cheflog_blob_token');
};

export const uploadMealImage = async (file: File): Promise<string> => {
  const token = getBlobToken();
  
  if (!token) {
    throw new Error("MISSING_TOKEN");
  }

  try {
    const filename = `meal-${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    
    const blob = await put(filename, file, {
      access: 'public',
      token: token, // Truyền token trực tiếp vào đây
    });

    if (!blob || !blob.url) {
      throw new Error("Không nhận được URL từ bộ lưu trữ.");
    }

    return blob.url;
  } catch (error) {
    console.error("Error uploading to Vercel Blob:", error);
    throw error;
  }
};
