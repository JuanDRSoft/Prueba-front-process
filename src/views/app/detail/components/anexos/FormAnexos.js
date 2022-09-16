import { Colxx } from 'components/common/CustomBootstrap';
import { NotificationManager } from 'components/common/react-notifications';
import clienteAxios from 'config/axios';
import { Field, Formik } from 'formik';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Button, Form, FormGroup, Label, Row } from 'reactstrap';
import * as Yup from 'yup';

const FormAnexos = ({ authUser, anexos }) => {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');

  const params = useParams();
  const { currentUser } = authUser;
  const { id } = currentUser;

  const onSubmit = async (e) => {
    e.preventDefault();

    if ([name, url].includes('')) {
      NotificationManager.warning(
        'Todos los campos son obligatorios',
        'Anexo Warning',
        3000,
        null,
        null,
        ''
      );
      return;
    }

    if (anexos.some((element) => element.name === name)) {
      NotificationManager.error(
        'Este nombre de anexo ya existe',
        'Anexo Error',
        3000,
        null,
        null,
        ''
      );
      return;
    }

    const data = await clienteAxios.put(`/process/anexos/${params.id}/${id}`, {
      link: [{ name, url }]
    });
    console.log(data, 'data');
    window.location.reload();
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required!'),
    url: Yup.string().required('url is required!')
  });

  return (
    <div>
      <Row className='mb-4'>
        <Colxx xxs='12'>
          <Formik
            initialValues={{
              name: '',
              url: ''
            }}
            validationSchema={validationSchema}
          >
            {({ errors, touched }) => (
              <Form
                className='av-tooltip tooltip-label-right'
                onSubmit={onSubmit}
              >
                <FormGroup>
                  <Label>Nombre</Label>
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
                  <Label>Dirección Url</Label>
                  <Field
                    className='form-control'
                    name='url'
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                  {errors.url && touched.url && (
                    <div className='invalid-feedback d-block'>{errors.url}</div>
                  )}
                </FormGroup>

                <Button color='primary' block type='submit'>
                  Guardar Anexo
                </Button>
              </Form>
            )}
          </Formik>
        </Colxx>
      </Row>
    </div>
  );
};

const mapStateToProps = ({ authUser }) => {
  return {
    authUser
  };
};
const mapActionsToProps = {};

export default connect(mapStateToProps, mapActionsToProps)(FormAnexos);
