import React, { useState, useEffect } from 'react';
import MonacoEditor, { MonacoEditorProps, ChangeHandler } from 'react-monaco-editor';
import * as monaco from 'monaco-editor';

interface CodeEditorProps {
  initialCode: string;
  onChange: (newValue: string) => void;
}

const SimpleCodeEditor: React.FC<CodeEditorProps> = ({ initialCode, onChange }) => {
  const [code, setCode] = useState<string>(initialCode);

  useEffect(() => {
    setCode(initialCode);
  }, [initialCode]);

  const editorDidMount = (editor: monaco.editor.IStandaloneCodeEditor, monacoInstance: typeof monaco): void => {
    console.log('editorDidMount', editor);
    editor.focus();
  };

  const onChangeHandler: ChangeHandler = (newValue: string, e: monaco.editor.IModelContentChangedEvent): void => {
    setCode(newValue);
    onChange(newValue);
  };

  return (
    <div className="code-editor">
      <MonacoEditor
        width="800"
        height="600"
        language="javascript"
        theme="vs-dark"
        value={code}
        options={{
          selectOnLineNumbers: true,
        }}
        onChange={onChangeHandler}
        editorDidMount={editorDidMount}
      />
    </div>
  );
};

export default SimpleCodeEditor;
