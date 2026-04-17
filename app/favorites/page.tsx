'use client';

import { useRouter } from "next/navigation";

export default function Favorites() {
  const router = useRouter();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          ⭐ Избранное
        </h1>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 cursor-pointer">
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

      <div className="text-center text-gray-500 dark:text-gray-400 py-12">
        <p className="text-lg">У вас пока нет избранных новостей</p>
        <p className="text-sm mt-2">Добавляйте новости в избранное, чтобы они появились здесь</p>
      </div>
    </div>
  );
}