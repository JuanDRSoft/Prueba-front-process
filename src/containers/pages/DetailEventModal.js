import React from 'react';
import { Modal } from 'reactstrap';

const DetailEventModal = ({ modalOpen, modalOpenAction, dataEvent }) => {
  return (
    <Modal
      isOpen={modalOpen}
      toggle={modalOpenAction}
      wrapClassName='modal-center'
      backdrop='static'
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between'
        }}
      >
        <p className='pt-2 px-3' style={{ marginBottom: 0 }}>
          Información de evento
        </p>
        <button
          className='btn btn-link'
          type='button'
          style={{ marginBottom: -10 }}
          onClick={modalOpenAction}
        >
          Cerrar
        </button>
      </div>{' '}
      <div className='px-2 pb-2'>{dataEvent()}</div>
    </Modal>
  );
};

export default DetailEventModal;
