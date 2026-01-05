'use client';

import { ArrowRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function Home() {
  const splineContainerRef = useRef<HTMLDivElement>(null);
  const [openAccordionIndex, setOpenAccordionIndex] = useState<number | null>(
    null
  );
  const [isPlaying, setIsPlaying] = useState<boolean>(false); // Initially paused until user interaction
  const [volume, setVolume] = useState<number>(1); // Volume state (0 to 1)
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<HTMLAudioElement | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const toggleAccordion = (index: number) => {
    setOpenAccordionIndex(openAccordionIndex === index ? null : index);
  };

  const togglePlayPause = async () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      // Pause playback
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsPlaying(false);
    } else {
      // Start playback - create AudioContext on user interaction
      if (!audioContextRef.current) {
        audioContextRef.current = new (
          window.AudioContext || (window as any).webkitAudioContext
        )();
      }

      try {
        // Resume AudioContext if suspended
        if (audioContextRef.current.state === 'suspended') {
          await audioContextRef.current.resume();
        }

        // Play the audio element
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (error: any) {
        console.error('Audio play error:', error);
        setIsPlaying(false);
      }
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);

    // Update the audio element's volume
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

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

  useEffect(() => {
    // Initialize Spline viewer after component mounts
    const initializeSplineViewer = async () => {
      if (splineContainerRef.current && typeof window !== 'undefined') {
        // Wait a bit to ensure the script is loaded
        await new Promise(resolve => setTimeout(resolve, 100));

        // Check if the Spline viewer custom element is available
        if (typeof customElements !== 'undefined') {
          // Wait for the custom element to be defined
          if (!customElements.get('spline-viewer')) {
            await customElements.whenDefined('spline-viewer');
          }
        }

        // Create the spline-viewer element
        const splineViewer = document.createElement('spline-viewer');
        splineViewer.setAttribute(
          'url',
          'https://prod.spline.design/BAzjbMem6oOITmTR/scene.splinecode'
        );
        splineViewer.setAttribute('loading-anim', '');
        splineViewer.setAttribute('events-target', 'global');

        // Clear the container and add the viewer
        splineContainerRef.current.innerHTML = '';
        splineContainerRef.current.appendChild(splineViewer);
      }
    };

    initializeSplineViewer();
  }, []);

  return (
    <div className="min-h-screen mt-20">
      {/* Transparent header with semi-transparent SOUND-WAVE icon on the right and play/pause button */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-transparent py-4 px-6 flex justify-between items-center">
        <div className="flex flex-col items-center relative">
          <button
            onClick={togglePlayPause}
            className="text-orange-500 hover:text-orange-400 focus:outline-none mb-2 btn-transparent cursor-pointer">
            {isPlaying ? (
              // Pause icon (two vertical lines)
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-9 w-9"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 9v6m4-6v6M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            ) : (
              // Play icon (triangle)
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-9 w-9"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            )}
          </button>
          {/* Volume slider container - visible on hover */}
          <div className="volume-slider-container cursor-pointer">
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="volume-slider-vertical accent-orange-500 slider-transparent"
            />
          </div>
        </div>
        <div className="sound-wave-text">SOUND-WAVE</div>
      </header>

      {/* Audio element for the stream */}
      <audio
        ref={audioRef}
        src="https://hls-01-radiorecord.hostingradio.ru/record/112/playlist.m3u8"
        style={{ display: 'none' }}
      />

      {/* First screen: Title, subtitle, and button only */}
      <div className="min-h-screen flex items-center justify-center">
        <main className="flex flex-col items-center justify-center w-full max-w-5xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight text-center">
            <span className="block">Твоя музыка. Твой мир.</span>
            <span className="block mt-2">Без компромиссов.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Открой для себя 100 миллионов треков в lossless-качестве,
            эксклюзивные произведения, мгновенное соединение
          </p>
          <button className="bg-orange-500 hover:bg-orange-700 text-white font-semibold py-3 px-8 rounded-full flex items-center gap-2 transition-all duration-300 transform hover:scale-105 mb-2 cursor-pointer">
            ПОЛУЧИТЬ 3 МЕСЯЦА БЕСПЛАТНО
            <ArrowRight size={20} />
          </button>
          <p className="text-sm text-gray-400 mt-1">
            Начать слушать за 1 минуту - без карты
          </p>
        </main>
      </div>

      {/* Spline 3D Scene - placed after the initial text section */}
      <div
        ref={splineContainerRef}
        className="min-h-screen flex items-center justify-center py-3">
        {/* The Spline viewer will be dynamically added here */}
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

      {/* Fourth screen: Our Advantages */}
      <div className="min-h-screen flex items-center justify-center py-10">
        <div className="w-full max-w-4xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-12">
            Наши преимущества
          </h2>
          <div className="space-y-4 max-w-[2600px] mx-auto">
            {' '}
            {/* Increased width by 30% from 2000px to 2600px */}
            {/* Accordion Item 1 */}
            <div className="bg-gradient-to-br from-gray-950 via-black to-gray-900 border border-gray-800 rounded-xl overflow-hidden transition-all duration-300 hover:border-orange-500 hover:shadow-lg hover:shadow-orange-500/20 hover:scale-105 cursor-pointer">
              <button
                className="w-full p-6 text-left flex justify-between items-center accordion-trigger"
                onClick={() => toggleAccordion(0)}>
                <span className="text-lg font-semibold text-orange-500">
                  Lossless-качество
                </span>
                <span className="text-orange-500 text-xl font-bold">
                  {openAccordionIndex === 0 ? '▲' : '▼'}
                </span>
              </button>
              {openAccordionIndex === 0 && (
                <div className="accordion-content p-6 pt-0">
                  <p className="text-gray-300">
                    Ощути каждую ноту. Звук, который полностью передаёт эмоции и
                    атмосферу.
                  </p>
                </div>
              )}
            </div>
            {/* Accordion Item 2 */}
            <div className="bg-gradient-to-br from-gray-950 via-black to-gray-900 border border-gray-800 rounded-xl overflow-hidden transition-all duration-300 hover:border-orange-500 hover:shadow-lg hover:shadow-orange-500/20 hover:scale-105 cursor-pointer">
              <button
                className="w-full p-6 text-left flex justify-between items-center accordion-trigger"
                onClick={() => toggleAccordion(1)}>
                <span className="text-lg font-semibold text-orange-500">
                  Без рекламы
                </span>
                <span className="text-orange-500 text-xl font-bold">
                  {openAccordionIndex === 1 ? '▲' : '▼'}
                </span>
              </button>
              {openAccordionIndex === 1 && (
                <div className="accordion-content p-6 pt-0">
                  <p className="text-gray-300">
                    Слушай любимые треки без перерыва. Никаких отвлекающих
                    факторов, только чистый звук.
                  </p>
                </div>
              )}
            </div>
            {/* Accordion Item 3 */}
            <div className="bg-gradient-to-br from-gray-950 via-black to-gray-900 border border-gray-800 rounded-xl overflow-hidden transition-all duration-300 hover:border-orange-500 hover:shadow-lg hover:shadow-orange-500/20 hover:scale-105 cursor-pointer">
              <button
                className="w-full p-6 text-left flex justify-between items-center accordion-trigger"
                onClick={() => toggleAccordion(2)}>
                <span className="text-lg font-semibold text-orange-500">
                  Эксклюзивные материалы
                </span>
                <span className="text-orange-500 text-xl font-bold">
                  {openAccordionIndex === 2 ? '▲' : '▼'}
                </span>
              </button>
              {openAccordionIndex === 2 && (
                <div className="accordion-content p-6 pt-0">
                  <p className="text-gray-300">
                    Только у нас ты найдёшь редкие альбомы и записи, которые не
                    найдёшь нигде.
                  </p>
                </div>
              )}
            </div>
            {/* Accordion Item 4 */}
            <div className="bg-gradient-to-br from-gray-950 via-black to-gray-900 border border-gray-800 rounded-xl overflow-hidden transition-all duration-300 hover:border-orange-500 hover:shadow-lg hover:shadow-orange-500/20 hover:scale-105 cursor-pointer">
              <button
                className="w-full p-6 text-left flex justify-between items-center accordion-trigger"
                onClick={() => toggleAccordion(3)}>
                <span className="text-lg font-semibold text-orange-500">
                  Персонализированные рекомендации
                </span>
                <span className="text-orange-500 text-xl font-bold">
                  {openAccordionIndex === 3 ? '▲' : '▼'}
                </span>
              </button>
              {openAccordionIndex === 3 && (
                <div className="accordion-content p-6 pt-0">
                  <p className="text-gray-300">
                    Каждый день — новые открытия. Алгоритм, который учитывает
                    твои предпочтения.
                  </p>
                </div>
              )}
            </div>
            {/* Accordion Item 5 */}
            <div className="bg-gradient-to-br from-gray-950 via-black to-gray-900 border border-gray-800 rounded-xl overflow-hidden transition-all duration-300 hover:border-orange-500 hover:shadow-lg hover:shadow-orange-500/20 hover:scale-105 cursor-pointer">
              <button
                className="w-full p-6 text-left flex justify-between items-center accordion-trigger"
                onClick={() => toggleAccordion(4)}>
                <span className="text-lg font-semibold text-orange-500">
                  Удобный интерфейс
                </span>
                <span className="text-orange-500 text-xl font-bold">
                  {openAccordionIndex === 4 ? '▲' : '▼'}
                </span>
              </button>
              {openAccordionIndex === 4 && (
                <div className="accordion-content p-6 pt-0">
                  <p className="text-gray-300">
                    Легкость навигации и быстрый поиск — всё для твоего
                    комфорта.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Fifth screen: Detailed offer section */}
      <div className="min-h-screen flex items-center justify-center py-10">
        <div className="w-full max-w-7xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-12">
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

      {/* Footer with more transparent orange divider */}
      <div className="w-full border-t footer-divider mt-10"></div>
      <div className="w-full py-6 footer-container">
        <div className="max-w-7xl mx-auto px-4 flex justify-end">
          <div className="footer-text">
            <p className="text-gray-400 mb-2">
              2026 (c). Built by
              <button
                className="text-orange-500 font-bold underline hover:text-orange-400 cursor-pointer ml-1"
                onClick={() =>
                  window.open(
                    'https://ecommerce-seliger-studio-upstarter.netlify.app/',
                    '_blank'
                  )
                }>
                SELIGER.STUDIO
              </button>
            </p>
            <p className="text-gray-400 mb-4">
              Powered by
              <button
                className="text-orange-500 font-bold underline hover:text-orange-400 cursor-pointer ml-1"
                onClick={() =>
                  window.open(
                    'https://ecommerce-seliger-studio-upstarter.netlify.app/',
                    '_blank'
                  )
                }>
                SELIGER.STUDIO
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
