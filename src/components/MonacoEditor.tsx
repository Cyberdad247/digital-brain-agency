import React from 'react';
import Editor from '@monaco-editor/react';

interface MonacoEditorProps {
  value: string;
  language?: string;
  onChange?: (value: string) => void;
  height?: string | number;
  width?: string | number;
  options?: import('monaco-editor').editor.IStandaloneEditorConstructionOptions;
}

const MonacoEditor: React.FC<MonacoEditorProps> = ({
  value,
  language = 'javascript',
  onChange,
  height = '90vh',
  width = '100%',
  options = {},
}) => {
  return (
    <Editor
      height={height}
      width={width}
      language={language}
      value={value}
      onChange={onChange}
      options={{
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        automaticLayout: true,
        ...options,
      }}
    />
  );
};

export default MonacoEditor;
