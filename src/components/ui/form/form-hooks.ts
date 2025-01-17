import * as React from 'react';

const FormItemContext = React.createContext<{ id: string }>({
  id: '',
});

export { FormItemContext };
