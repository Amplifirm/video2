// components/subjects/RichTextEditor.tsx
import React from 'react';
import { EditorProps } from '../../types/practice';

const RichTextEditor: React.FC<EditorProps> = ({
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
      className={className}
      readOnly={readOnly}
    />
  );
};

export default RichTextEditor;

