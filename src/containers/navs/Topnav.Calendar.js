import clienteAxios from 'config/axios';
import ModalCalendar from 'containers/pages/ModalCalendar';
import React, { useEffect, useState } from 'react';
import { Button } from 'reactstrap';

const TopNavCalendar = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const getEvent = async () => {
      const processData = await clienteAxios.get('/event/all/bylawyer');
      console.log('Data', processData);
      setEvents(processData.data);
    };

    getEvent();
  }, []);

  const eventos = events.filter((e) => new Date(e.start) > Date.now());

  const handleOpenModal = () => {
    setModalOpen(!modalOpen);
  };
  return (
    <div className='position-relative d-inline-block'>
      <Button
        className='header-icon notificationButton'
        color='empty'
        onClick={handleOpenModal}
      >
        <i className='simple-icon-calendar' />
        <span className='count'>{eventos.length}</span>
      </Button>

      <ModalCalendar modalOpen={modalOpen} handleOpenModal={handleOpenModal} />
    </div>
  );
};

export default TopNavCalendar;
