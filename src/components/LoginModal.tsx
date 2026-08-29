import React, { useState } from 'react';
import { User, School } from '../types';
import { 
  Lock, 
  UserCheck, 
  X, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  Building2,
  Sparkles
} from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  schools: School[];
  users: User[];
  onLoginSuccess: (user: User) => void;
  onOpenDemoSwitcher: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  schools,
  users,
  onLoginSuccess,
  onOpenDemoSwitcher,
}) => {
  const [nationalId, setNationalId] = useState('');
  const [password, setPassword] = useState('');
  const [schoolCode, setSchoolCode] = useState(schools[0]?.code || 'RAYA-1448');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanNid = nationalId.trim();
    const cleanPass = password.trim();

    if (!cleanNid || !cleanPass) {
      setErrorMsg('يرجى إدخال رقم الهوية وكلمة المرور');
      return;
    }

    // Super Admin special case
    if (cleanNid === '9999999999' && (cleanPass === '9999' || cleanPass === 'admin')) {
      const superUser = users.find((u) => u.role === 'superadmin') || {
        id: 'usr-superadmin',
        nationalId: '9999999999',
        name: 'المشرف العام - إدارة المنظومة',
        mobile: '0500009999',
        email: 'superadmin@hodork.sa',
        password: '9999',
        role: 'superadmin',
        schoolCode: 'GLOBAL',
      };
      onLoginSuccess(superUser);
      onClose();
      return;
    }

    // Standard user match
    const foundUser = users.find(
      (u) =>
        u.nationalId === cleanNid &&
        (u.password === cleanPass || cleanPass === cleanNid.slice(-4))
    );

    if (foundUser) {
      onLoginSuccess(foundUser);
      onClose();
    } else {
      setErrorMsg('رقم الهوية أو كلمة المرور غير صحيحة. كلمة المرور الافتراضية هي آخر 4 أرقام من الهوية.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">
        
        {/* Modal Top Header */}
        <div className="p-6 bg-gradient-to-r from-emerald-800 to-teal-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white border border-white/20">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">تسجيل الدخول إلى نظام حضورك</h2>
              <p className="text-xs text-emerald-100">منظومة الحضور الذكية للطلاب والمعلمين والإدارة</p>
            </div>
          </div>
          <button
            id="login-close-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleLogin} className="p-6 space-y-4">
          
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-start gap-2 animate-shake">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-red-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* School Code Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-emerald-600" />
              كود أو اسم المدرسة
            </label>
            <select
              id="login-school-code"
              value={schoolCode}
              onChange={(e) => setSchoolCode(e.target.value)}
              className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-hidden"
            >
              {schools.map((sch) => (
                <option key={sch.id} value={sch.code}>
                  {sch.name} ({sch.code})
                </option>
              ))}
            </select>
          </div>

          {/* National ID */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              رقم الهوية الوطنية / الإقامة
            </label>
            <input
              id="login-national-id"
              type="text"
              dir="ltr"
              placeholder="مثال: 1000472181 أو 2497120754"
              value={nationalId}
              onChange={(e) => setNationalId(e.target.value)}
              className="w-full text-xs font-mono font-bold bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-hidden text-right"
              required
            />
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700">
                كلمة المرور
              </label>
              <span className="text-[11px] text-slate-400">
                (افتراضياً: آخر 4 أرقام من الهوية)
              </span>
            </div>
            <div className="relative">
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                dir="ltr"
                placeholder="••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-xs font-mono font-bold bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-hidden text-right pl-10"
                required
              />
              <button
                type="button"
                id="toggle-password-btn"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
              <input
                type="checkbox"
                id="login-remember-me"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded-md border-slate-300 focus:ring-emerald-500"
              />
              <span>تذكرني على هذا الجهاز</span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            id="login-submit-btn"
            className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            <Lock className="w-4 h-4" />
            <span>تسجيل الدخول</span>
          </button>

          {/* Demo helper banner */}
          <div className="pt-3 border-t border-slate-100 text-center">
            <button
              type="button"
              id="login-demo-helper-btn"
              onClick={() => {
                onClose();
                onOpenDemoSwitcher();
              }}
              className="inline-flex items-center gap-1.5 text-xs text-emerald-700 hover:text-emerald-800 font-bold hover:underline cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>أو جرّب أحد الحسابات التجريبية الجاهزة بنقرة واحدة</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
