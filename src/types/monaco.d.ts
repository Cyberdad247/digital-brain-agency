declare module 'monaco-editor' {
  export * from 'monaco-editor/esm/vs/editor/editor.api';
  export const editor: typeof import('monaco-editor/esm/vs/editor/editor.api');
  export const languages: typeof import('monaco-editor/esm/vs/editor/editor.api').languages;
  export const Uri: typeof import('monaco-editor/esm/vs/editor/editor.api').Uri;
  export const KeyMod: typeof import('monaco-editor/esm/vs/editor/editor.api').KeyMod;
  export const KeyCode: typeof import('monaco-editor/esm/vs/editor/editor.api').KeyCode;
  export const MarkerSeverity: typeof import('monaco-editor/esm/vs/editor/editor.api').MarkerSeverity;
  export const CancellationToken: typeof import('monaco-editor/esm/vs/editor/editor.api').CancellationToken;
}

declare module 'monaco-editor/esm/vs/editor/editor.api' {
  export * from 'monaco-editor';
}