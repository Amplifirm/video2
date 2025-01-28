// components/subjects/CalculationEditor.tsx
import React from 'react';
import { EditorProps } from '../../types/practice';

const CalculationEditor: React.FC<EditorProps> = ({
  value,
  onChange,
  onKeyDown,
  placeholder,
  className,
  readOnly
}) => {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      className={`font-mono ${className}`}
      readOnly={readOnly}
    />
  );
};

export default CalculationEditor;