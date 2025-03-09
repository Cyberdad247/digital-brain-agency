import * as React from 'react';

interface RouteWrapperProps {
  children?: React.ReactNode;
}

/**
 * A type-safe wrapper component for routes that provides consistent padding
 * and layout structure across the application.
 */
export const RouteWrapper: React.FC<RouteWrapperProps> = ({ children }) => (
  <div className="pt-20">{children}</div>
);

RouteWrapper.displayName = 'RouteWrapper';