import React, { useEffect, useMemo, useState } from 'react';

type QuickReply = {
  label: string;
  message: string;
};

type WhatsAppWidgetProps = {
  phoneNumberE164: string; // e.g., "+919876543210"
  studioName: string;
  welcomeMessage?: string;
  badgeText?: string; // e.g., "Hi 👋"
  quickReplies?: QuickReply[];
  delayMs?: number; // delay before showing widget
};

const buildWhatsAppUrl = (phoneNumberE164: string, message: string) => {
  const base = 'https://wa.me/';
  const encoded = encodeURIComponent(message);
  return `${base}${phoneNumberE164.replace(/[^\d]/g, '')}?text=${encoded}`;
};

const WhatsAppWidget: React.FC<WhatsAppWidgetProps> = ({
  phoneNumberE164,
  studioName,
  welcomeMessage = 'Hi 👋! Thanks for visiting. How can we help you today? 💬',
  badgeText = 'Hi 👋',
  quickReplies,
  delayMs = 1800,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delayMs);
    return () => clearTimeout(timer);
  }, [delayMs]);

  const defaultReplies: QuickReply[] = useMemo(
    () =>
      [
        { label: 'Pricing', message: 'Hi! Could you share your pricing plans?' },
        { label: 'Class Schedule', message: 'Hello! What are the class timings?' },
        { label: 'Book Demo', message: 'I would like to book a demo class.' },
      ],
    []
  );

  const replies = quickReplies && quickReplies.length > 0 ? quickReplies : defaultReplies;

  const handleOpenAi = () => {
    const url = buildWhatsAppUrl(
      phoneNumberE164,
      `Hi! I would like instant answers to common FAQs about ${studioName} (pricing, schedule, demo booking).`
    );
    window.open(url, '_blank');
  };

  const handleOpenHuman = () => {
    const url = buildWhatsAppUrl(
      phoneNumberE164,
      `Hi! I'd like to chat with a human from ${studioName}.`
    );
    window.open(url, '_blank');
  };

  const handleQuick = (message: string) => {
    const url = buildWhatsAppUrl(phoneNumberE164, message);
    window.open(url, '_blank');
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 select-none">
      {/* Panel */}
      {isOpen && (
        <div className="mb-3 w-72 sm:w-80 rounded-2xl shadow-2xl bg-white border border-gray-100 overflow-hidden animate-[fadeIn_300ms_ease]">
          <div className="bg-green-500 text-white px-4 py-3">
            <div className="text-sm">{studioName}</div>
            <div className="text-sm/relaxed opacity-95">{welcomeMessage}</div>
          </div>
          <div className="p-3 space-y-2">
            <button
              onClick={handleOpenAi}
              className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl border border-green-200 hover:border-green-400 bg-green-50 hover:bg-green-100 text-green-700"
            >
              <span className="font-medium">Instant answers (AI/FAQs)</span>
              <span className="text-xs">WhatsApp</span>
            </button>
            <button
              onClick={handleOpenHuman}
              className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl border border-gray-200 hover:border-gray-300 bg-white text-gray-800"
            >
              <span className="font-medium">Chat with a human</span>
              <span className="text-xs">WhatsApp</span>
            </button>
            <div className="pt-1">
              <div className="text-xs text-gray-500 mb-2">Quick questions</div>
              <div className="flex flex-wrap gap-2">
                {replies.map((r) => (
                  <button
                    key={r.label}
                    onClick={() => handleQuick(r.message)}
                    className="text-xs px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700"
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <div className="relative">
        {/* Notification bubble */}
        <div className="absolute -top-2 -left-2">
          <div className="px-2.5 py-1 rounded-full bg-red-500 text-white text-[10px] font-semibold shadow-lg animate-[popIn_400ms_ease]">
            {badgeText}
          </div>
        </div>

        <button
          aria-label="Open WhatsApp chat"
          onClick={() => setIsOpen((v) => !v)}
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#25D366] shadow-[0_10px_20px_rgba(37,211,102,0.5)] hover:shadow-[0_12px_22px_rgba(37,211,102,0.6)] flex items-center justify-center group focus:outline-none focus:ring-4 focus:ring-green-200 animate-[fadeUp_500ms_ease]"
        >
          {/* WhatsApp logo (inline SVG) */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 32 32"
            className="w-7 h-7 sm:w-8 sm:h-8 text-white fill-current group-hover:scale-110 transition-transform"
          >
            <path d="M19.11 17.52c-.27-.14-1.6-.79-1.85-.88-.25-.09-.43-.14-.61.14-.18.27-.7.88-.86 1.06-.16.18-.32.2-.59.07-.27-.14-1.15-.42-2.2-1.34-.81-.72-1.36-1.6-1.52-1.87-.16-.27-.02-.41.12-.54.12-.12.27-.32.41-.48.14-.16.18-.27.27-.45.09-.18.05-.34-.02-.48-.07-.14-.61-1.47-.84-2.01-.22-.53-.45-.46-.61-.46-.16 0-.34-.02-.52-.02s-.48.07-.73.34c-.25.27-.96.94-.96 2.29 0 1.35.99 2.66 1.13 2.84.14.18 1.95 2.98 4.73 4.18.66.28 1.18.45 1.58.57.66.21 1.26.18 1.74.11.53-.08 1.6-.65 1.83-1.28.23-.63.23-1.18.16-1.29-.07-.11-.25-.18-.52-.32z" />
            <path d="M16.02 4C9.91 4 4.97 8.94 4.97 15.06c0 2.21.64 4.27 1.75 6.01L4 28l7.12-2.66c1.68.92 3.61 1.45 5.67 1.45 6.11 0 11.05-4.94 11.05-11.06C27.84 8.94 22.12 4 16.02 4zm0 19.96c-1.86 0-3.58-.54-5.03-1.46l-.36-.23-4.23 1.58 1.51-4.34-.24-.38a9.6 9.6 0 01-1.62-5.47c0-5.3 4.31-9.6 9.6-9.6 5.3 0 9.6 4.3 9.6 9.6 0 5.3-4.3 9.6-9.6 9.6z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default WhatsAppWidget;



