import React from 'react';

export default function Toggle({ enabled, onChange, label, disabled = false, description }) {
  return (
    <div className="flex items-center justify-between">
      {label && (
        <div className="flex flex-col">
          <span className="text-sm font-medium text-slate-800">{label}</span>
          {description && <span className="text-xs text-slate-500">{description}</span>}
        </div>
      )}
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        disabled={disabled}
        onClick={() => !disabled && onChange(!enabled)}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2 ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        } ${enabled ? 'bg-teal-600' : 'bg-slate-300'}`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            enabled ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}
