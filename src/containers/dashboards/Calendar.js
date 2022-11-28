import React, { useState, useEffect } from 'react';
import { Card, CardBody } from 'reactstrap';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';

import CalendarToolbar from 'components/CalendarToolbar';

import { getDirection } from 'helpers/Utils';
import DetailEventModal from 'containers/pages/DetailEventModal';
import PreviewEventos from 'views/app/detail/components/eventos/PreviewEventos';

// import data from 'data/events';

const localizer = momentLocalizer(moment);

const CalendarCard = ({ events, process, setEvents }) => {
  const [event, setEvent] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const modalOpenAction = () => {
    setModalOpen(!modalOpen);
  };

  // eslint-disable-next-line no-underscore-dangle
  const evento = events.filter((e) => e._id === event._id);
  const dataEvent = () => {
    return evento.map((e) => (
      <PreviewEventos
        event={e}
        key={e}
        process={process}
        events={events}
        setEvents={setEvents}
      />
    ));
  };

  useEffect(() => {
    if (event !== '') {
      modalOpenAction();
    }
  }, [event]);

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
          onSelectEvent={(e) => setEvent(e)}
        />
      </CardBody>

      <DetailEventModal
        modalOpen={modalOpen}
        event={event}
        modalOpenAction={modalOpenAction}
        process={process}
        dataEvent={dataEvent}
      />
    </Card>
  );
};
export default CalendarCard;
