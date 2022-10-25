import React, { useState, useEffect } from 'react';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Spinner,
  Input,
  Label,
  Row
} from 'reactstrap';
import IntlMessages from 'helpers/IntlMessages';
import { NotificationManager } from 'components/common/react-notifications';
import { Colxx } from 'components/common/CustomBootstrap';
import ReactAutoSugegstExample from 'containers/forms/ReactAutoSugegstExample';
import axios from 'axios';
import uri from 'constants/api';

const ModalEvent = ({
  modalOpenEvent,
  handleOpenModalEvent,
  setEvents,
  events,
  event,
  id,
  endEvento
}) => {
  const [creado] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [end, setEnd] = useState('');
  const [start, setStart] = useState('');
  const [title, setTitle] = useState('');
  const [process, setProcess] = useState('');

  useEffect(() => {
    if (id) {
      setStart(event.start.split(':00.')[0]);
      setTitle(event.title);
      setProcess(event.process);
    }
  }, []);

  useEffect(() => {
    if (endEvento) {
      setEnd(endEvento.split(':00.')[0]);
    }
  }, [endEvento]);

  const lawyer = localStorage.getItem('token');

  const createNotification = (type, className, msg) => {
    const cName = className || '';
    switch (type) {
      case 'error':
        NotificationManager.error(
          msg,
          'ERROR!',
          2000,
          () => {
            /* alert('callback'); */
          },
          null,
          cName
        );
        break;
      case 'success':
        NotificationManager.success(
          msg,
          'REGISTRO!',
          2000,
          () => {
            /* alert('callback'); */
          },
          null,
          cName
        );
        break;
      default:
        NotificationManager.info('Info message');
        break;
    }
  };

  const createEvent = async () => {
    setLoading(true);

    if ([start, title].includes('')) {
      createNotification('error', 'filled', 'Campos obligatorios');
      setLoading(false);
      return;
    }
    const final = end === '' ? start : end;

    try {
      const eventData = await axios.post(`${uri}/event`, {
        title,
        start,
        end: final,
        process,
        lawyer
      });
      setEvents([...events, eventData.data]);
      console.log(eventData.data);
      createNotification('success', 'filled', 'Evento registrado');

      setLoading(false);
      setTimeout(() => {
        handleOpenModalEvent();
      }, 2000);
    } catch (error) {
      createNotification('error', 'filled', 'Campos obligatorios');
      setLoading(false);
    }
  };

  const editEvent = async () => {
    setLoading(true);

    if ([start, title].includes('')) {
      createNotification('error', 'filled', 'Campos obligatorios');
      setLoading(false);
      return;
    }

    const final = end === '' ? start : end;

    try {
      const eventData = await axios.put(`${uri}/event/${id}`, {
        title,
        start,
        end: final,
        process,
        lawyer
      });

      const eventUpdate = events.map((e) =>
        // eslint-disable-next-line no-underscore-dangle
        e._id === id ? eventData.data : e
      );

      setEvents(eventUpdate);
      console.log(eventData.data);
      createNotification('success', 'filled', 'Evento editado correctamente');

      setLoading(false);
      setTimeout(() => {
        handleOpenModalEvent();
      }, 2000);
    } catch (error) {
      console.log(error);
      createNotification('error', 'filled', 'Campos obligatorios');
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={modalOpenEvent}
      toggle={handleOpenModalEvent}
      wrapClassName='modal-center'
      size='lg'
      backdrop='static'
    >
      <ModalHeader
        toggle={handleOpenModalEvent}
        style={{
          display: 'flex'
        }}
      >
        {id ? (
          <IntlMessages id='Edición De Evento' />
        ) : (
          <IntlMessages id='Registro De Evento' />
        )}
      </ModalHeader>

      <ModalBody>
        <Label>Fecha de registro: </Label>
        <Input value={creado} disabled />

        <Row className='mt-3'>
          <Colxx xxs='6'>
            <div>
              <Label>Fecha inicial del evento: </Label>
              <Input
                type='datetime-local'
                value={start}
                onChange={(e) => setStart(e.target.value)}
              />
            </div>
          </Colxx>

          <Colxx xxs='6'>
            <Label>Fecha final del evento: </Label>
            <Input
              type='datetime-local'
              value={end}
              onChange={(e) => setEnd(e.target.value)}
            />
          </Colxx>
        </Row>

        <Label className='mt-3'>Comentario o actividad: </Label>
        <Input
          type='text'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <Label className='mt-3'>Proceso enlazado: </Label>
        <ReactAutoSugegstExample process={process} setProcess={setProcess} />
      </ModalBody>

      <ModalFooter>
        <Button color='secondary' outline onClick={handleOpenModalEvent}>
          <IntlMessages id='pages.cancel' />
        </Button>
        {loading && <Spinner color='primary' className='mb-1' />}

        {id ? (
          <Button color='primary' onClick={editEvent} disabled={loading}>
            <IntlMessages id='Editar Evento' />
          </Button>
        ) : (
          <Button color='primary' onClick={createEvent} disabled={loading}>
            <IntlMessages id='Registrar Evento' />{' '}
          </Button>
        )}
      </ModalFooter>
    </Modal>
  );
};

export default ModalEvent;
