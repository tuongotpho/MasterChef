
import { put } from '@vercel/blob';

/**
 * Upload file ảnh lên Vercel Blob
 * Lưu ý: Client-side upload yêu cầu BLOB_READ_WRITE_TOKEN.
 * Trên Vercel, đảm bảo biến này đã được thêm trong Settings > Environment Variables.
 */
export const uploadMealImage = async (file: File): Promise<string> => {
  try {
    const filename = `meal-${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    
    // Thử lấy token từ window.process.env (được shim trong index.html)
    // Hoặc Vercel sẽ tự động tiêm vào nếu thông qua build step
    const blob = await put(filename, file, {
      access: 'public',
    });

    if (!blob || !blob.url) {
      throw new Error("Không nhận được URL từ bộ lưu trữ.");
    }

    return blob.url;
  } catch (error) {
    console.error("Error uploading to Vercel Blob:", error);
    if (error instanceof Error && error.message.includes('token')) {
      throw new Error("Lỗi xác thực: Thiếu BLOB_READ_WRITE_TOKEN trên Vercel.");
    }
    throw new Error("Không thể tải ảnh lên. Vui lòng kiểm tra kết nối hoặc cấu hình Vercel Blob.");
  }
};
