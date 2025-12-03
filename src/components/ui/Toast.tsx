'use client';
import React, { useEffect, useState } from 'react';
import { X, CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';
import { Toast as ToastType } from '@/lib/types/auth';

interface ToastProps {
  toast: ToastType;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (toast.duration && toast.duration > 0) {
      const timer = setTimeout(() => {
        setIsExiting(true);
        setTimeout(onClose, 300);
      }, toast.duration - 300);
      
      return () => clearTimeout(timer);
    }
  }, [toast.duration, onClose]);

  const getStyles = () => {
    const base = "flex items-start gap-3 p-4 rounded-lg shadow-xl backdrop-blur-sm border transition-all duration-300 min-w-[320px] max-w-md";
    
    switch (toast.type) {
      case 'success':
        return `${base} bg-green-500/10 border-green-500/30`;
      case 'error':
        return `${base} bg-red-500/10 border-red-500/30`;
      case 'warning':
        return `${base} bg-yellow-500/10 border-yellow-500/30`;
      case 'info':
      default:
        return `${base} bg-blue-500/10 border-blue-500/30`;
    }
  };

  const getIcon = () => {
    const iconClass = "w-5 h-5 flex-shrink-0 mt-0.5";
    switch (toast.type) {
      case 'success':
        return <CheckCircle className={`${iconClass} text-green-400`} />;
      case 'error':
        return <XCircle className={`${iconClass} text-red-400`} />;
      case 'warning':
        return <AlertCircle className={`${iconClass} text-yellow-400`} />;
      case 'info':
      default:
        return <Info className={`${iconClass} text-blue-400`} />;
    }
  };

  const getTextColor = () => {
    switch (toast.type) {
      case 'success':
        return 'text-green-800';
      case 'error':
        return 'text-red-800';
      case 'warning':
        return 'text-yellow-800';
      case 'info':
      default:
        return 'text-blue-800';
    }
  };

  return (
    <div
      className={`${getStyles()} ${
        isExiting ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0'
      }`}
    >
      {getIcon()}
      <div className={`flex-1 text-sm font-medium ${getTextColor()}`}>
        {toast.message}
      </div>
      <button
        onClick={() => {
          setIsExiting(true);
          setTimeout(onClose, 300);
        }}
        className="text-gray-400 hover:text-white transition-colors flex-shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};