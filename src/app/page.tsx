'use client';

import { ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black dark:bg-black">
      <main className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight text-center">
          <span className="block">Твоя музыка. Твой мир.</span>
          <span className="block mt-2">Без компромисов.</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
          Открой для себя 100 миллионов треков в lossless-качестве, эксклюзивные
          произведения, мгновенное соединение
        </p>
        <button className="bg-orange-500 hover:bg-orange-700 text-white font-semibold py-3 px-8 rounded-full flex items-center gap-2 transition-all duration-300 transform hover:scale-105 mb-4 cursor-pointer">
          ПОЛУЧИТЬ 3 МЕСЯЦА БЕСПЛАТНО
          <ArrowRight size={20} />
        </button>
        <p className="text-sm text-gray-400 mt-2">
          Начать слушать за 1 минуту - без карты
        </p>
      </main>
    </div>
  );
}
