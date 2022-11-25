/* eslint-disable react/no-array-index-key */
import React, { useEffect, useState } from 'react';
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  NavLink,
  Badge
} from 'reactstrap';
import PerfectScrollbar from 'react-perfect-scrollbar';
import ModalCalendar from 'containers/pages/ModalCalendar';
import clienteAxios from '../../config/axios';

const NotificationItem = ({ lastUpdateDate, filingNumber, despacho, _id }) => {
  return (
    <div
      className='d-flex flex-row mb-3 pb-3 border-bottom'
      style={{ alignItems: 'center' }}
    >
      <div className=''>
        <NavLink href={`/app/detail/${_id}`}>
          <p
            style={{
              display: 'flex',
              fontSize: 10,
              marginBottom: 0,
              color: 'gray'
            }}
          >
            Radicado: {filingNumber}
          </p>

          <p
            style={{
              display: 'flex',
              fontSize: 12,
              marginBottom: 5,
              // color: 'gray',
              lineHeight: 1.5
            }}
          >
            {despacho}
          </p>

          <Badge
            color='primary'
            pill
            style={{ display: 'flex', justifyContent: 'center' }}
          >
            {lastUpdateDate.split('T')[0]}
          </Badge>
        </NavLink>
      </div>
    </div>
  );
};

const EventNotificationItem = ({ title, start, creado, handleOpenModal }) => {
  return (
    <div
      className='d-flex flex-row mb-3 pb-1 border-bottom'
      style={{ alignItems: 'center' }}
    >
      <div>
        <div style={{ display: 'flex' }}>
          <div style={{ display: 'flex', marginRight: 50, color: 'black' }}>
            <i
              className='iconsminds-clock mr-1'
              style={{ fontSize: 15, marginTop: -2 }}
            />
            <p style={{ fontSize: 13 }}>Recordatorio</p>
          </div>

          <div>
            <p
              style={{
                fontSize: 10,
                color: 'gray'
              }}
            >
              {creado.split('T')[0]}
            </p>
          </div>
        </div>

        <p
          style={{
            display: '-webkit-box',
            fontSize: 12,
            marginBottom: 5,
            lineHeight: 1.5,
            marginTop: -5,
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            marginLeft: 10
          }}
        >
          {title}
        </p>
        <p style={{ display: 'flex', justifyContent: 'center' }}>
          Inicia: {start.split('T')[0]} / {start.split('T')[1].split(':00.')[0]}{' '}
          {start.split('T')[1].split(':')[0] > 11 ? 'pm' : 'am'}
        </p>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button
            type='button'
            className='btn btn-link'
            style={{ marginTop: -20, fontSize: 11, marginBottom: -5 }}
            onClick={handleOpenModal}
          >
            Ver más
          </button>
        </div>
      </div>
    </div>
  );
};

const DaysNotificationItem = ({ lastUpdateDate, filingNumber, _id }) => {
  const resta = (Date.now() - new Date(lastUpdateDate)) / (1000 * 60 * 60 * 24);

  return (
    <div>
      {resta > 182 && (
        <div
          className='d-flex flex-row mb-3 pb-3 border-bottom'
          style={{ alignItems: 'center' }}
        >
          <div className=''>
            <NavLink href={`/app/detail/${_id}`}>
              <p
                style={{
                  display: 'flex',
                  fontSize: 10,
                  marginBottom: 0,
                  color: 'gray'
                }}
              >
                Radicado: {filingNumber}
              </p>

              <>
                <p
                  style={{
                    display: 'flex',
                    fontSize: 12,
                    marginBottom: 5,
                    // color: 'gray',
                    lineHeight: 1.5
                  }}
                >
                  {resta > 182 &&
                    resta < 365 &&
                    'Lleva más de 6 meses sin actuaciones'}
                  {resta > 365 && 'Lleva más de un año sin actuaciones'}
                </p>

                <Badge
                  color='danger'
                  pill
                  style={{ display: 'flex', justifyContent: 'center' }}
                >
                  Ultima actuación: {lastUpdateDate.split('T')[0]}
                </Badge>
              </>
            </NavLink>
          </div>
        </div>
      )}
    </div>
  );
};

const TopnavNotifications = () => {
  const [process, setProcess] = useState([]);
  const [events, setEvents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const getProcess = async () => {
      const processData = await clienteAxios.get('/process/all/bylawyer');
      console.log('Data', processData);
      setProcess(processData.data);
    };

    const getEvent = async () => {
      const processData = await clienteAxios.get('/event/all/bylawyer');
      console.log('Data', processData);
      setEvents(processData.data);
    };

    getEvent();
    getProcess();
  }, []);

  const notifications = process
    ? process.filter((e) => e.notificationWeb === true)
    : [];

  const eventNotifications = events
    ? events.filter((e) => e.notification === true)
    : [];

  const notificationDays = process
    ? process.filter((e) => e.notificationDaysWeb === true)
    : [];
  const handleOpenModal = () => {
    setModalOpen(!modalOpen);
  };

  return (
    <div className='position-relative d-inline-block'>
      <UncontrolledDropdown className='dropdown-menu-right'>
        <DropdownToggle
          className='header-icon notificationButton'
          color='empty'
        >
          <i className='simple-icon-bell' />
          <span className='count'>
            {notifications.length +
              eventNotifications.length +
              notificationDays.length}
          </span>
        </DropdownToggle>
        <DropdownMenu
          className='position-absolute mt-3 scroll'
          right
          id='notificationDropdown'
        >
          <PerfectScrollbar
            options={{ suppressScrollX: true, wheelPropagation: false }}
          >
            {notifications.map((notification, index) => {
              return <NotificationItem key={index} {...notification} />;
            })}

            {eventNotifications.map((notification, index) => {
              return (
                <EventNotificationItem
                  key={index}
                  {...notification}
                  handleOpenModal={handleOpenModal}
                />
              );
            })}

            {notificationDays.map((notification, index) => {
              return (
                <DaysNotificationItem
                  key={index}
                  {...notification}
                  // handleOpenModal={handleOpenModal}
                />
              );
            })}
          </PerfectScrollbar>
        </DropdownMenu>
      </UncontrolledDropdown>

      <ModalCalendar handleOpenModal={handleOpenModal} modalOpen={modalOpen} />
    </div>
  );
};

export default TopnavNotifications;
