import React, { useEffect, useState } from 'react';
import {
  Row,
  Card,
  CardBody,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Input,
  Label
} from 'reactstrap';
import { Colxx, Separator } from 'components/common/CustomBootstrap';
import Breadcrumb from 'containers/navs/Breadcrumb';
import IntlMessages from 'helpers/IntlMessages';

import UseSheet from '../../../hooks/useSheet';
import UseSheetEvent from '../../../hooks/useSheetEvent';
import clienteAxios from '../../../config/axios';

const filterOptions = [
  { label: 'Todos', column: 'todos' },
  { label: 'Fecha', column: 'fecha' },
  { label: 'Colaborador', column: 'colaborador' }
];

const Reports = ({ match }) => {
  const [process, setProcess] = useState([]);
  const [selectedFilterOption, setSelectedFilterOption] = useState({
    label: 'Todos',
    column: 'todos'
  });
  const [selectDateOne, setSelectDateOne] = useState('');
  const [selectDateTwo, setSelectDateTwo] = useState('');

  const [collaborators, setCollaborators] = useState([]);
  const [selectCollaborator, setSelectCollaborator] = useState('');
  const [filterProcess, setFilterProcess] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const getAllData = async () => {
      const countDataAll = await clienteAxios.get('/process/all/bylawyer');
      setProcess(countDataAll.data);

      if (selectedFilterOption.column === 'todos') {
        setFilterProcess(countDataAll.data);
      }
    };
    const getCollaborator = async () => {
      const data = await clienteAxios.get('/collaborator/all/bylawyer');
      setCollaborators(data.data);
    };
    const getEvents = async () => {
      const eventsData = await clienteAxios.get('/event/all/bylawyer');
      setEvents(eventsData.data);
    };

    getEvents();
    getCollaborator();
    getAllData();
  }, []);

  useEffect(() => {
    if (selectedFilterOption.column === 'todos') {
      setFilterProcess(process);
    }

    const filtro = process.filter(
      (proceso) =>
        new Date(proceso.lastUpdateDate) > new Date(selectDateOne) &&
        new Date(proceso.lastUpdateDate) < new Date(selectDateTwo)
    );
    setFilterProcess(filtro);
  }, [selectDateOne, selectDateTwo, selectedFilterOption]);

  useEffect(() => {
    if (selectCollaborator.column !== '') {
      const getProcessCollaborator = async () => {
        const data = await clienteAxios.get(
          // eslint-disable-next-line no-underscore-dangle
          `/process/all/byCollaborator/${selectCollaborator._id}`
        );
        setFilterProcess(data.data);
      };

      getProcessCollaborator();
    }
  }, [selectCollaborator]);

  return (
    <>
      <Row>
        <Colxx xxs='12'>
          <Breadcrumb heading='page.report' match={match} />
          <Separator className='mb-5' />
        </Colxx>
      </Row>

      <Row>
        <Colxx xxs='6'>
          <Row>
            <Colxx xxs='12' className='mb-4'>
              <Card>
                <CardBody>
                  <p className='lead'>
                    Resumen de Procesos
                    <UncontrolledDropdown className='mr-1 float-md-right btn-group'>
                      <DropdownToggle caret color='outline-dark' size='xs'>
                        <IntlMessages id='Filtrar por: ' />
                        {selectedFilterOption.label}
                      </DropdownToggle>
                      <DropdownMenu>
                        {filterOptions.map((order, index) => {
                          return (
                            <DropdownItem
                              key={index.label}
                              onClick={() => {
                                setSelectedFilterOption(
                                  filterOptions.find(
                                    (x) => x.column === order.column
                                  )
                                );
                                setSelectCollaborator({
                                  column: '',
                                  name: 'Selecciona'
                                });
                                setSelectDateOne('');
                                setSelectDateTwo('');
                              }}
                            >
                              {order.label}
                            </DropdownItem>
                          );
                        })}
                      </DropdownMenu>
                    </UncontrolledDropdown>
                  </p>

                  <hr className='my-4' />
                  <p>
                    Se descargara un archivo en excel que contiene el resumen de
                    todos los procesos registrados con su respectivo estado.
                  </p>
                  <p
                    className='lead mb-0'
                    style={{ display: 'flex', marginTop: 30 }}
                  >
                    <Colxx xxs='6'>
                      <UseSheet renderData={filterProcess} />
                    </Colxx>{' '}
                    {selectedFilterOption.column === 'fecha' && (
                      <Row style={{ marginTop: -35 }}>
                        <Colxx xxs='6'>
                          <Label style={{ fontSize: 15 }}>Desde:</Label>
                          <Input
                            type='date'
                            value={selectDateOne}
                            onChange={(e) => setSelectDateOne(e.target.value)}
                            style={{
                              height: 30,
                              borderRadius: 50,
                              float: 'right'
                            }}
                          />
                        </Colxx>

                        <Colxx xxs='6'>
                          {' '}
                          <Label style={{ fontSize: 15 }}>Hasta:</Label>
                          <Input
                            type='date'
                            value={selectDateTwo}
                            onChange={(e) => setSelectDateTwo(e.target.value)}
                            style={{
                              height: 30,
                              borderRadius: 50,
                              float: 'right'
                            }}
                          />
                        </Colxx>
                      </Row>
                    )}
                    {selectedFilterOption.column === 'colaborador' && (
                      <Colxx xxs='6'>
                        <UncontrolledDropdown
                          className='ml-6'
                          style={{
                            height: 30,
                            borderRadius: 50,
                            float: 'right'
                          }}
                        >
                          <DropdownToggle
                            caret
                            color='outline-dark'
                            size='xs'
                            style={{ textTransform: 'capitalize' }}
                          >
                            <IntlMessages id='Colaborador: ' />
                            {selectCollaborator.name}
                          </DropdownToggle>
                          <DropdownMenu>
                            {collaborators.map((order, index) => {
                              return (
                                <DropdownItem
                                  style={{ textTransform: 'capitalize' }}
                                  key={index.label}
                                  onClick={() => {
                                    setSelectCollaborator(
                                      collaborators.find(
                                        (x) => x.name === order.name
                                      )
                                    );
                                  }}
                                >
                                  {order.name}
                                </DropdownItem>
                              );
                            })}
                          </DropdownMenu>
                        </UncontrolledDropdown>
                      </Colxx>
                    )}
                  </p>
                </CardBody>
              </Card>
            </Colxx>
          </Row>
        </Colxx>

        <Colxx xxs='6' className='mb-4'>
          <Card>
            <CardBody>
              <p className='lead'>Resumen de Eventos</p>
              <hr className='my-4' />
              <p>
                Se descargara un archivo en excel que contiene el resumen de
                todos los eventos registrados con su respectivo estado.
              </p>
              <p className='lead mb-0' style={{ marginTop: 30 }}>
                <UseSheetEvent renderData={events} />
              </p>
            </CardBody>
          </Card>
        </Colxx>
      </Row>
    </>
  );
};

export default Reports;
/*   <Row>
      <h1>Reportes</h1>
      <UseSheet renderData={process} />
    </Row> */
