import React, { useState, useEffect } from 'react';
import { Colxx } from 'components/common/CustomBootstrap';
import clienteAxios from 'config/axios';
import { Formik } from 'formik';
import {
  Button,
  Card,
  CardBody,
  Form,
  FormGroup,
  Label,
  Row
} from 'reactstrap';
import Switch from 'rc-switch';

const FormRules = ({
  edit,
  setCollaborator,
  collaborator,
  setForm,
  setEdit
}) => {
  const [checkedProcesos, setCheckedProcesos] = useState(false);
  const [checkedEvents, setCheckedEvents] = useState(false);
  const [checkedMembership, setCheckedMembership] = useState(false);

  useEffect(() => {
    if (edit) {
      setCheckedEvents(edit.events);
      setCheckedMembership(edit.membership);
      setCheckedProcesos(edit.process);
    }
  }, [edit]);

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      // eslint-disable-next-line no-underscore-dangle
      const data = await clienteAxios.put(`/collaborator/${edit._id}`, {
        process: checkedProcesos,
        events: checkedEvents,
        membership: checkedMembership
      });

      const dataUpdate = collaborator.map((ev) =>
        // eslint-disable-next-line no-underscore-dangle
        ev._id === edit._id ? data.data : ev
      );
      setCollaborator(dataUpdate);
      setEdit('');
      setForm(false);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <Row className='mb-4'>
        <Colxx xxs='12'>
          <Card>
            <CardBody>
              <Formik>
                <Form
                  className='av-tooltip tooltip-label-right'
                  onSubmit={onSubmit}
                >
                  <h1>Reglas para {edit.name}</h1>

                  <FormGroup style={{ display: 'flex', gap: 10 }}>
                    <Label>- Permitir agregar procesos</Label>
                    <Switch
                      className='custom-switch custom-switch-primary custom-switch-small'
                      checked={checkedProcesos}
                      onChange={(secondary) => setCheckedProcesos(secondary)}
                    />
                  </FormGroup>

                  <FormGroup style={{ display: 'flex', gap: 10 }}>
                    <Label>- Permitir la creación de eventos en agenda</Label>
                    <Switch
                      className='custom-switch custom-switch-primary custom-switch-small pr-4'
                      checked={checkedEvents}
                      onChange={(secondary) => setCheckedEvents(secondary)}
                    />
                  </FormGroup>

                  <FormGroup style={{ display: 'flex', gap: 10 }}>
                    <Label>
                      - Permitir la visualización de datos de membresia
                    </Label>
                    <Switch
                      className='custom-switch custom-switch-primary custom-switch-small pr-4'
                      checked={checkedMembership}
                      onChange={(secondary) => setCheckedMembership(secondary)}
                    />
                  </FormGroup>

                  <Button color='primary' block type='submit'>
                    Guardar Reglas
                  </Button>
                </Form>
              </Formik>
            </CardBody>
          </Card>
        </Colxx>
      </Row>
    </div>
  );
};

export default FormRules;
