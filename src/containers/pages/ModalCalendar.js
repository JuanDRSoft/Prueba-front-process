import React, { useState, useEffect } from 'react';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Row,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownItem,
  DropdownMenu,
  Input
} from 'reactstrap';
import PreviewEventos from 'views/app/detail/components/eventos/PreviewEventos';
import { Colxx } from 'components/common/CustomBootstrap';
import IntlMessages from 'helpers/IntlMessages';
import CalendarCard from 'containers/dashboards/Calendar';
import moment from 'moment';
import { getYear } from 'date-fns';
import clienteAxios from 'config/axios';
import ModalEvent from './ModalEvent';

const filterOptions = [
  { column: '', label: 'Activos' },
  { column: 'hoy', label: 'Hoy' },
  { column: 'mañana', label: 'Mañana' },
  { column: 'mes', label: 'Este mes' },
  { column: 'año', label: 'Este Año' },
  { column: 'otra', label: 'Fecha especifica' }
];

const filterType = [
  { column: '', label: 'Cualquiera' },
  { column: 'Procesales', label: 'Procesales' },
  { column: 'Extraprocesales', label: 'Extraprocesales' },
  { column: 'Tareas', label: 'Tareas' },
  { column: 'Compromisos', label: 'Compromisos' },
  { column: 'Audiencias', label: 'Audiencias' }
];

const ModalCalendar = ({ modalOpen, handleOpenModal }) => {
  const [modalOpenEvent, setModalOpenEvent] = useState(false);
  const [events, setEvents] = useState([]);
  const [now] = useState(new Date());
  const [selectedFilterOption, setSelectedFilterOption] = useState({
    column: '',
    label: 'Activos'
  });
  const [selectedFilterType, setSelectedFilterType] = useState({
    column: '',
    label: 'Cualquiera'
  });
  const [selectDate, setSelectDate] = useState('');
  const [items, setItems] = useState([]);

  useEffect(() => {
    const getAllData = async () => {
      const countDataAll = await clienteAxios.get('/event/all/bylawyer');
      setEvents(countDataAll.data);
    };

    getAllData();
  }, []);

  useEffect(() => {
    if (selectedFilterOption.column === '') {
      const activos = events.filter(
        (e) => new Date(e.end) > now || selectedFilterType.column === e.type
      );
      setItems(activos);
    }

    if (selectedFilterOption.column === 'hoy') {
      const activos = events.filter(
        (e) =>
          (new Date(e.start).getDate() === now.getDate() &&
            new Date(e.start).getMonth() === now.getMonth() &&
            getYear(new Date(e.start)) === getYear(now)) ||
          selectedFilterType.column === e.type
      );
      setItems(activos);
    }

    if (selectedFilterOption.column === 'mañana') {
      const activos = events.filter(
        (e) =>
          new Date(e.end).getDate() - now.getDate() === 1 ||
          selectedFilterType.column === e.type
      );
      setItems(activos);
    }

    if (selectedFilterOption.column === 'mes') {
      const activos = events.filter(
        (e) =>
          new Date(e.end).getMonth() === now.getMonth() ||
          selectedFilterType.column === e.type
      );
      setItems(activos);
    }

    if (selectedFilterOption.column === 'año') {
      const activos = events.filter(
        (e) =>
          new Date(e.end).getFullYear() === now.getFullYear() ||
          selectedFilterType.column === e.type
      );
      setItems(activos);
    }

    if (selectedFilterOption.column === 'otra') {
      const activos = events.filter(
        (e) =>
          (new Date(e.start).getDate() === new Date(selectDate).getDate() + 1 &&
            new Date(e.start).getMonth() === new Date(selectDate).getMonth() &&
            getYear(new Date(e.start)) === getYear(new Date(selectDate))) ||
          selectedFilterType.column === e.type
      );
      setItems(activos);
    }
  }, [selectedFilterOption, selectedFilterType, events, selectDate]);

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

  const ActiveEvents = () => {
    return items.length > 0 ? (
      items
        .sort(function (a, b) {
          if (a.start > b.start) {
            return -1;
          }
          if (a.start < b.start) {
            return 1;
          }
          return 1;
        })
        .map((event) => (
          <PreviewEventos
            event={event}
            key={event}
            setEvents={setEvents}
            events={events}
          />
        ))
    ) : (
      <p style={{ textAlign: 'center', marginTop: 10 }}>
        NO HAY EVENTOS ACTIVOS
      </p>
    );
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
          <Colxx xxs='4'>
            <h1>Proximos eventos</h1>
          </Colxx>

          <Colxx className='d-block d-md-inline-block pt-1'>
            <UncontrolledDropdown className='mr-1 float-md-right btn-group'>
              <DropdownToggle caret color='outline-dark' size='xs'>
                <IntlMessages id='Filtrar por fecha: ' />
                {selectedFilterOption.label}
              </DropdownToggle>
              <DropdownMenu>
                {filterOptions.map((order, index) => {
                  return (
                    <DropdownItem
                      key={index.label}
                      onClick={() => {
                        setSelectedFilterOption(
                          filterOptions.find((x) => x.column === order.column)
                        );
                        setSelectedFilterType({
                          column: '',
                          label: 'Cualquiera'
                        });
                      }}
                    >
                      {order.label}
                    </DropdownItem>
                  );
                })}
              </DropdownMenu>
            </UncontrolledDropdown>

            <div>
              <UncontrolledDropdown className='mr-2 float-md-right btn-group'>
                <DropdownToggle caret color='outline-dark' size='xs'>
                  <IntlMessages id='Filtrar por tipo: ' />
                  {selectedFilterType.label}
                </DropdownToggle>
                <DropdownMenu>
                  {filterType.map((order, index) => {
                    return (
                      <DropdownItem
                        key={index.label}
                        onClick={() => {
                          setSelectedFilterType(
                            filterType.find((x) => x.column === order.column)
                          );
                        }}
                      >
                        {order.label}
                      </DropdownItem>
                    );
                  })}
                </DropdownMenu>
              </UncontrolledDropdown>

              {selectedFilterOption.column === 'otra' && (
                <Input
                  type='date'
                  value={selectDate}
                  onChange={(e) => setSelectDate(e.target.value)}
                  style={{
                    width: 220,
                    height: 30,
                    borderRadius: 50,
                    float: 'right',
                    marginTop: 10
                  }}
                />
              )}
            </div>
          </Colxx>
        </Row>

        {ActiveEvents()}
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
        setItems={setItems}
        setEvents={setEvents}
        events={events}
      />
    </Modal>
  );
};

export default ModalCalendar;
