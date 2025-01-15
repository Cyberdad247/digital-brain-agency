import { useState } from 'react';
import { Folder, File, ChevronRight, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface FileNode {
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
}

const initialStructure: FileNode[] = [
  {
    name: 'src',
    type: 'folder',
    children: [
      {
        name: 'components',
        type: 'folder',
        children: [
          { name: 'Navigation.tsx', type: 'file' },
          { name: 'Chatbot.tsx', type: 'file' }
        ]
      },
      {
        name: 'pages',
        type: 'folder',
        children: [
          { name: 'Playground.tsx', type: 'file' },
          {
            name: 'components',
            type: 'folder',
            children: [
              { name: 'CodeEditor.tsx', type: 'file' },
              { name: 'ExtensionsPanel.tsx', type: 'file' },
              { name: 'TerminalPanel.tsx', type: 'file' }
            ]
          }
        ]
      },
      { name: 'main.tsx', type: 'file' },
      { name: 'App.tsx', type: 'file' }
    ]
  },
  {
    name: 'public',
    type: 'folder',
    children: [
      { name: 'favicon.ico', type: 'file' },
      { name: 'logo.jpg', type: 'file' }
    ]
  },
  { name: 'package.json', type: 'file' },
  { name: 'tsconfig.json', type: 'file' }
];

export default function ProjectExplorer() {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  const toggleFolder = (path: string) => {
    setExpandedFolders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(path)) {
        newSet.delete(path);
      } else {
        newSet.add(path);
      }
      return newSet;
    });
  };

  const renderTree = (nodes: FileNode[], path = '') => {
    return nodes.map((node, index) => {
      const nodePath = `${path}/${node.name}`;
      const isFolder = node.type === 'folder';
      const isExpanded = expandedFolders.has(nodePath);

      return (
        <div key={nodePath} className="pl-4">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2"
            onClick={() => isFolder && toggleFolder(nodePath)}
          >
            {isFolder ? (
              isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )
            ) : null}
            {isFolder ? (
              <Folder className="h-4 w-4" />
            ) : (
              <File className="h-4 w-4" />
            )}
            <span>{node.name}</span>
          </Button>

          {isFolder && isExpanded && node.children && (
            <div className="pl-4">
              {renderTree(node.children, nodePath)}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="h-full border-r">
      <div className="p-2 border-b">
        <h2 className="text-sm font-semibold">PROJECT EXPLORER</h2>
      </div>
      <ScrollArea className="h-[calc(100%-40px)]">
        {renderTree(initialStructure)}
      </ScrollArea>
    </div>
  );
}
