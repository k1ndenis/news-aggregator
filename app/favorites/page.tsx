'use client';

import { Article } from "@/types/article";
import { get, del, clear, set } from "idb-keyval";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Favorites() {
  const router = useRouter();
  const [favorites, setFavorites] = useState<Article[] | null>(null);

  useEffect(() => {
    const getSavedData = async () => {
      try {
        const savedData = await get('favorites');
        setFavorites(savedData && savedData.length > 0 ? savedData : null);
      } catch (error) {
        console.log(error);
      }
    };
    getSavedData();
  }, [favorites])

  const removeOne = async (url: string) => {
    if (!favorites) return;
    const updated = favorites.filter(item => item.url !== url);

    if (updated.length === 0) {
      await del('favorites');
      setFavorites(null);
    } else {
      await set('favorites', updated);
      setFavorites(updated);
    }
  };

  const clearAll = async () => {
    if (confirm("Точно очистить всё избранное?")) {
      await del('favorites');
      setFavorites(null);
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          ⭐ Избранное
        </h1>
        <div className="flex gap-3">
          <button 
            onClick={clearAll}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 cursor-pointer"
          >
            Очистить всё
          </button>
          <button
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200 cursor-pointer"
            onClick={() => router.push("/")}
          >
            ← На главную
          </button>
        </div>
      </div>

      {favorites === null ? (
        <div className="text-center text-gray-500 dark:text-gray-400 py-12">
          <p className="text-lg">У вас пока нет избранных новостей</p>
          <p className="text-sm mt-2">Добавляйте новости в избранное, чтобы они появились здесь</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((article) => (
            <div
              key={article.url}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden flex flex-col"
            >
              {article.urlToImage && (
                <img
                  src={article.urlToImage}
                  alt={article.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4 flex flex-col grow">
                <h2 className="text-xl font-semibold mb-2 line-clamp-2">{article.title}</h2>
                <div className="mt-auto flex flex-col gap-3">
                  <a
                    href={article.url}
                    target="_blank"
                    className="text-blue-500 text-sm font-medium"
                  >
                    Читать оригинал →
                  </a>
                  <button
                    onClick={() => removeOne(article.url)}
                    className="text-red-400 hover:text-red-600 text-xs text-left transition-colors"
                  >
                    Удалить из избранного
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
    </div>
  );
}