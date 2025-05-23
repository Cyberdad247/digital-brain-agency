import React, { useState, useRef, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { v4 as uuidv4 } from 'uuid';

// Define component types for the no-code IDE
interface UIComponent {
  id: string;
  type: string;
  properties: Record<string, any>;
  children?: UIComponent[];
  parent?: string;
}

interface DeploymentTemplate {
  id: string;
  name: string;
  description: string;
  config: Record<string, any>;
}

interface VoiceCommand {
  command: string;
  action: string;
  params?: Record<string, any>;
}

export const NoCodeIDE: React.FC = () => {
  // State for UI components
  const [components, setComponents] = useState<UIComponent[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<UIComponent | null>(null);
  const [draggedComponent, setDraggedComponent] = useState<string | null>(null);
  
  // State for deployment templates
  const [templates, setTemplates] = useState<DeploymentTemplate[]>([
    {
      id: '1',
      name: 'Basic Web App',
      description: 'Simple web application with HTML, CSS, and JavaScript',
      config: { framework: 'vanilla', port: 3000 }
    },
    {
      id: '2',
      name: 'React App',
      description: 'React application with Vite build system',
      config: { framework: 'react', port: 3000 }
    },
    {
      id: '3',
      name: 'API Server',
      description: 'FastAPI server for backend services',
      config: { framework: 'fastapi', port: 8000 }
    }
  ]);
  
  // State for voice commands
  const [voiceCommands, setVoiceCommands] = useState<VoiceCommand[]>([
    { command: 'add button', action: 'addComponent', params: { type: 'button' } },
    { command: 'add input', action: 'addComponent', params: { type: 'input' } },
    { command: 'add card', action: 'addComponent', params: { type: 'card' } },
    { command: 'delete selected', action: 'deleteComponent' },
    { command: 'deploy application', action: 'deployProject' }
  ]);
  
  // State for active tab
  const [activeTab, setActiveTab] = useState('design');
  
  // State for deployment status
  const [deploymentStatus, setDeploymentStatus] = useState<'idle' | 'deploying' | 'success' | 'error'>('idle');
  const [deploymentMessage, setDeploymentMessage] = useState('');
  
  // Canvas ref for drag and drop
  const canvasRef = useRef<HTMLDivElement>(null);
  
  // Component palette - available components to drag
  const componentPalette = [
    { type: 'button', label: 'Button', icon: '🔘' },
    { type: 'input', label: 'Input', icon: '📝' },
    { type: 'card', label: 'Card', icon: '🃏' },
    { type: 'text', label: 'Text', icon: 'Aa' },
    { type: 'image', label: 'Image', icon: '🖼️' },
    { type: 'container', label: 'Container', icon: '📦' }
  ];
  
  // Handle drag start
  const handleDragStart = (type: string) => {
    setDraggedComponent(type);
  };
  
  // Handle drag over
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  
  // Handle drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedComponent && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Create new component
      const newComponent: UIComponent = {
        id: uuidv4(),
        type: draggedComponent,
        properties: {
          x,
          y,
          width: 100,
          height: 40,
          text: `New ${draggedComponent}`,
          style: {}
        }
      };
      
      setComponents([...components, newComponent]);
      setSelectedComponent(newComponent);
      setDraggedComponent(null);
    }
  };
  
  // Handle component selection
  const handleSelectComponent = (component: UIComponent) => {
    setSelectedComponent(component);
  };
  
  // Handle property change
  const handlePropertyChange = (property: string, value: any) => {
    if (selectedComponent) {
      const updatedComponent = {
        ...selectedComponent,
        properties: {
          ...selectedComponent.properties,
          [property]: value
        }
      };
      
      const updatedComponents = components.map(comp => 
        comp.id === selectedComponent.id ? updatedComponent : comp
      );
      
      setComponents(updatedComponents);
      setSelectedComponent(updatedComponent);
    }
  };
  
  // Handle component deletion
  const handleDeleteComponent = () => {
    if (selectedComponent) {
      const updatedComponents = components.filter(comp => comp.id !== selectedComponent.id);
      setComponents(updatedComponents);
      setSelectedComponent(null);
    }
  };
  
  // Handle deployment
  const handleDeploy = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setDeploymentStatus('deploying');
      setDeploymentMessage(`Deploying ${template.name}...`);
      
      // Simulate deployment process
      setTimeout(() => {
        setDeploymentStatus('success');
        setDeploymentMessage(`Successfully deployed ${template.name} at http://localhost:${template.config.port}`);
      }, 2000);
    }
  };
  
  // Handle voice command
  const processVoiceCommand = (command: string) => {
    const matchedCommand = voiceCommands.find(vc => 
      command.toLowerCase().includes(vc.command.toLowerCase())
    );
    
    if (matchedCommand) {
      switch (matchedCommand.action) {
        case 'addComponent':
          if (matchedCommand.params?.type) {
            const newComponent: UIComponent = {
              id: uuidv4(),
              type: matchedCommand.params.type,
              properties: {
                x: 100,
                y: 100,
                width: 100,
                height: 40,
                text: `New ${matchedCommand.params.type}`,
                style: {}
              }
            };
            setComponents([...components, newComponent]);
            setSelectedComponent(newComponent);
          }
          break;
          
        case 'deleteComponent':
          handleDeleteComponent();
          break;
          
        case 'deployProject':
          setActiveTab('deploy');
          break;
          
        default:
          break;
      }
    }
  };
  
  // Add a new voice command
  const handleAddVoiceCommand = (command: string, action: string, params?: Record<string, any>) => {
    const newCommand: VoiceCommand = { command, action, params };
    setVoiceCommands([...voiceCommands, newCommand]);
  };
  
  // Render component in canvas
  const renderComponent = (component: UIComponent) => {
    const { type, properties, id } = component;
    const isSelected = selectedComponent?.id === id;
    const style = {
      position: 'absolute' as const,
      left: `${properties.x}px`,
      top: `${properties.y}px`,
      width: `${properties.width}px`,
      height: `${properties.height}px`,
      border: isSelected ? '2px solid blue' : '1px solid #ddd',
      padding: '4px',
      backgroundColor: properties.style?.backgroundColor || 'white',
      color: properties.style?.color || 'black',
      borderRadius: properties.style?.borderRadius || '4px',
      cursor: 'pointer',
      zIndex: isSelected ? 10 : 1
    };
    
    switch (type) {
      case 'button':
        return (
          <div 
            key={id}
            style={style}
            onClick={(e) => {
              e.stopPropagation();
              handleSelectComponent(component);
            }}
          >
            <Button className="w-full h-full">{properties.text}</Button>
          </div>
        );
        
      case 'input':
        return (
          <div 
            key={id}
            style={style}
            onClick={(e) => {
              e.stopPropagation();
              handleSelectComponent(component);
            }}
          >
            <Input placeholder={properties.text} className="w-full h-full" />
          </div>
        );
        
      case 'card':
        return (
          <div 
            key={id}
            style={style}
            onClick={(e) => {
              e.stopPropagation();
              handleSelectComponent(component);
            }}
          >
            <Card className="w-full h-full p-2">{properties.text}</Card>
          </div>
        );
        
      case 'text':
        return (
          <div 
            key={id}
            style={style}
            onClick={(e) => {
              e.stopPropagation();
              handleSelectComponent(component);
            }}
          >
            {properties.text}
          </div>
        );
        
      case 'image':
        return (
          <div 
            key={id}
            style={style}
            onClick={(e) => {
              e.stopPropagation();
              handleSelectComponent(component);
            }}
          >
            <img 
              src={properties.src || '/placeholder.svg'} 
              alt={properties.alt || 'Image'} 
              className="w-full h-full object-cover"
            />
          </div>
        );
        
      case 'container':
        return (
          <div 
            key={id}
            style={{
              ...style,
              backgroundColor: 'rgba(200, 200, 200, 0.2)',
              border: isSelected ? '2px solid blue' : '1px dashed #aaa'
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleSelectComponent(component);
            }}
          >
            {properties.text}
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="flex flex-col w-full h-full min-h-[600px] bg-gray-50 rounded-lg overflow-hidden border">
      <div className="bg-gray-100 p-4 border-b">
        <h2 className="text-xl font-bold">No-Code IDE</h2>
        <p className="text-sm text-gray-500">Design, configure, and deploy your application</p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="border-b px-4">
          <TabsList className="mt-2">
            <TabsTrigger value="design">Design</TabsTrigger>
            <TabsTrigger value="voice">Voice Commands</TabsTrigger>
            <TabsTrigger value="deploy">Deploy</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="design" className="flex-1 flex overflow-hidden p-0">
          <div className="w-64 border-r bg-gray-50 p-4 flex flex-col h-full">
            <h3 className="font-medium mb-2">Components</h3>
            <div className="grid grid-cols-2 gap-2">
              {componentPalette.map((comp) => (
                <div
                  key={comp.type}
                  className="flex flex-col items-center justify-center p-2 bg-white rounded border cursor-grab hover:bg-gray-50 transition-colors"
                  draggable
                  onDragStart={() => handleDragStart(comp.type)}
                >
                  <div className="text-xl mb-1">{comp.icon}</div>
                  <span className="text-xs">{comp.label}</span>
                </div>
              ))}
            </div>
            
            <Separator className="my-4" />
            
            {selectedComponent && (
              <div className="flex-1 overflow-auto">
                <h3 className="font-medium mb-2">Properties</h3>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="text">Text</Label>
                    <Input
                      id="text"
                      value={selectedComponent.properties.text || ''}
                      onChange={(e) => handlePropertyChange('text', e.target.value)}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="x">X</Label>
                      <Input
                        id="x"
                        type="number"
                        value={selectedComponent.properties.x}
                        onChange={(e) => handlePropertyChange('x', parseInt(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="y">Y</Label>
                      <Input
                        id="y