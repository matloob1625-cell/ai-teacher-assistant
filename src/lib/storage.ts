import { SavedAsset, ActiveTool } from '../types';

const STORAGE_KEY = 'ai_teacher_assistant_saved_assets';

export function getSavedAssets(): SavedAsset[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load saved assets:', err);
    return [];
  }
}

export function saveAsset(title: string, type: ActiveTool, data: any): SavedAsset {
  const current = getSavedAssets();
  const newAsset: SavedAsset = {
    id: `asset_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    title: title || `${type.replace('_', ' ').toUpperCase()} - ${new Date().toLocaleDateString()}`,
    type,
    createdAt: new Date().toISOString(),
    data,
  };
  const updated = [newAsset, ...current];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return newAsset;
}

export function deleteAsset(id: string): SavedAsset[] {
  const current = getSavedAssets();
  const updated = current.filter((item) => item.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function clearAllAssets(): void {
  localStorage.removeItem(STORAGE_KEY);
}
