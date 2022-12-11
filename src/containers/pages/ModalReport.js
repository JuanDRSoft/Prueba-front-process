import React, { useState } from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Row,
  Badge
} from 'reactstrap';
import IntlMessages from 'helpers/IntlMessages';
import Switch from 'rc-switch';
import { Colxx } from 'components/common/CustomBootstrap';
import UseSheetProcess from '../../hooks/useSheetProcess';

const ModalReport = ({
  modalOpenReport,
  handleOpenModalReport,
  data,
  days,
  procesos,
  anexos,
  events
}) => {
  const [checkedSujetos, setCheckedSujetos] = useState(false);
  const [checkedJuzgado, setCheckedJuzgado] = useState(false);
  const [checkedCity, setCheckedCity] = useState(false);
  const [checkedAct, setCheckedAct] = useState(false);
  const [checkedDays, setCheckedDays] = useState(false);
  const [checkedAnexo, setCheckedAnexo] = useState(false);
  const [checkedEvents, setCheckedEvents] = useState(false);

  const countAnexos = anexos.length > 0;
  const countEvents = events.length > 0;

  const rules = {
    suj: checkedSujetos,
    juz: checkedJuzgado,
    city: checkedCity,
    act: checkedAct,
    day: checkedDays,
    anexo: checkedAnexo,
    event: checkedEvents
  };

  return (
    <Modal
      isOpen={modalOpenReport}
      toggle={handleOpenModalReport}
      wrapClassName='modal-center'
      size='lg'
      backdrop='static'
    >
      <ModalHeader
        toggle={handleOpenModalReport}
        style={{
          display: 'flex'
        }}
      >
        <IntlMessages id='Parametros Para Generar Reporte' />
      </ModalHeader>

      <ModalBody>
        <p className='mb-5'>
          Activa los siguientes enunciados de los datos que deseas que aparezcan
          en la generación del Reporte:
        </p>

        <Form>
          <Row>
            <Colxx xxs='6'>
              <FormGroup style={{ display: 'flex', gap: 10 }}>
                <Label>Agregar sujetos procesales</Label>
                <Switch
                  className='custom-switch custom-switch-primary custom-switch-small'
                  checked={checkedSujetos}
                  onChange={(secondary) => setCheckedSujetos(secondary)}
                />
              </FormGroup>

              <FormGroup style={{ display: 'flex', gap: 10 }}>
                <Label>Agregar datos de juzgado</Label>
                <Switch
                  className='custom-switch custom-switch-primary custom-switch-small'
                  checked={checkedJuzgado}
                  onChange={(secondary) => setCheckedJuzgado(secondary)}
                />
              </FormGroup>

              <FormGroup style={{ display: 'flex', gap: 10 }}>
                <Label>Agregar información de ciudad</Label>
                <Switch
                  className='custom-switch custom-switch-primary custom-switch-small'
                  checked={checkedCity}
                  onChange={(secondary) => setCheckedCity(secondary)}
                />
              </FormGroup>

              <FormGroup style={{ display: 'flex', gap: 10 }}>
                <Label>Agregar todas las actuaciones</Label>
                <Switch
                  className='custom-switch custom-switch-primary custom-switch-small'
                  checked={checkedAct}
                  onChange={(secondary) => setCheckedAct(secondary)}
                />
              </FormGroup>
            </Colxx>

            <Colxx xxs='6'>
              <FormGroup style={{ display: 'flex', gap: 10 }}>
                <Label>Agregar información de días sin actuaciones</Label>
                <Switch
                  className='custom-switch custom-switch-primary custom-switch-small'
                  checked={checkedDays}
                  onChange={(secondary) => setCheckedDays(secondary)}
                />
              </FormGroup>

              <FormGroup style={{ display: 'flex', gap: 10 }}>
                <Label>Agregar anexos registrados</Label>

                {!countAnexos ? (
                  <div>
                    <Badge color='danger' pill>
                      NO HAY ANEXOS
                    </Badge>{' '}
                  </div>
                ) : (
                  <Switch
                    className='custom-switch custom-switch-primary custom-switch-small'
                    checked={checkedAnexo}
                    onChange={(secondary) => setCheckedAnexo(secondary)}
                    disabled={!countAnexos}
                  />
                )}
              </FormGroup>

              <FormGroup style={{ display: 'flex', gap: 10 }}>
                <Label>Agregar eventos programados</Label>

                {!countEvents ? (
                  <div>
                    <Badge color='danger' pill>
                      NO HAY EVENTOS
                    </Badge>{' '}
                  </div>
                ) : (
                  <Switch
                    className='custom-switch custom-switch-primary custom-switch-small'
                    checked={checkedEvents}
                    onChange={(secondary) => setCheckedEvents(secondary)}
                    disabled={!countEvents}
                  />
                )}
              </FormGroup>
            </Colxx>
          </Row>
        </Form>
      </ModalBody>

      <ModalFooter style={{ justifyContent: 'center' }}>
        <UseSheetProcess
          renderData={procesos}
          days={days}
          dataProcess={data}
          rules={rules}
          renderAnexos={anexos}
          renderEvents={events}
        />
      </ModalFooter>
    </Modal>
  );
};

export default ModalReport;
