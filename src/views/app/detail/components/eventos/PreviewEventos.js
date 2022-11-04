import { Colxx } from 'components/common/CustomBootstrap';
import ModalEvent from 'containers/pages/ModalEvent';
import React, { useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { Card, CardBody, CardTitle, Row } from 'reactstrap';

const PreviewEventos = ({ event, events, setEvents, process }) => {
  const [modalOpenEvent, setModalOpenEvent] = useState(false);

  const { title, creado, start, end, _id } = event;

  const params = useParams();

  const fecha = creado.split('T')[0];

  const endEvento = end;

  const filtro = process.filter((pro) => pro.filingNumber === event.process);

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
                alignItems: 'center',
                marginBottom: 8
              }}
            >
              <p
                style={
                  params.id
                    ? {
                        fontSize: 18
                      }
                    : {
                        fontSize: 18,
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: 2,
                        overflow: 'hidden'
                      }
                }
              >
                {title}
              </p>
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
              {end === start ? null : (
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

            {event.process &&
              filtro.map((e) => (
                // eslint-disable-next-line no-underscore-dangle
                <NavLink to={`/app/detail/${e._id}`} key={e.name}>
                  <p>Proceso enlazado: {e.filingNumber}</p>
                </NavLink>
              ))}

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
