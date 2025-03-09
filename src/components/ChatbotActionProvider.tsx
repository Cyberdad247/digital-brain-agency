import React from 'react';

interface ChatMessage {
  id: string;
  type: string;
  message: string;
  widget?: string;
}

export interface ChatState {
  messages: ChatMessage[];
}

interface ActionProviderProps {
  createChatBotMessage: (message: string, options?: { widget?: string }) => ChatMessage;
  setState: (callback: (prev: ChatState) => ChatState) => void;
  children?: React.ReactNode;
}

export interface ActionProviderChildProps {
  actions: {
    handleResponse: (message: string, isNewQuery: boolean) => void;
  };
}

class ActionProvider extends React.Component<ActionProviderProps> {
  constructor(props: ActionProviderProps) {
    super(props);
  }

  handleResponse = (message: string, isNewQuery: boolean) => {
    const botMessage = this.props.createChatBotMessage(message);
    this.props.setState((prev: ChatState) => ({
      ...prev,
      messages: isNewQuery ? [botMessage] : [...prev.messages, botMessage],
    }));
  };

  render() {
    return (
      <div>
        {React.Children.map(this.props.children, (child) => {
          if (React.isValidElement<ActionProviderChildProps>(child)) {
            return React.cloneElement<ActionProviderChildProps>(child, {
              actions: {
                handleResponse: this.handleResponse,
              },
            });
          }
          return child;
        })}
      </div>
    );
  }
}

export default ActionProvider;
