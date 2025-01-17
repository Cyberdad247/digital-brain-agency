import * as React from 'react';
import { cn } from '@/lib/utils';
import { FormItemContext } from './form-hooks';

const FormLabel = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, ...props }, ref) => {
    const { id } = React.useContext(FormItemContext);

    return (
      <label
        ref={ref}
        htmlFor={id}
        className={cn(
          'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
          className
        )}
        {...props}
      />
    );
  }
);
FormLabel.displayName = 'FormLabel';

export { FormLabel };
