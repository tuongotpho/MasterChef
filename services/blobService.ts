
import { put, list, del } from '@vercel/blob';
import { MealRecord } from '../types';

const DB_FILENAME = 'cheflog_database.json';

const getBlobToken = () => {
  return (window as any).process?.env?.BLOB_READ_WRITE_TOKEN || localStorage.getItem('cheflog_blob_token');
};

export const uploadMealImage = async (file: File): Promise<string> => {
  const token = getBlobToken();
  if (!token) throw new Error("MISSING_TOKEN");

  try {
    const filename = `meal-${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    const blob = await put(filename, file, {
      access: 'public',
      token: token,
    });
    return blob.url;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

/**
 * Lưu toàn bộ danh sách món ăn thành file JSON trên Cloud
 */
export const syncDatabaseToCloud = async (meals: MealRecord[]): Promise<void> => {
  const token = getBlobToken();
  if (!token) return;

  try {
    // 1. Tìm và xóa file cũ nếu tồn tại (để tránh rác, mặc dù put sẽ ghi đè nếu cùng tên nhưng Vercel Blob tạo URL mới mỗi lần)
    // Để đơn giản, chúng ta cứ dùng put với cùng tên, Vercel sẽ xử lý.
    await put(DB_FILENAME, JSON.stringify(meals), {
      access: 'public',
      token: token,
      addRandomSuffix: false, // Quan trọng: giữ nguyên tên để dễ tìm
    });
  } catch (error) {
    console.error("Cloud Sync Error:", error);
  }
};

/**
 * Tải danh sách món ăn từ Cloud về
 */
export const fetchDatabaseFromCloud = async (): Promise<MealRecord[] | null> => {
  const token = getBlobToken();
  if (!token) return null;

  try {
    const { blobs } = await list({ token });
    const dbBlob = blobs.find(b => b.pathname === DB_FILENAME);
    
    if (dbBlob) {
      const response = await fetch(`${dbBlob.url}?t=${Date.now()}`); // Thêm timestamp để tránh cache
      const data = await response.json();
      return data;
    }
    return null;
  } catch (error) {
    console.error("Fetch Cloud Data Error:", error);
    return null;
  }
};
