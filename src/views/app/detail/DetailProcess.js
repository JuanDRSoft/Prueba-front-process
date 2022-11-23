import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardBody, CardTitle, Spinner, Row, Button } from 'reactstrap';
import { getTime } from 'date-fns';

import { Colxx, Separator } from 'components/common/CustomBootstrap';
import Breadcrumb from 'containers/navs/Breadcrumb';
import { connect } from 'react-redux';
import AddNewTodoModal from 'containers/applications/AddNewTodoModal';
import Proceso from './components/Proceso/Proceso';
import style from './detailcss.module.css';
import PreviewAnexos from './components/anexos/PreviewAnexos';
import PreviewEventos from './components/eventos/PreviewEventos';

import clienteAxios from '../../../config/axios';

const DetailProcess = ({ match, authUser }) => {
  const [data, setData] = useState({});
  const [procesos, setProcesos] = useState([]);
  const [cantidad, setCantidad] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [anexos, setAnexos] = useState([]);
  const [events, setEvents] = useState([]);
  const [processEvent, setProcessEvent] = useState([]);
  const [days, setDays] = useState('');

  const params = useParams();

  const { currentUser } = authUser;
  const { id } = currentUser;
  const {
    filingNumber,
    lastUpdateDate,
    despacho,
    departamento,
    sujetosProcesales,
    _id
  } = data;

  useEffect(() => {
    const fetchProcess = async () => {
      clienteAxios.get(`/process/${params.id}`).then((result) => {
        setData(result.data);
        setAnexos(result.data.link);

        clienteAxios
          .get(`/process/id/${result.data.idProceso}`)
          .then((resultProcess) => {
            console.log('@resultProcess', resultProcess);
            setCantidad(resultProcess.data.paginacion.cantidadRegistros);
            setProcesos(resultProcess.data.actuaciones);
            setLoading(false);
            setDays(
              (getTime(new Date()) -
                getTime(
                  new Date(resultProcess.data.actuaciones[0].fechaActuacion)
                )) /
                (1000 * 60 * 60 * 24)
            );
          });
      });
    };

    const getAllData = async () => {
      const countDataAll = await clienteAxios.get('/event/all/bylawyer');
      setEvents(countDataAll.data);
    };

    const getAllProcess = async () => {
      const countDataAll = await clienteAxios.get('/process/all/bylawyer');
      setProcessEvent(countDataAll.data);
    };

    getAllProcess();
    getAllData();
    fetchProcess();
  }, []);

  useEffect(() => {
    const updateStateNotification = async () => {
      await clienteAxios.put(`/process/${_id}`, {
        notificationWeb: false
      });
    };

    updateStateNotification();
  }, [_id]);

  if (!data?.lawyer) {
    return <></>;
  }

  const openModal = () => {
    setModalOpen(!modalOpen);
  };

  const eventos = events.filter((e) => e.process === filingNumber);

  const renderProcesos = () => {
    return procesos.map((proceso) => (
      <Proceso proceso={proceso} key={proceso.idRegActuacion} />
    ));
  };

  return (
    <>
      <Row>
        <Colxx xxs='12'>
          <Breadcrumb heading='page.detalle' match={match} />
          <Separator className='mb-5' />
        </Colxx>
      </Row>

      <div className={style.body}>
        <Row className='mb-5'>
          <Colxx>
            <Card
              style={{
                position: 'sticky',
                top: '128px',
                backgroundColor: '#f8f9fa'
              }}
            >
              <Card>
                <CardBody>
                  <CardTitle
                    style={{
                      fontWeight: 'bold',
                      display: 'flex',
                      justifyContent: 'space-between'
                    }}
                  >
                    DETALLES DEL PROCESO
                    <div>
                      <p style={{ fontSize: 12 }}>
                        {Number(days).toFixed()} Días sin actuaciones
                      </p>
                    </div>
                  </CardTitle>
                  <div className={style.detailData}>
                    <h4 className={style.textMargin}>Numero de Radicado:</h4>
                    <div className={style.textMargin}>{filingNumber}</div>
                  </div>
                  <div className={style.detailData}>
                    <h4 className={style.textMargin}>Ultima Actualizacion:</h4>
                    <div className={style.textMargin}>{lastUpdateDate}</div>
                  </div>
                  <div className={style.detailData}>
                    <h4 className={style.textMargin}>Despacho:</h4>
                    <div className={style.textMargin}>{despacho}</div>
                  </div>
                  <div className={style.detailData}>
                    <h4 className={style.textMargin}>Departamento: </h4>
                    <div className={style.textMargin}>{departamento}</div>
                  </div>
                  <h4>Sujetos Procesales: </h4>
                  <div>{sujetosProcesales}</div>
                </CardBody>
              </Card>

              <Card style={{ top: '10px' }}>
                <CardBody>
                  <CardTitle style={{ fontWeight: 'bold' }}>ANEXOS</CardTitle>

                  {anexos.length ? (
                    anexos.map((anexo) => (
                      <PreviewAnexos
                        key={anexo.id}
                        anexo={anexo}
                        filingNumber={filingNumber}
                        id={id}
                      />
                    ))
                  ) : (
                    <p style={{ textAlign: 'center' }}>
                      NO HAY ANEXOS REGISTRADOS AUN
                    </p>
                  )}
                  <Button color='primary' block onClick={openModal}>
                    Agregar Anexo
                  </Button>
                </CardBody>
              </Card>

              {eventos.map((e) => (
                <Card
                  key={e}
                  className='mt-4'
                  style={{ backgroundColor: 'white' }}
                >
                  <CardBody>
                    <CardTitle style={{ fontWeight: 'bold' }}>
                      EVENTOS
                    </CardTitle>
                    <PreviewEventos
                      event={e}
                      events={events}
                      setEvents={setEvents}
                      process={processEvent}
                    />
                  </CardBody>
                </Card>
              ))}
            </Card>
          </Colxx>

          <Colxx>
            <Card>
              <CardBody>
                <CardTitle style={{ fontWeight: 'bold' }}>
                  ACTUACIONES DEL PROCESO - Cantidad {cantidad}
                </CardTitle>
                {loading ? (
                  <div style={{ textAlign: 'center' }}>
                    <Spinner color='primary' className='mb-1' size='lg' />
                  </div>
                ) : (
                  <div style={{ marginTop: '3em' }}>{renderProcesos()}</div>
                )}
              </CardBody>
            </Card>
          </Colxx>
        </Row>

        <AddNewTodoModal
          modalOpen={modalOpen}
          toggleModal={openModal}
          filingNumber={filingNumber}
          anexos={anexos}
        />
      </div>
    </>
  );
};

const mapStateToProps = ({ authUser }) => {
  return {
    authUser
  };
};
const mapActionsToProps = {};

export default connect(mapStateToProps, mapActionsToProps)(DetailProcess);
