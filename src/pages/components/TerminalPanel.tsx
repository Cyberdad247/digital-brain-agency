import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Terminal,
  ChevronRight,
  Bug,
  Play,
  Pause,
  StepForward,
  ListTree,
  Variable,
} from 'lucide-react';

interface DebugState {
  isRunning: boolean;
  breakpoints: number[];
  currentLine: number | null;
  variables: Record<string, unknown>;
  callStack: string[];
}

export default function TerminalPanel() {
  const [output, setOutput] = useState<string[]>([]);
  const [command, setCommand] = useState('');
  const [debugState, setDebugState] = useState<DebugState>({
    isRunning: false,
    breakpoints: [],
    currentLine: null,
    variables: {},
    callStack: [],
  });
  const [activeTab, setActiveTab] = useState('terminal');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const executeCommand = async (cmd: string) => {
    if (!cmd) return;

    setOutput((prev) => [...prev, `$ ${cmd}`]);
    setCommand('');

    try {
      // Simulate command execution
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Simulate command output
      const result = `Command '${cmd}' executed successfully`;
      setOutput((prev) => [...prev, result]);
    } catch (error) {
      setOutput((prev) => [...prev, `Error: ${error.message}`]);
    }
  };

  const startDebugging = () => {
    setDebugState((prev) => ({
      ...prev,
      isRunning: true,
      currentLine: 1,
    }));
    setOutput((prev) => [...prev, 'Debugger started']);
  };

  const pauseDebugging = () => {
    setDebugState((prev) => ({
      ...prev,
      isRunning: false,
    }));
    setOutput((prev) => [...prev, 'Debugger paused']);
  };

  const stepThroughCode = () => {
    setDebugState((prev) => ({
      ...prev,
      currentLine: (prev.currentLine || 0) + 1,
    }));
    setOutput((prev) => [...prev, `Stepping to line ${debugState.currentLine}`]);
  };

  const toggleBreakpoint = (lineNumber: number) => {
    setDebugState((prev) => {
      const breakpoints = prev.breakpoints.includes(lineNumber)
        ? prev.breakpoints.filter((bp) => bp !== lineNumber)
        : [...prev.breakpoints, lineNumber];

      return {
        ...prev,
        breakpoints,
      };
    });
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [output]);

  return (
    <motion.div
      className="rounded-lg border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="border-b p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="terminal" className="gap-2">
              <Terminal className="h-4 w-4" />
              Terminal
            </TabsTrigger>
            <TabsTrigger value="debug" className="gap-2">
              <Bug className="h-4 w-4" />
              Debug
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {activeTab === 'debug' && (
        <div className="border-b p-4">
          <div className="flex gap-2">
            <Button variant="outline" onClick={startDebugging} disabled={debugState.isRunning}>
              <Play className="mr-2 h-4 w-4" />
              Start
            </Button>
            <Button variant="outline" onClick={pauseDebugging} disabled={!debugState.isRunning}>
              <Pause className="mr-2 h-4 w-4" />
              Pause
            </Button>
            <Button variant="outline" onClick={stepThroughCode} disabled={!debugState.isRunning}>
              <StepForward className="mr-2 h-4 w-4" />
              Step
            </Button>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <h4 className="mb-2 flex items-center gap-2 font-medium">
                <Variable className="h-4 w-4" />
                Variables
              </h4>
              <div className="space-y-1 text-sm">
                {Object.entries(debugState.variables).map(([name, value]) => (
                  <div key={name} className="flex gap-2">
                    <span className="font-medium">{name}:</span>
                    <span>{JSON.stringify(value)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="mb-2 flex items-center gap-2 font-medium">
                <ListTree className="h-4 w-4" />
                Call Stack
              </h4>
              <div className="space-y-1 text-sm">
                {debugState.callStack.map((frame, index) => (
                  <div key={index}>{frame}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <ScrollArea className="h-[300px] p-4" ref={scrollAreaRef}>
        <div className="space-y-1">
          {output.map((line, index) => (
            <div key={index} className="font-mono text-sm">
              {line}
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="border-t p-4">
        <div className="flex items-center gap-2">
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <Input
            className="flex-1"
            placeholder="Enter command..."
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                executeCommand(command);
              }
            }}
          />
          <Button onClick={() => executeCommand(command)} disabled={!command}>
            Run
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
