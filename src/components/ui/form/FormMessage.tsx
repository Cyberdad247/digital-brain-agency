import * as React from 'react';
import { cn } from '@/lib/utils';
import { FormItemContext } from './form-hooks';

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { id } = React.useContext(FormItemContext);
  const body = children ? (
    <p
      ref={ref}
      id={`${id}-message`}
      className={cn('text-sm font-medium text-destructive', className)}
      {...props}
    >
      {children}
    </p>
  ) : null;

  return body;
});
FormMessage.displayName = 'FormMessage';

export { FormMessage };
