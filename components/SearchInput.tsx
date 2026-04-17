'use client';

import { Article } from "@/types/article";
import { useEffect, useState } from "react";

interface Props {
  setNews: React.Dispatch<React.SetStateAction<Article[] | null>>
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
  setError: React.Dispatch<React.SetStateAction<string | null>>
}

export default function SearchInput({ setNews, setLoading, setError }: Props) {
  const [currentInput, setCurrentInput] = useState<string>("");
  const URL = `https://newsapi.org/v2/everything?q=${currentInput}&apiKey=`
  const API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY;

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
  

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentInput) return;
    console.log("Поиск:", currentInput);
    getNews();
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        placeholder="Поиск новостей"
        value={currentInput}
        onChange={(e) => setCurrentInput(e.target.value)}
        className="px-4 py-2 w-64 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 cursor-pointer"
      >
        Найти
      </button>
    </form>
  );
}