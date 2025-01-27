import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

const EmailListBuildingDashboard = () => {
  const [email, setEmail] = useState('');
  const [emailList, setEmailList] = useState<string[]>([]);

  const handleAddEmail = () => {
    if (email && !emailList.includes(email)) {
      setEmailList([...emailList, email]);
      setEmail('');
    }
  };

  return (
    <Card className="p-6">
      <div className="flex flex-col space-y-4">
        <h2 className="text-xl font-semibold">Email List Builder</h2>
        
        <div className="flex space-x-2">
          <Input
            type="email"
            placeholder="Enter email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button onClick={handleAddEmail}>Add Email</Button>
        </div>

        {emailList.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email Address</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {emailList.map((email, index) => (
                <TableRow key={index}>
                  <TableCell>{email}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </Card>
  );
};

export default EmailListBuildingDashboard;
