import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function LandingPageBuilder() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ctaText, setCtaText] = useState('');
  const [ctaLink, setCtaLink] = useState('');
  const [customCSS, setCustomCSS] = useState('');
  const [customJS, setCustomJS] = useState('');

  const generatedHTML = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <style>
        ${customCSS}
      </style>
    </head>
    <body>
      <header>
        <h1>${title}</h1>
        <p>${description}</p>
        <a href="${ctaLink}">${ctaText}</a>
      </header>
      <script>
        ${customJS}
      </script>
    </body>
    </html>
  `;

  return (
    <div className="container mx-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Form Section */}
      <Card>
        <CardHeader>
          <CardTitle>Landing Page Builder</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Page Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter page title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter page description"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ctaText">Button Text</Label>
              <Input
                id="ctaText"
                value={ctaText}
                onChange={(e) => setCtaText(e.target.value)}
                placeholder="Enter CTA text"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ctaLink">Button Link</Label>
              <Input
                id="ctaLink"
                value={ctaLink}
                onChange={(e) => setCtaLink(e.target.value)}
                placeholder="Enter CTA link"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preview Section */}
      <Card>
        <CardHeader>
          <CardTitle>Generated Output</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="preview" className="w-full">
            <TabsList>
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="html">HTML</TabsTrigger>
              <TabsTrigger value="css">CSS</TabsTrigger>
              <TabsTrigger value="js">JavaScript</TabsTrigger>
            </TabsList>
            
            <TabsContent value="preview">
              <iframe
                srcDoc={generatedHTML}
                className="w-full h-[500px] border rounded"
                title="Landing Page Preview"
              />
            </TabsContent>
            
            <TabsContent value="html">
              <pre className="p-4 bg-gray-100 rounded">
                <code>{generatedHTML}</code>
              </pre>
            </TabsContent>
            
            <TabsContent value="css">
              <Textarea
                value={customCSS}
                onChange={(e) => setCustomCSS(e.target.value)}
                className="min-h-[300px]"
              />
            </TabsContent>
            
            <TabsContent value="js">
              <Textarea
                value={customJS}
                onChange={(e) => setCustomJS(e.target.value)}
                className="min-h-[300px]"
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
