import React, { useState, useEffect } from 'react';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Row
} from 'reactstrap';
import PreviewEventos from 'views/app/detail/components/eventos/PreviewEventos';
import { Colxx } from 'components/common/CustomBootstrap';
import IntlMessages from 'helpers/IntlMessages';
import CalendarCard from 'containers/dashboards/Calendar';
import moment from 'moment';
import clienteAxios from 'config/axios';
import ModalEvent from './ModalEvent';

const ModalCalendar = ({ modalOpen, handleOpenModal }) => {
  const [modalOpenEvent, setModalOpenEvent] = useState(false);
  const [events, setEvents] = useState([]);
  const [now] = useState(new Date());

  useEffect(() => {
    const getAllData = async () => {
      const countDataAll = await clienteAxios.get('/event/all/bylawyer');
      setEvents(countDataAll.data);
    };

    getAllData();
  }, []);

  const label = (e) => {
    const date = moment(e);
    return (
      <span>
        <span>{date.format('MMMM')} </span>
        <span>
          {' '}
          {date.format('DD')}
          {','}
        </span>
        <span> {date.format('YYYY')}</span>
      </span>
    );
  };

  const handleOpenModalEvent = () => {
    setModalOpenEvent(!modalOpenEvent);
  };

  return (
    <Modal
      isOpen={modalOpen}
      toggle={handleOpenModal}
      wrapClassName='modal-right-calendar'
      backdrop='static'
    >
      <ModalHeader toggle={handleOpenModal} style={{ display: 'flex' }}>
        <div>
          <IntlMessages id='Mi Agenda' />
        </div>
        <span style={{ fontSize: 12 }}>{label(now)}</span>
      </ModalHeader>
      <ModalBody>
        <CalendarCard events={events} />

        <Row className='mt-5'>
          <Colxx>
            <h1>Proximos eventos</h1>
          </Colxx>
        </Row>

        {events.length > 0 ? (
          events.map((event) => <PreviewEventos event={event} key={event} />)
        ) : (
          <p style={{ textAlign: 'center', marginTop: 10 }}>
            NO HAY EVENTOS REGISTRADOS AUN
          </p>
        )}
      </ModalBody>
      <ModalFooter>
        <Button color='secondary' outline onClick={handleOpenModal}>
          <IntlMessages id='Cerrar' />
        </Button>
        {/* {loading && <Spinner color='primary' className='mb-1' />} */}
        <Button color='primary' onClick={handleOpenModalEvent}>
          <IntlMessages id='Agregar Evento' />
        </Button>
      </ModalFooter>

      <ModalEvent
        handleOpenModalEvent={handleOpenModalEvent}
        modalOpenEvent={modalOpenEvent}
        setEvents={setEvents}
        events={events}
      />
    </Modal>
  );
};

export default ModalCalendar;
