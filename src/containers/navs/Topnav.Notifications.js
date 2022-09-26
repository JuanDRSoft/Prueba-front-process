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

          {/* <p
            className='mb-1'
            style={{ display: 'flex', fontSize: 12, marginBottom: -5 }}
          >
            {sujetosProcesales}
          </p> */}

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

const TopnavNotifications = () => {
  const [process, setProcess] = useState([]);

  useEffect(() => {
    const getProcess = async () => {
      const processData = await clienteAxios.get('/process/all/bylawyer');
      console.log('Data', processData);
      setProcess(processData.data);
    };

    getProcess();
  }, []);

  const notifications = process
    ? process.filter((e) => e.notificationWeb === true)
    : [];

  return (
    <div className='position-relative d-inline-block'>
      <UncontrolledDropdown className='dropdown-menu-right'>
        <DropdownToggle
          className='header-icon notificationButton'
          color='empty'
        >
          <i className='simple-icon-bell' />
          <span className='count'>{notifications.length}</span>
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
          </PerfectScrollbar>
        </DropdownMenu>
      </UncontrolledDropdown>
    </div>
  );
};

export default TopnavNotifications;
