import * as React from 'react';
import { FormItemContext } from './form-hooks';

const FormControl = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ ...props }, ref) => {
    const { id } = React.useContext(FormItemContext);

    return <div ref={ref} id={id} {...props} />;
  }
);
FormControl.displayName = 'FormControl';

export { FormControl };
