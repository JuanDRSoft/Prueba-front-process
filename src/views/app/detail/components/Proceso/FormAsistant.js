import { Colxx } from 'components/common/CustomBootstrap';
import clienteAxios from 'config/axios';
import { Field, Formik } from 'formik';
import React, { useState } from 'react';
import {
  Button,
  Card,
  CardBody,
  Form,
  FormGroup,
  Label,
  Row
} from 'reactstrap';

const FormAsistant = ({ lawyer, setCollaborator, collaborator }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [uid, setUid] = useState('');

  const { _id } = lawyer;

  const onSubmit = async (e) => {
    e.preventDefault();

    if ([name, email, uid].includes('')) {
      return;
    }

    const data = await clienteAxios.post(`/collaborator`, {
      name,
      email,
      lawyer: _id,
      uid
    });

    setCollaborator([data.data, ...collaborator]);
    setName('');
    setEmail('');
    setUid('');
  };

  return (
    <div>
      <Row className='mb-4'>
        <Colxx xxs='12'>
          <Card>
            <CardBody>
              <Formik
                initialValues={{
                  name: '',
                  email: '',
                  uid: ''
                }}
              >
                {({ errors, touched }) => (
                  <Form
                    className='av-tooltip tooltip-label-right'
                    onSubmit={onSubmit}
                  >
                    <FormGroup>
                      <Label>Nombre Completo</Label>
                      <Field
                        className='form-control'
                        name='name'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                      {errors.name && touched.name && (
                        <div className='invalid-feedback d-block'>
                          {errors.name}
                        </div>
                      )}
                    </FormGroup>

                    <FormGroup>
                      <Label>Email</Label>
                      <Field
                        className='form-control'
                        name='email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      {errors.email && touched.email && (
                        <div className='invalid-feedback d-block'>
                          {errors.email}
                        </div>
                      )}
                    </FormGroup>

                    <FormGroup>
                      <Label>Contraseña</Label>
                      <Field
                        className='form-control'
                        name='phone'
                        value={uid}
                        onChange={(e) => setUid(e.target.value)}
                      />
                      {errors.address && touched.address && (
                        <div className='invalid-feedback d-block'>
                          {errors.uid}
                        </div>
                      )}
                    </FormGroup>

                    <Button color='primary' block type='submit'>
                      Agregar Colaborador
                    </Button>
                  </Form>
                )}
              </Formik>
            </CardBody>
          </Card>
        </Colxx>
      </Row>
    </div>
  );
};

export default FormAsistant;
