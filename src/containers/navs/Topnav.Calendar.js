import clienteAxios from 'config/axios';
import ModalCalendar from 'containers/pages/ModalCalendar';
import React, { useEffect, useState } from 'react';
import { Button } from 'reactstrap';

const TopNavCalendar = ({ authUser }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [lawyer, setLawyer] = useState({});
  const [role, setRole] = useState('');

  const { currentUser } = authUser;

  useEffect(() => {
    const getEvent = async () => {
      const processData = await clienteAxios.get('/event/all/bylawyer');
      console.log('Data', processData);
      setEvents(processData.data);
    };
    const getLawyer = async () => {
      const data = await clienteAxios.get(`/lawyer/${currentUser.id}`);
      setLawyer(data.data);
      setRole('Admin');
    };

    getLawyer();
    getEvent();
  }, []);

  useEffect(() => {
    if (lawyer === null || lawyer === undefined) {
      const getCollaborator = async () => {
        const data = await clienteAxios.get(`/collaborator/${currentUser.id}`);
        setLawyer(data.data);
        setRole('Read');
      };
      getCollaborator();
    }
  }, [lawyer]);

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

      <ModalCalendar
        modalOpen={modalOpen}
        handleOpenModal={handleOpenModal}
        role={role}
      />
    </div>
  );
};

export default TopNavCalendar;
