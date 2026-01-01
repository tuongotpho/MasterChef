
import { put } from '@vercel/blob';

/**
 * Upload file ảnh lên Vercel Blob
 * Lưu ý: Client-side upload yêu cầu BLOB_READ_WRITE_TOKEN trong Environment Variables
 */
export const uploadMealImage = async (file: File): Promise<string> => {
  try {
    // Tạo tên file duy nhất để tránh trùng lặp
    const filename = `meal-${Date.now()}-${file.name}`;
    
    // Upload trực tiếp từ client (yêu cầu cấu hình token trên Vercel)
    const blob = await put(filename, file, {
      access: 'public',
      // Token này sẽ được Vercel tự động nhận diện từ biến môi trường BLOB_READ_WRITE_TOKEN
    });

    return blob.url;
  } catch (error) {
    console.error("Error uploading to Vercel Blob:", error);
    throw new Error("Không thể tải ảnh lên bộ lưu trữ đám mây.");
  }
};
