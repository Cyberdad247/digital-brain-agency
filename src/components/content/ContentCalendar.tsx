import React from 'react';
import { Calendar } from '../ui/calendar';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';

const ContentCalendar = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  return (
    <Card>
      <CardHeader>
        <CardTitle>Content Calendar</CardTitle>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border"
        />
      </CardContent>
    </Card>
  );
};

export default ContentCalendar;
