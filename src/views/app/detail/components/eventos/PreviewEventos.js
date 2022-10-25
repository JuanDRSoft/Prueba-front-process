import { Colxx } from 'components/common/CustomBootstrap';
import ModalEvent from 'containers/pages/ModalEvent';
import React, { useState } from 'react';
import { Card, CardBody, CardTitle, Row } from 'reactstrap';

const PreviewEventos = ({ event, events, setEvents }) => {
  const [modalOpenEvent, setModalOpenEvent] = useState(false);

  const { title, creado, process, start, end, _id } = event;

  const fecha = creado.split('T')[0];

  const endEvento = end;

  const handleOpenModalEvent = () => {
    setModalOpenEvent(!modalOpenEvent);
  };

  return (
    <Row className='mt-2'>
      <Colxx>
        <Card>
          <CardBody className='pb-0'>
            <CardTitle
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              {title}
              <button
                type='button'
                className='btn btn-link'
                style={{
                  fontSize: 13,
                  marginRight: -20,
                  marginTop: -35,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5
                }}
                onClick={handleOpenModalEvent}
              >
                <i className='simple-icon-note' /> Editar
              </button>
            </CardTitle>

            <div style={{ display: 'flex' }}>
              <i className='simple-icon-clock mr-2 mt-1' />
              <p>
                Inicia: {start.split('T')[0]}
                {' / '}
                {start.split('T')[1].split(':00.')[0]}{' '}
                {start.split('T')[1].split(':')[0] > 11 ? 'pm' : 'am'}
              </p>
              {end && (
                <div style={{ display: 'flex' }}>
                  <p className='ml-2 mr-2'>|</p>{' '}
                  <p>
                    Termina: {end.split('T')[0]}
                    {' / '}
                    {end.split('T')[1].split(':00.')[0]}{' '}
                    {end.split('T')[1].split(':')[0] > 11 ? 'pm' : 'am'}
                  </p>
                </div>
              )}
            </div>

            {process && <p>Proceso enlazado: {process}</p>}

            <div
              style={{
                display: 'flex',
                justifyContent: 'end',
                alignItems: 'center'
              }}
            >
              <p
                style={{
                  fontSize: 10,
                  color: 'gray',
                  textAlign: 'end'
                }}
              >
                Creado: {fecha}
              </p>
            </div>
          </CardBody>
        </Card>
      </Colxx>

      <ModalEvent
        handleOpenModalEvent={handleOpenModalEvent}
        modalOpenEvent={modalOpenEvent}
        setEvents={setEvents}
        events={events}
        event={event}
        id={_id}
        endEvento={endEvento}
      />
    </Row>
  );
};

export default PreviewEventos;
