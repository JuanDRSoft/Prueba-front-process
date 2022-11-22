import React, { useEffect, useState } from 'react';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Label,
  Spinner,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';
import IntlMessages from 'helpers/IntlMessages';
import { NotificationManager } from 'components/common/react-notifications';

import axios from 'axios';
import clienteAxios from 'config/axios';
import api from '../../constants/api';

const AddNewModal = ({
  modalOpen,
  toggleModal,
  idLawyer,
  reloadFnData,
  role,
  nameLawyer
}) => {
  const [fillingN, setFillingN] = useState();
  const [loading, setLoading] = useState(false);
  const [collaborator, setCollaborator] = useState({
    name: 'Seleccionar colaborador'
  });
  const [list, setList] = useState([]);
  const [id, setId] = useState();
  const [name, setName] = useState();

  console.log(nameLawyer);
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
    if (collaborator.name !== 'Seleccionar colaborador') {
      // eslint-disable-next-line no-underscore-dangle
      setId(collaborator._id);
      setName(nameLawyer);
    } else {
      setId(idLawyer);
    }
  }, [collaborator]);

  const cerrar = () => {
    toggleModal(!modalOpen);
  };

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

  const processQuery = async () => {
    if (!fillingN) {
      createNotification('error', 'filled', 'Campos obligatorios');
    } else {
      setLoading(true);

      try {
        const requestProceso = await axios.get(
          `https://consultaprocesos.ramajudicial.gov.co:448/api/v2/Procesos/Consulta/NumeroRadicacion?numero=${fillingN.trim()}&SoloActivos=false&pagina=1`
        );

        if (
          requestProceso.data.procesos.length === 0 ||
          requestProceso.data.procesos[requestProceso.data.procesos.length - 1]
            .esPrivado === true
        ) {
          createNotification(
            'error',
            'filled',
            'Radicado no existe o es privado!'
          );
          setLoading(false);
        } else {
          const {
            fechaUltimaActuacion,
            idProceso,
            despacho,
            departamento,
            sujetosProcesales
          } =
            requestProceso.data.procesos[
              requestProceso.data.procesos.length - 1
            ];

          await axios
            .post(`${api}/process`, {
              filingNumber: fillingN.trim(),
              lastUpdateDate: fechaUltimaActuacion,
              lawyer: id,
              idProceso,
              despacho,
              departamento,
              sujetosProcesales,
              assigned: name
            })
            .then((result) => {
              console.log(result);
              setLoading(false);
              setFillingN('');
              toggleModal();
              reloadFnData();
              createNotification(
                'success',
                'filled',
                'Proceso Agregado con Exito!'
              );
              /* window.location.href = '/'; */
            })
            .catch((err) => {
              setLoading(false);
              console.log('@err', err.response.data.msg);
              createNotification('error', 'filled', err.response.data.msg);
            });
        }
      } catch (error) {
        console.log(error.response.data.Message);

        if (error.response.data.StatusCode === 404) {
          setLoading(false);
          createNotification('error', 'filled', error.response.data.Message);
        }
      }
    }
  };

  return (
    <Modal
      isOpen={modalOpen}
      toggle={cerrar}
      wrapClassName='modal-right'
      backdrop='static'
    >
      <ModalHeader toggle={cerrar}>
        <IntlMessages id='pages.add-new-modal-title' />
      </ModalHeader>
      <ModalBody>
        <Label>
          <IntlMessages id='pages.product-name' />
        </Label>
        <Input value={fillingN} onChange={(e) => setFillingN(e.target.value)} />

        {role === 'Admin' && (
          <>
            <Label className='mt-3'>
              <p style={{ marginBottom: 0 }}>
                Asignar a colaborador{'   '}
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
                  width: 325,
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
      <ModalFooter>
        <Button color='secondary' outline onClick={cerrar}>
          <IntlMessages id='pages.cancel' />
        </Button>
        {loading && <Spinner color='primary' className='mb-1' />}
        <Button color='primary' onClick={processQuery} disabled={loading}>
          <IntlMessages id='pages.submit' />
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default AddNewModal;
