import React from 'react';
import { Card, CardBody } from 'reactstrap';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';

import CalendarToolbar from 'components/CalendarToolbar';

import { getDirection } from 'helpers/Utils';
// import data from 'data/events';

const localizer = momentLocalizer(moment);

const CalendarCard = ({ events }) => {
  return (
    <Card>
      <CardBody>
        <Calendar
          localizer={localizer}
          style={{ minHeight: '700px' }}
          events={events}
          rtl={getDirection().isRtl}
          views={['month']}
          components={{
            toolbar: CalendarToolbar
          }}
        />
      </CardBody>
    </Card>
  );
};
export default CalendarCard;
