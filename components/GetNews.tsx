'use client'

import { Article } from "@/types/article";
import { useEffect, useState } from "react"
import SearchInput from "./SearchInput";
import { get, set } from "idb-keyval";

export default function GetNews() {
  const URL = "https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey="
  const API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY;
  const [news, setNews] = useState<Article[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  useEffect(() => {
    const getNews = async () => {
      try {
        const response = await fetch(`${URL}${API_KEY}`);
        if (!response.ok) {
          throw new Error("Error fetch news");
        } 
        const data = await response.json();
        setNews(data.articles);
      } catch (error) {
        const err = error as Error;
        console.log("error: ", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    getNews();
  }, [refreshTrigger, API_KEY]);

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  }

  const addToFavorites = async (article: Article) => {
    try {
      const favorites: Article[] = (await get('favorites')) || [];

      const isArleadyIn = favorites.some(item => item.url === article.url);

      if (!isArleadyIn) {
        const updatedFavorites = [article, ...favorites];
        await set('favorites', updatedFavorites);
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-8">
        Ошибка: {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 
          onClick={handleRefresh} 
          className="text-3xl font-bold text-gray-800 dark:text-white cursor-pointer"
        >
          📰 Бизнес новости
        </h1>
        <SearchInput
          setNews={setNews}
          setLoading={setLoading}
          setError={setError}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {news &&
          news.map((article) => (
            <div
              key={article.url}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col"
            >
              {article.urlToImage && (
                <img
                  width="500"
                  src={article.urlToImage}
                  alt={article.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4 flex flex-col grow">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2 line-clamp-2">
                  {article.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                  {article.description}
                </p>
                <div className="mt-auto flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                  <span>{article.source.name}</span>
                  <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between gap-3">
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-bold transition-all"
                  >
                    Читать далее →
                  </a>
                  
                  <button
                    onClick={() => addToFavorites(article)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-700 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 text-gray-700 dark:text-gray-200 hover:text-yellow-600 dark:hover:text-yellow-400 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors duration-200 border border-gray-200 dark:border-gray-600 hover:border-yellow-200 cursor-pointer"
                  >
                    <span>⭐</span>
                    Добавить
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}