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
  Row,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';
import IntlMessages from 'helpers/IntlMessages';
import { NotificationManager } from 'components/common/react-notifications';
import { Colxx } from 'components/common/CustomBootstrap';
import ReactAutoSugegstExample from 'containers/forms/ReactAutoSugegstExample';
import axios from 'axios';
import uri from 'constants/api';
import ReactSelect from 'react-select';
import clienteAxios from 'config/axios';

const typeEvent = [
  { label: 'Procesales', value: 'Procesales' },
  { label: 'Extraprocesales', value: 'Extraprocesales' },
  { label: 'Tareas', value: 'Tareas' },
  { label: 'Compromisos', value: 'Compromisos' },
  { label: 'Audiencias', value: 'Audiencias' }
];

const ModalEvent = ({
  modalOpenEvent,
  handleOpenModalEvent,
  setEvents,
  events,
  event,
  id,
  endEvento,
  role
}) => {
  const [creado] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [end, setEnd] = useState('');
  const [start, setStart] = useState('');
  const [title, setTitle] = useState('');
  const [process, setProcess] = useState('');
  const [type, setType] = useState('');
  const [idLawyer, setIdLawyer] = useState();
  const [collaborator, setCollaborator] = useState({
    name: 'Seleccionar colaborador'
  });
  const [list, setList] = useState([]);
  const [assigned, setAssigned] = useState('');

  useEffect(() => {
    const getCollaborator = async () => {
      try {
        const data = await clienteAxios.get('/collaborator/all/bylawyer');

        setList(data.data);
      } catch (error) {
        console.log(error);
      }
    };

    getCollaborator();
  }, []);

  useEffect(() => {
    const lawyerId = localStorage.getItem('gogo_current_user');
    if (collaborator.name !== 'Seleccionar colaborador') {
      // eslint-disable-next-line no-underscore-dangle
      setIdLawyer(collaborator._id);
      setAssigned(lawyerId.split('title":"')[1].split('","id"')[0]);
    } else {
      setIdLawyer(lawyerId.split('"id":"')[1].split('","uid":')[0]);
    }
  }, [collaborator]);

  useEffect(() => {
    if (id) {
      setStart(event.start.split(':00.')[0]);
      setTitle(event.title);
      setProcess(event.process);
      setType({ label: event.type, value: event.type });
    }
  }, []);

  useEffect(() => {
    if (endEvento) {
      setEnd(endEvento.split(':00.')[0]);
    }
  }, [endEvento]);

  const lawyer = localStorage.getItem('token');

  const createNotification = (type1, className, msg) => {
    const cName = className || '';
    switch (type1) {
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

    if ([start, title, type].includes('')) {
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
        lawyer: idLawyer,
        type: type.value,
        assigned
      });

      if (eventData.data.assigned === '') {
        setEvents([...events, eventData.data]);
      }

      console.log(eventData.data);
      createNotification('success', 'filled', 'Evento registrado');

      setLoading(false);
      setTimeout(() => {
        setStart('');
        setTitle('');
        setProcess('');
        setType('');
        setEnd('');
        setCollaborator({
          name: 'Seleccionar colaborador'
        });

        handleOpenModalEvent();
      }, 2000);
    } catch (error) {
      createNotification('error', 'filled', 'Campos obligatorios');
      setLoading(false);
    }
  };

  const editEvent = async () => {
    setLoading(true);

    if ([start, title, type].includes('')) {
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
        lawyer,
        type: type.value
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

  const deletedEvent = async () => {
    try {
      const eventData = await axios.delete(`${uri}/event/${id}`);

      const eventUpdate = events.filter(
        (e) =>
          // eslint-disable-next-line no-underscore-dangle
          e._id !== id
      );

      setEvents(eventUpdate);

      console.log(eventData.data);
      createNotification('success', 'filled', 'Evento eliminado correctamente');

      setLoading(false);
      setTimeout(() => {
        handleOpenModalEvent();
      }, 2000);
    } catch (error) {
      console.log(error);
      createNotification('error', 'filled', 'Error al eliminar el evento');
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
        <Row>
          <Colxx xxs='6'>
            <Label>Fecha de registro: </Label>
            <Input value={creado} disabled />
          </Colxx>

          <Colxx xxs='6'>
            <Label>Tipo de evento: </Label>
            <ReactSelect
              className='react-select'
              classNamePrefix='react-select'
              value={type}
              options={typeEvent}
              onChange={(e) => setType(e)}
            />
          </Colxx>
        </Row>

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

        {role !== 'Read' && (
          <>
            <Label className='mt-3'>
              <p style={{ marginBottom: 0 }}>
                Asignar a colaborador: {'   '}
                <span
                  style={{ fontSize: 10.5, marginLeft: 5, color: '#d7d7d7' }}
                >
                  (opcional)
                </span>
              </p>
            </Label>
            <UncontrolledDropdown>
              <DropdownToggle
                caret
                color='outline-dark'
                size='xs p-2'
                style={{
                  borderRadius: 0,
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderColor: 'rgb(193 193 193)',
                  textTransform: 'capitalize'
                }}
              >
                {collaborator.name}
              </DropdownToggle>
              <DropdownMenu
                style={{
                  borderRadius: 0,
                  width: 325
                }}
              >
                {list.map((order, index) => {
                  return (
                    <DropdownItem
                      style={{
                        textTransform: 'capitalize'
                      }}
                      key={index.name}
                      onClick={() => {
                        setCollaborator(
                          list.find((x) => x.name === order.name)
                        );
                      }}
                    >
                      {order.name}
                    </DropdownItem>
                  );
                })}
              </DropdownMenu>
            </UncontrolledDropdown>
          </>
        )}
      </ModalBody>

      <ModalFooter style={id && { justifyContent: 'space-between' }}>
        {id && (
          <Button color='danger' onClick={deletedEvent} disabled={loading}>
            <IntlMessages id='Eliminar Evento' />
          </Button>
        )}
        <div style={{ display: 'flex', gap: 5 }}>
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
        </div>
      </ModalFooter>
    </Modal>
  );
};

export default ModalEvent;
