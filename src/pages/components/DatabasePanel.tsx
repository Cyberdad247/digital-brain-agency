import { useState } from 'react';
import { Database, Table, Columns, Plus, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TableSchema {
  name: string;
  columns: ColumnDefinition[];
}

interface ColumnDefinition {
  name: string;
  type: string;
  primaryKey?: boolean;
  nullable?: boolean;
}

export default function DatabasePanel() {
  const [tables, setTables] = useState<TableSchema[]>([]);
  const [activeTab, setActiveTab] = useState<'schema' | 'query'>('schema');
  const [query, setQuery] = useState('');
  const [queryResult, setQueryResult] = useState<Record<string, unknown>[]>([]);

  const addTable = () => {
    const newTable: TableSchema = {
      name: `table_${tables.length + 1}`,
      columns: [{ name: 'id', type: 'integer', primaryKey: true }],
    };
    setTables([...tables, newTable]);
  };

  const executeQuery = () => {
    // Simulate query execution
    setQueryResult([
      {
        id: 1,
        message: 'Query executed successfully',
      },
    ]);
  };

  return (
    <div className="flex h-full flex-col">
      <div className="border-b p-2">
        <Tabs value={activeTab} onValueChange={(value: 'schema' | 'query') => setActiveTab(value)}>
          <TabsList>
            <TabsTrigger value="schema" className="gap-2">
              <Table className="h-4 w-4" />
              Schema
            </TabsTrigger>
            <TabsTrigger value="query" className="gap-2">
              <Database className="h-4 w-4" />
              Query
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {activeTab === 'schema' && (
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            <Button onClick={addTable} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Table
            </Button>

            {tables.map((table, index) => (
              <div key={index} className="rounded-lg border p-4">
                <div className="mb-4 flex items-center gap-2">
                  <Table className="h-4 w-4" />
                  <h3 className="font-medium">{table.name}</h3>
                </div>

                <div className="space-y-2">
                  {table.columns.map((column, colIndex) => (
                    <div key={colIndex} className="flex items-center gap-4">
                      <Columns className="h-4 w-4" />
                      <div className="flex-1">
                        <Input
                          value={column.name}
                          onChange={(e) => {
                            const newTables = [...tables];
                            newTables[index].columns[colIndex].name = e.target.value;
                            setTables(newTables);
                          }}
                        />
                      </div>
                      <div className="w-32">
                        <Input
                          value={column.type}
                          onChange={(e) => {
                            const newTables = [...tables];
                            newTables[index].columns[colIndex].type = e.target.value;
                            setTables(newTables);
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}

      {activeTab === 'query' && (
        <div className="flex flex-1 flex-col">
          <div className="border-b p-4">
            <div className="flex items-center gap-2">
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter SQL query..."
              />
              <Button onClick={executeQuery} className="gap-2">
                <Play className="h-4 w-4" />
                Execute
              </Button>
            </div>
          </div>

          <ScrollArea className="flex-1 p-4">
            <div className="space-y-2">
              {queryResult.map((row, index) => (
                <pre key={index} className="text-sm">
                  {JSON.stringify(row, null, 2)}
                </pre>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
