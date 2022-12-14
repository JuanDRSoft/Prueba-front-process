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
  Label,
  CardSubtitle
} from 'reactstrap';
import { Colxx, Separator } from 'components/common/CustomBootstrap';
import Breadcrumb from 'containers/navs/Breadcrumb';
import IntlMessages from 'helpers/IntlMessages';

import { BarChart, PieChart } from 'components/charts';
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
  const [despachos, setDespachos] = useState([]);
  const [ciudades, setCiudades] = useState([]);

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

  const randomColor = () => {
    const simbolos = '0123456789ABCDEF';

    let color = '#';

    for (let e = 0; e < 6; e += 1) {
      color += simbolos[Math.floor(Math.random() * 16)];
      console.log(color);
    }
    return color;
  };

  useEffect(() => {
    const filtrosUnicos = [];

    /* eslint no-plusplus: "error" */
    for (let i = 0; i < process.length; i += 1) {
      const elemento = process[i].despacho;

      if (!filtrosUnicos.includes(process[i].despacho)) {
        filtrosUnicos.push(elemento);
      }
    }

    const despacho = [];
    const length = [];
    /* eslint no-plusplus: "error" */
    for (let i = 0; i < filtrosUnicos.length; i += 1) {
      const filtro = process.filter((e) => e.despacho === filtrosUnicos[i]);

      length.push(filtro.length);

      despacho.push({
        data: [filtro.length],
        label: filtrosUnicos[i],
        borderWidth: 1,
        borderColor: 'black',
        backgroundColor: randomColor()
      });
    }

    setDespachos(despacho);
  }, [process]);

  useEffect(() => {
    const filtrosUnicos = [];

    /* eslint no-plusplus: "error" */
    for (let i = 0; i < process.length; i += 1) {
      const elemento = process[i].departamento;

      if (!filtrosUnicos.includes(process[i].departamento)) {
        filtrosUnicos.push(elemento);
      }
    }

    const border = [];
    const length = [];
    const background = [];
    /* eslint no-plusplus: "error" */
    for (let i = 0; i < filtrosUnicos.length; i += 1) {
      const filtro = process.filter((e) => e.departamento === filtrosUnicos[i]);

      length.push(filtro.length);
      border.push('black');
      background.push(randomColor());
    }

    setCiudades({
      data: length,
      backgroundColor: background,
      borderColor: border,
      labelCity: filtrosUnicos
    });
  }, [process]);

  const barChartData = {
    labels: ['DESPACHOS'],
    datasets: despachos
  };

  const barChartCity = {
    labels: ciudades.labelCity,
    datasets: [
      {
        label: '',
        borderColor: ciudades.borderColor,
        backgroundColor: ciudades.backgroundColor,
        borderWidth: 2,
        data: ciudades.data
      }
    ]
  };

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

      <Row>
        <Colxx xxs='8'>
          <Card className='p-5' style={{ height: 490 }}>
            <CardSubtitle style={{ fontSize: 26, marginBottom: 50 }}>
              <IntlMessages id='Resumen Gráfico De Procesos Por Despacho' />
            </CardSubtitle>
            <div className='chart-container'>
              <BarChart shadow data={barChartData} />
            </div>
          </Card>
        </Colxx>

        <Colxx xxs='4'>
          <Card className='p-5'>
            <CardSubtitle style={{ fontSize: 26 }}>
              <IntlMessages id='Resumen Gráfico De Procesos Por Ciudad' />
            </CardSubtitle>
            <div className='chart-container'>
              <PieChart shadow data={barChartCity} />
            </div>
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
