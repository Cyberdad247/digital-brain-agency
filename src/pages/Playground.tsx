import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { File, Folder, Plus } from 'lucide-react';
import CodeEditor from '@/pages/components/CodeEditor';
import ExtensionsPanel from '@/pages/components/ExtensionsPanel';
import TerminalPanel from '@/pages/components/TerminalPanel';
import ProjectExplorer from '@/pages/components/ProjectExplorer';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';

export default function Playground() {
  const navigate = useNavigate();
  const [code, setCode] = useState<string>('');
  const [diagnostics, setDiagnostics] = useState([]);

  const handleRunCode = async (code: string) => {
    // TODO: Implement code execution
    console.log('Running code:', code);
  };

  const handleAddTerminalOutput = (output: (string | { message: string })[]) => {
    // Terminal output is now handled internally by TerminalPanel
    console.log('Terminal output:', output);
  };

  const handleNewFile = () => {
    // TODO: Implement new file creation
    console.log('Creating new file');
  };

  const handleOpenFolder = () => {
    // TODO: Implement folder opening
    console.log('Opening folder');
  };

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log('Saving file');
  };

  const handleRun = () => {
    handleRunCode(code);
  };

  const handleDebug = () => {
    try {
      // Simulate different types of errors for testing
      const errors = [
        new TypeError('Invalid data type'),
        new SyntaxError('Invalid syntax'),
        new ReferenceError('Variable not defined'),
        new Error('Generic error'),
      ];

      // Randomly throw one of the errors
      throw errors[Math.floor(Math.random() * errors.length)];
    } catch (error) {
      if (error instanceof Error) {
        throw error; // Let error boundary handle it
      }
    }
  };

  return (
    <div className="relative h-[calc(100vh-4rem)] overflow-hidden bg-[#0d0d0d]">
      <div className="absolute left-4 top-4 z-50">
        <img
          src="/logo.jpg"
          alt="Home"
          className="h-12 w-12 cursor-pointer transition-opacity hover:opacity-80"
          onClick={() => navigate('/')}
        />
      </div>

      {/* Top Toolbar */}
      <div className="absolute right-4 top-4 z-50 flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleNewFile}
          className="transition-all hover:bg-[#1f2023] hover:text-[#67e8f9] hover:shadow-[0_0_8px_rgba(103,232,249,0.3)]"
        >
          <File className="mr-2 h-4 w-4" />
          New File
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleOpenFolder}
          className="transition-all hover:bg-[#1f2023] hover:text-[#67e8f9] hover:shadow-[0_0_8px_rgba(103,232,249,0.3)]"
        >
          <Folder className="mr-2 h-4 w-4" />
          Open Folder
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleSave}
          className="transition-all hover:bg-[#1f2023] hover:text-[#67e8f9] hover:shadow-[0_0_8px_rgba(103,232,249,0.3)]"
        >
          Save
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRun}
          className="transition-all hover:bg-[#1f2023] hover:text-[#67e8f9] hover:shadow-[0_0_8px_rgba(103,232,249,0.3)]"
        >
          Run
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleDebug}
          className="transition-all hover:bg-[#1f2023] hover:text-[#67e8f9] hover:shadow-[0_0_8px_rgba(103,232,249,0.3)]"
        >
          Debug
        </Button>
      </div>

      <ResizablePanelGroup direction="horizontal" className="p-4">
        {/* Left Panel - File Explorer */}
        <ResizablePanel defaultSize={15} minSize={10} maxSize={20}>
          <div className="h-full border-r border-[#1f2023] p-2 shadow-[0_0_8px_rgba(103,232,249,0.1)]">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-semibold">Explorer</h3>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <ProjectExplorer />
          </div>
        </ResizablePanel>

        <ResizableHandle
          withHandle
          className="bg-[#1f2023] transition-colors hover:bg-[#67e8f9]/20"
        />

        {/* Center Panel - Code Editor */}
        <ResizablePanel defaultSize={55} minSize={40}>
          <Tabs defaultValue="code" className="h-full">
            <TabsList className="w-full justify-start border border-[#67e8f9]/20 bg-[#1f2023]">
              <TabsTrigger
                value="code"
                className="data-[state=active]:bg-[#67e8f9]/10 data-[state=active]:text-[#67e8f9] data-[state=active]:shadow-[0_0_8px_rgba(103,232,249,0.2)]"
              >
                Code Editor
              </TabsTrigger>
            </TabsList>
            <TabsContent value="code" className="h-[calc(100%-2.5rem)] border border-[#67e8f9]/20">
              <CodeEditor
                onCodeChange={setCode}
                onRunCode={handleRunCode}
                diagnostics={diagnostics}
                addTerminalOutput={handleAddTerminalOutput}
              />
            </TabsContent>
          </Tabs>
        </ResizablePanel>

        <ResizableHandle
          withHandle
          className="bg-[#1f2023] transition-colors hover:bg-[#67e8f9]/20"
        />

        {/* Right Panel - Extensions & Terminal */}
        <ResizablePanel defaultSize={30} minSize={20} maxSize={40}>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel defaultSize={60} minSize={30}>
              <Tabs defaultValue="extensions" className="h-full">
                <TabsList className="w-full justify-start border border-[#67e8f9]/20 bg-[#1f2023]">
                  <TabsTrigger
                    value="extensions"
                    className="data-[state=active]:bg-[#67e8f9]/10 data-[state=active]:text-[#67e8f9] data-[state=active]:shadow-[0_0_8px_rgba(103,232,249,0.2)]"
                  >
                    Extensions
                  </TabsTrigger>
                </TabsList>
                <TabsContent
                  value="extensions"
                  className="h-[calc(100%-2.5rem)] border border-[#67e8f9]/20"
                >
                  <ExtensionsPanel />
                </TabsContent>
              </Tabs>
            </ResizablePanel>

            <ResizableHandle
              withHandle
              className="bg-[#1f2023] transition-colors hover:bg-[#67e8f9]/20"
            />

            <ResizablePanel defaultSize={40} minSize={20}>
              <TerminalPanel />
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
