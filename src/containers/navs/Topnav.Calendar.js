import ModalCalendar from 'containers/pages/ModalCalendar';
import React, { useState } from 'react';
import { Button } from 'reactstrap';

const TopNavCalendar = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpenModal = () => {
    setModalOpen(!modalOpen);
  };
  return (
    <>
      <Button
        className='header-icon notificationButton'
        color='empty'
        onClick={handleOpenModal}
      >
        <i className='simple-icon-calendar' />
      </Button>

      <ModalCalendar modalOpen={modalOpen} handleOpenModal={handleOpenModal} />
    </>
  );
};

export default TopNavCalendar;
