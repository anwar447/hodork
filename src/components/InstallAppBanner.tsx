import React, { useState, useEffect } from 'react';
import { Download, Share2, Smartphone, X, Check, Apple, Sparkles } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const InstallAppBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [installedSuccess, setInstalledSuccess] = useState(false);

  useEffect(() => {
    // Check if app is already running as standalone (PWA installed)
    const isStandaloneMode = 
      window.matchMedia('(display-mode: standalone)').matches || 
      (window.navigator as any).standalone === true;

    if (isStandaloneMode) {
      setIsStandalone(true);
      return;
    }

    // Detect iOS devices (iPhone/iPad)
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isAppleDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isAppleDevice);

    // Listen for beforeinstallprompt event on Android / Chrome / Edge
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen for app installed event
    const handleAppInstalled = () => {
      setInstalledSuccess(true);
      setDeferredPrompt(null);
      setTimeout(() => {
        setIsDismissed(true);
      }, 3000);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // If already installed or dismissed, hide
  if (isStandalone || isDismissed) {
    return null;
  }

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Android / Chrome direct install prompt
      try {
        await deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice.outcome === 'accepted') {
          setInstalledSuccess(true);
        }
        setDeferredPrompt(null);
      } catch (err) {
        console.error('Install prompt error:', err);
      }
    } else if (isIOS) {
      // Show step-by-step modal for iOS Safari
      setShowIOSGuide(true);
    } else {
      // Fallback guide for other browsers
      setShowIOSGuide(true);
    }
  };

  return (
    <>
      {/* Floating Bottom / Top Install Banner */}
      <div 
        id="pwa-install-banner"
        className="fixed bottom-4 sm:bottom-6 left-4 right-4 sm:left-auto sm:right-6 z-50 sm:max-w-md bg-slate-900/95 text-white p-4 rounded-2xl shadow-2xl border border-emerald-500/40 backdrop-blur-md animate-fadeIn transition-all"
        dir="rtl"
      >
        <div className="flex items-start gap-3">
          {/* App Icon */}
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shrink-0 shadow-md">
            <Smartphone className="w-6 h-6 text-white" />
          </div>

          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-emerald-400">تطبيق حضورك الذكي</span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                PWA
              </span>
            </div>
            
            <h4 className="text-sm font-bold text-white leading-snug">
              حمّل التطبيق على هاتفك لتسجيل الحضور بلمسة واحدة
            </h4>
            
            <p className="text-[11px] text-slate-300 leading-tight">
              يعمل بدون متصفح ويدعم الحضور السريع بالسياج الجغرافي والإشعارات المباشرة.
            </p>

            {/* Actions */}
            <div className="pt-2 flex items-center gap-2">
              <button
                type="button"
                id="btn-install-app"
                onClick={handleInstallClick}
                className="flex-1 py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>تثبيت التطبيق الآن</span>
              </button>
              
              <button
                type="button"
                onClick={() => setIsDismissed(true)}
                className="py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white text-xs font-bold transition-colors cursor-pointer"
              >
                لاحقاً
              </button>
            </div>
          </div>

          {/* Close button */}
          <button
            type="button"
            onClick={() => setIsDismissed(true)}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
            title="إغلاق التنبيه"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {installedSuccess && (
          <div className="mt-2 p-2 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-bold flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>تم تثبيت التطبيق بنجاح على شاشتك الرئيسية!</span>
          </div>
        )}
      </div>

      {/* iOS / Safari Step-by-Step Installation Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn" dir="rtl">
          <div className="bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 w-full max-w-sm text-right space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">طريقة تثبيت التطبيق على الآيفون</h3>
                  <span className="text-[11px] text-slate-500">متصفح Safari</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 pt-2 text-xs text-slate-700">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs shrink-0">
                  1
                </span>
                <p className="leading-relaxed">
                  اضغط على زر <strong className="text-slate-900 font-bold">المشاركة (Share <Share2 className="w-3.5 h-3.5 inline text-blue-600" />)</strong> في أسفل شاشة المتصفح.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs shrink-0">
                  2
                </span>
                <p className="leading-relaxed">
                  مرر القائمة للأسفل واختر <strong className="text-emerald-700 font-bold">"إضافة إلى الشاشة الرئيسية" (Add to Home Screen)</strong>.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs shrink-0">
                  3
                </span>
                <p className="leading-relaxed">
                  اضغط على <strong className="text-slate-900 font-bold">"إضافة" (Add)</strong> في أعلى الزاوية ليظهر التطبيق مع تطبيقاتك.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowIOSGuide(false)}
              className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer"
            >
              فهمت، شكراً لك
            </button>
          </div>
        </div>
      )}
    </>
  );
};
