import React from 'react';
import { ActionProviderChildProps } from './ChatbotActionProvider';

interface MessageParserProps extends ActionProviderChildProps {
  children: React.ReactNode;
}

const MessageParser: React.FC<MessageParserProps> = ({ children, actions }) => {
  return (
    <div className="message-parser">
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { actions });
        }
        return child;
      })}
    </div>
  );
};

export default MessageParser;
