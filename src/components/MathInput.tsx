// src/components/MathInput.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { CloudLightning } from 'lucide-react';
import 'katex/dist/katex.min.css';

interface MathInputProps {
  value: string;
  onChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  placeholder?: string;
}

const MathInput: React.FC<MathInputProps> = ({ 
  value, 
  onChange, 
  onKeyDown,
  placeholder = "Type your solution here..." 
}) => {
  const mathSymbols = [
    { symbol: '÷', latex: '\\div' },
    { symbol: '×', latex: '\\times' },
    { symbol: '²', latex: '^2' },
    { symbol: '³', latex: '^3' },
    { symbol: '√', latex: '\\sqrt{}' },
    { symbol: 'π', latex: '\\pi' },
    { symbol: '∫', latex: '\\int' },
    { symbol: '∑', latex: '\\sum' },
    { symbol: '∞', latex: '\\infty' },
    { symbol: '≠', latex: '\\neq' },
    { symbol: '≤', latex: '\\leq' },
    { symbol: '≥', latex: '\\geq' },
    { symbol: '±', latex: '\\pm' },
    { symbol: '∂', latex: '\\partial' },
    { symbol: '∆', latex: '\\Delta' },
    { symbol: 'θ', latex: '\\theta' }
  ];

  const fractionTemplates = [
    { name: 'Simple Fraction', template: '\\frac{a}{b}' },
    { name: 'Mixed Number', template: '1\\frac{1}{2}' },
    { name: 'Complex Fraction', template: '\\frac{\\frac{a}{b}}{c}' }
  ];

  const insertText = (text: string) => {
    const textarea = document.querySelector('textarea');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newValue = value.substring(0, start) + text + value.substring(end);
    onChange(newValue);

    // Set cursor position after inserted text
    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = start + text.length;
      textarea.focus();
    }, 0);
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        {/* Main Input */}
        <motion.div 
          className="relative rounded-2xl overflow-hidden"
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-100/30 
                       via-purple-50/20 to-transparent" />
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            className="w-full p-8 bg-white/70 backdrop-blur-xl rounded-2xl
                     resize-none border-2 border-purple-100 
                     focus:border-purple-500 focus:ring-4 
                     focus:ring-purple-100 transition-all text-lg 
                     min-h-[180px] placeholder:text-gray-400
                     font-mono relative z-10"
          />

          {/* Keyboard Shortcut Hint */}
          <div className="absolute bottom-8 right-8 flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-purple-50 
                        rounded-lg shadow-sm">
              <CloudLightning className="w-4 h-4 text-purple-600" />
              <span className="text-sm text-purple-700 font-medium">Submit</span>
              <div className="flex items-center gap-1">
                <kbd className="px-2 py-1 text-xs font-medium bg-purple-100 
                            text-purple-600 rounded">⌘</kbd>
                <span className="text-purple-600">+</span>
                <kbd className="px-2 py-1 text-xs font-medium bg-purple-100 
                            text-purple-600 rounded">↵</kbd>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Math Symbols Toolbar */}
      <motion.div 
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Common Symbols */}
        <div className="bg-purple-50 p-3 rounded-xl">
          <div className="grid grid-cols-8 gap-2">
            {mathSymbols.map(({ symbol, latex }) => (
              <motion.button
                key={symbol}
                onClick={() => insertText(latex)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 flex items-center justify-center
                         bg-white rounded-lg text-purple-700 font-medium
                         hover:bg-purple-100 transition-all shadow-sm"
              >
                {symbol}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Fraction Templates */}
        <div className="flex gap-2">
          {fractionTemplates.map(({ name, template }) => (
            <motion.button
              key={name}
              onClick={() => insertText(template)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-4 py-2 bg-purple-50 rounded-lg text-purple-700
                       hover:bg-purple-100 transition-all text-sm font-medium
                       shadow-sm"
            >
              {name}
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default MathInput;