import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardBody, CardTitle, Spinner, Row, Button } from 'reactstrap';

import { Colxx, Separator } from 'components/common/CustomBootstrap';
import Breadcrumb from 'containers/navs/Breadcrumb';
import { connect } from 'react-redux';
import AddNewTodoModal from 'containers/applications/AddNewTodoModal';
import clienteAxios from '../../../config/axios';
import Proceso from './components/Proceso/Proceso';
import style from './detailcss.module.css';
import PreviewAnexos from './components/anexos/PreviewAnexos';

const DetailProcess = ({ match, authUser }) => {
  const [data, setData] = useState({});
  const [procesos, setProcesos] = useState([]);
  const [cantidad, setCantidad] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [anexos, setAnexos] = useState([]);

  const params = useParams();

  const { currentUser } = authUser;
  const { id } = currentUser;

  useEffect(() => {
    const fetchProcess = async () => {
      clienteAxios.get(`/process/${params.id}`).then((result) => {
        setData(result.data);

        clienteAxios
          .get(`/process/id/${result.data.idProceso}`)
          .then((resultProcess) => {
            console.log('@resultProcess', resultProcess);
            setCantidad(resultProcess.data.paginacion.cantidadRegistros);
            setProcesos(resultProcess.data.actuaciones);
            setLoading(false);
          });

        clienteAxios.get(`/process/anexos/${params.id}/${id}`).then((anexo) => {
          setAnexos(anexo.data.link);
        });
      });
    };
    fetchProcess();
  }, []);

  useEffect(() => {
    const updateStateNotification = async () => {
      clienteAxios.put(`/process/${params.id}`, {
        notificationWeb: false
      });
    };
    updateStateNotification();
  }, []);

  if (!data?.lawyer) {
    return <></>;
  }

  const openModal = () => {
    setModalOpen(!modalOpen);
  };

  const renderProcesos = () => {
    return procesos.map((proceso) => (
      <Proceso proceso={proceso} key={proceso.idRegActuacion} />
    ));
  };

  const {
    filingNumber,
    lastUpdateDate,
    despacho,
    departamento,
    sujetosProcesales
  } = data;

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
                  <CardTitle style={{ fontWeight: 'bold' }}>
                    DETALLES DEL PROCESO
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

                  {anexos.length > 0 ? (
                    anexos.map((anexo) => (
                      <PreviewAnexos
                        key={anexo.id}
                        anexo={anexo}
                        loading={loading}
                        filingNumber={filingNumber}
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
            </Card>
          </Colxx>

          <Colxx>
            <Card style={{ marginTop: 10 }}>
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

        <AddNewTodoModal modalOpen={modalOpen} toggleModal={openModal} />
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
