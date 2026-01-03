'use client';

import { ArrowRight } from 'lucide-react';
import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    const handleScroll = () => {
      const imageContainer = document.getElementById('scroll-image-container');
      if (!imageContainer) return;

      // Get the position of the container relative to the viewport
      const rect = imageContainer.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Calculate how far the element is from the center of the screen
      // When the element is at the bottom of the screen, start = -height
      // When the element is at the top of the screen, start = windowHeight
      // When the element is at the center, start = windowHeight/2 - height/2
      const elementTop = rect.top;
      const elementCenter = elementTop - windowHeight / 2 + rect.height / 2;

      // Calculate progress from -1 (element at bottom) to 1 (element at top)
      // When the element is in the center of the viewport, progress = 0
      let progress = -elementCenter / (windowHeight / 2);

      // Clamp the progress between -1 and 1
      progress = Math.max(-1, Math.min(1, progress));

      // The image should be at 60deg when not in view (when progress is -1 or 1)
      // The image should be at 0deg when in the center (when progress is 0)
      // Only apply rotation when the center of the image is below the center of the viewport
      // When the image center is above the viewport center, keep rotation at 0 degrees
      let rotationX = 0;
      if (elementCenter >= 0) {
        // Image center is below or at viewport center - apply rotation
        // Calculate rotation based on how far the image center is below viewport center
        rotationX = 60 * Math.abs(progress);
      } else {
        // Image center is above viewport center - keep rotation at 0 degrees
        rotationX = 0;
      }

      // Apply the rotation to the image
      const img = imageContainer.querySelector('img');
      if (img) {
        img.style.transform = `rotateX(${rotationX}deg)`;
      }
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);

    // Set initial rotation based on position before the scroll event starts
    // If the image is in view (center above viewport center), start with 0deg
    // If the image is not in view (center below viewport center), start with 60deg
    const imageContainer = document.getElementById('scroll-image-container');
    if (imageContainer) {
      const rect = imageContainer.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const elementTop = rect.top;
      const elementCenter = elementTop - windowHeight / 2 + rect.height / 2;

      let rotationX = 0;
      if (elementCenter >= 0) {
        // Image center is below or at viewport center - start with rotation
        const initialProgress = -elementCenter / (windowHeight / 2);
        const clampedProgress = Math.max(-1, Math.min(1, initialProgress));
        rotationX = 60 * Math.abs(clampedProgress);
      } else {
        // Image center is above viewport center - start with 0 degrees
        rotationX = 0;
      }

      const img = imageContainer.querySelector('img');
      if (img) {
        img.style.transform = `rotateX(${rotationX}deg)`;
        img.style.transformStyle = 'preserve-3d';
      }
    }

    // Initial call to set the correct state
    handleScroll();

    // Cleanup function to remove the event listener
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="min-h-screen mt-20">
      {/* First screen: Title, subtitle, and button only */}
      <div className="min-h-screen flex items-center justify-center">
        <main className="flex flex-col items-center justify-center w-full max-w-5xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight text-center">
            <span className="block">Твоя музыка. Твой мир.</span>
            <span className="block mt-2">Без компромиссов.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Открой для себя 100 миллионов треков в lossless-качестве,
            эксклюзивные произведения, мгновенное соединение
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

      {/* Second screen: Grid components only */}
      <div className="min-h-screen flex items-center justify-center py-10">
        <section className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-7xl mx-auto px-4">
            {/* Card 1 */}
            <div className="bg-gradient-to-br from-gray-950 via-black to-gray-900 border border-gray-800 rounded-xl p-12 transition-all duration-300 hover:border-orange-500 hover:scale-105 hover:shadow-lg hover:shadow-orange-500/20 cursor-pointer min-h-[240px] min-w-[280px] text-center">
              <h3 className="text-3xl font-bold text-orange-500 mb-3">100+</h3>
              <p className="text-xl text-white">миллионов треков</p>
              <p className="text-gray-400 mt-3">в максимальном качестве</p>
            </div>

            {/* Card 2 */}
            <div className="bg-gradient-to-br from-gray-950 via-black to-gray-900 border border-gray-800 rounded-xl p-12 transition-all duration-300 hover:border-orange-500 hover:scale-105 hover:shadow-lg hover:shadow-orange-500/20 cursor-pointer min-h-[240px] min-w-[280px] text-center">
              <h3 className="text-3xl font-bold text-orange-500 mb-3">500+</h3>
              <p className="text-xl text-white">эксклюзивных релизов</p>
              <p className="text-gray-400 mt-3">каждый месяц</p>
            </div>

            {/* Card 3 */}
            <div className="bg-gradient-to-br from-gray-950 via-black to-gray-900 border border-gray-800 rounded-xl p-12 transition-all duration-300 hover:border-orange-500 hover:scale-105 hover:shadow-lg hover:shadow-orange-500/20 cursor-pointer min-h-[240px] min-w-[280px] text-center">
              <h3 className="text-3xl font-bold text-orange-500 mb-3">98,7%</h3>
              <p className="text-xl text-white">пользователей</p>
              <p className="text-gray-400 mt-3">продлевают подписку</p>
            </div>
          </div>
        </section>
      </div>

      {/* Third screen: Image with scroll animation */}
      <div className="min-h-screen flex items-center justify-center py-10">
        <div
          id="scroll-image-container"
          className="w-full max-w-[1200px] px-4 rounded-2xl"
          style={{
            perspective: '1000px',
          }}>
          <img
            src="/screen2.png"
            alt="Третий экран"
            className="w-full h-auto rounded-2xl"
          />
        </div>
      </div>

      {/* Fourth screen: Detailed offer section */}
      <div className="min-h-screen flex items-center justify-center py-10">
        <div className="w-full max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
            Детальное предложение
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Main Offer */}
            <div className="bg-gradient-to-br from-gray-950 via-black to-gray-900 border border-gray-800 rounded-xl p-8 transition-all duration-300 hover:border-orange-500 hover:scale-105 hover:shadow-lg hover:shadow-orange-500/20 cursor-pointer min-h-[200px] flex flex-col justify-center items-center text-center">
              <h3 className="text-xl font-bold text-orange-500 mb-3">
                Основное предложение
              </h3>
              <p className="text-2xl font-bold text-white">299р/мес</p>
            </div>

            {/* Profit Calculator */}
            <div className="bg-gradient-to-br from-gray-950 via-black to-gray-900 border border-gray-800 rounded-xl p-8 transition-all duration-300 hover:border-orange-500 hover:scale-105 hover:shadow-lg hover:shadow-orange-500/20 cursor-pointer min-h-[200px] flex flex-col justify-center items-center text-center">
              <h3 className="text-xl font-bold text-orange-500 mb-3">
                Калькулятор выгоды
              </h3>
              <p className="text-white">Рассчитайте свою экономию</p>
            </div>

            {/* Limited Offer */}
            <div className="bg-gradient-to-br from-gray-950 via-black to-gray-900 border border-gray-800 rounded-xl p-8 transition-all duration-300 hover:border-orange-500 hover:scale-105 hover:shadow-lg hover:shadow-orange-500/20 cursor-pointer min-h-[200px] flex flex-col justify-center items-center text-center">
              <h3 className="text-xl font-bold text-orange-500 mb-3">
                Ограниченное предложение
              </h3>
              <p className="text-2xl font-bold text-white">3 месяца за 99р</p>
            </div>

            {/* Exclusive Bonuses */}
            <div className="bg-gradient-to-br from-gray-950 via-black to-gray-900 border border-gray-800 rounded-xl p-8 transition-all duration-300 hover:border-orange-500 hover:scale-105 hover:shadow-lg hover:shadow-orange-500/20 cursor-pointer min-h-[200px] flex flex-col justify-center items-center text-center">
              <h3 className="text-xl font-bold text-orange-500 mb-3">
                Эксклюзивные бонусы
              </h3>
              <p className="text-white">Специальные привилегии</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
