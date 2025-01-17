import * as React from 'react';
import { cn } from '@/lib/utils';
import { FormItem, FormLabel, FormControl, FormDescription, FormMessage } from './form/index';

const Form = ({ children }: { children: React.ReactNode }) => {
  return <form>{children}</form>;
};

export { Form, FormItem, FormLabel, FormControl, FormDescription, FormMessage };
