interface Message {
  message: string;
  type: string;
  id: number;
  widget?: string;
}

interface WidgetProps {
  actionProvider: {
    handleFAQ: () => void;
  };
}

interface Widget {
  widgetName: string;
  widgetFunc: (props: WidgetProps) => JSX.Element;
  props: object;
  mapStateToProps: string[];
}

interface ExtendedConfig {
  initialMessages: Message[];
  botName: string;
  customStyles: {
    botMessageBox: {
      backgroundColor: string;
    };
    chatButton: {
      backgroundColor: string;
    };
  };
  widgets: Widget[];
  persona?: {
    name: string;
    description: string;
    tone: string;
    examples: string[];
  };
}

const config: ExtendedConfig = {
  initialMessages: [
    {
      message: "Hello! How can I help you today?",
      type: "bot",
      id: 1,
      widget: "options"
    }
  ],
  botName: "DigitalBrain",
  customStyles: {
    botMessageBox: {
      backgroundColor: "#376B7E"
    },
    chatButton: {
      backgroundColor: "#376B7E"
    }
  },
  widgets: [
    {
      widgetName: "options",
      widgetFunc: (props) => (
        <div className="space-y-2">
          <button 
            onClick={() => props.actionProvider.handleFAQ()}
            className="block w-full text-left px-4 py-2 hover:bg-blue-50"
          >
            View FAQs
          </button>
        </div>
      ),
      props: {},
      mapStateToProps: []
    }
  ]
}

export default config
