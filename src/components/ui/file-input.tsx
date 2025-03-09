import * as React from 'react';
import { Button } from './button';
import { FileText } from 'lucide-react';

interface FileInputProps {
  accept?: string;
  onChange: (file: File) => void;
}

const FileInput = React.forwardRef<HTMLInputElement, FileInputProps>(
  ({ accept, onChange }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        onChange(file);
      }
    };

    return (
      <div className="file-input">
        <input type="file" accept={accept} onChange={handleChange} ref={ref} className="hidden" />
        <Button
          variant="outline"
          onClick={() => (ref as React.RefObject<HTMLInputElement>).current?.click()}
        >
          <FileText className="mr-2 h-4 w-4" />
          Upload File
        </Button>
      </div>
    );
  }
);

FileInput.displayName = 'FileInput';

export { FileInput };
