import React, { useState } from 'react';
import { Row, Card, CardTitle, Label, FormGroup, Button } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import { connect } from 'react-redux';
import { Colxx } from 'components/common/CustomBootstrap';
import IntlMessages from 'helpers/IntlMessages';
import { forgotPassword } from 'redux/actions';
import { NotificationManager } from 'components/common/react-notifications';
import uri from 'constants/api';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [pregunta, setPregunta] = useState(0);
  const [uid, setUid] = useState('');
  const [newUid, setNewUid] = useState('');

  const handelEnviar = async (e) => {
    e.preventDefault();
    setLoading(true);

    if ([email].includes('')) {
      NotificationManager.warning(
        'Llena todos los campos vacios',
        'Advertencia',
        3000,
        null,
        null,
        ''
      );

      setLoading(false);
      return;
    }

    try {
      const data = await axios.post(`${uri}/lawyer/password`, {
        email
      });
      console.log(data);
      setPregunta(pregunta + 1);
      NotificationManager.success(
        data.data.msg,
        'Verifica tu correo electronico',
        6000,
        null,
        null,
        ''
      );
      setLoading(false);
    } catch (error) {
      NotificationManager.error(
        error.response.data.msg,
        'Error de envio',
        3000,
        null,
        null,
        ''
      );
      setLoading(false);
    }
  };

  const onForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    if ([email, uid, newUid].includes('')) {
      NotificationManager.warning(
        'Llena todos los campos vacios',
        'Advertencia',
        3000,
        null,
        null,
        ''
      );

      setLoading(false);
      return;
    }

    try {
      const data = await axios.post(`${uri}/lawyer/newPassword`, {
        email,
        uid,
        newUid
      });

      NotificationManager.success(
        data.data.msg,
        'Verifica tu correo electronico',
        6000,
        null,
        null,
        ''
      );
      window.location.href = '/';
      setLoading(false);
    } catch (error) {
      NotificationManager.error(
        error.response.data.msg,
        'Error de codigo de seguridad',
        3000,
        null,
        null,
        ''
      );
      setLoading(false);
    }
  };

  const initialValues = { email, uid, newUid };

  return (
    <Row className='h-100'>
      <Colxx xxs='12' md='10' className='mx-auto my-auto'>
        <Card className='auth-card'>
          <div className='position-relative image-side '>
            <p className='text-white h2'>MVP APP PROCESS</p>
            <p className='white mb-0'>
              Please use your e-mail to reset your password. <br />
              If you are not a member, please{' '}
              <NavLink to='/user/register' className='white'>
                register
              </NavLink>
              .
            </p>
          </div>
          <div className='form-side'>
            <NavLink to='/' className='white'>
              <span className='logo-single' />
            </NavLink>
            <CardTitle className='mb-4'>
              <IntlMessages id='user.forgot-password' />
            </CardTitle>

            <Formik initialValues={initialValues}>
              {() => (
                <Form className='av-tooltip tooltip-label-bottom'>
                  {pregunta === 0 ? (
                    <FormGroup className='form-group has-float-label'>
                      <Label>
                        <IntlMessages id='user.email' />
                      </Label>
                      <Field
                        className='form-control'
                        name='email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </FormGroup>
                  ) : null}

                  {pregunta === 1 ? (
                    <div>
                      <FormGroup className='form-group has-float-label'>
                        <Label>
                          <IntlMessages id='Codigo Seguridad' />
                        </Label>
                        <Field
                          className='form-control'
                          name='codigo'
                          value={uid}
                          onChange={(e) => setUid(e.target.value)}
                        />
                      </FormGroup>
                      <FormGroup className='form-group has-float-label'>
                        <Label>
                          <IntlMessages id='Nueva Contraseña' />
                        </Label>
                        <Field
                          className='form-control'
                          name='password'
                          type='password'
                          value={newUid}
                          onChange={(e) => setNewUid(e.target.value)}
                        />
                      </FormGroup>
                    </div>
                  ) : null}

                  <div className='d-flex justify-content-between align-items-center'>
                    <NavLink to='/user/forgot-password'>
                      <IntlMessages id='user.forgot-password-question' />
                    </NavLink>

                    {pregunta === 0 ? (
                      <Button
                        color='primary'
                        className={`btn-shadow btn-multiple-state ${
                          loading ? 'show-spinner' : ''
                        }`}
                        size='lg'
                        onClick={handelEnviar}
                      >
                        <span className='spinner d-inline-block'>
                          <span className='bounce1' />
                          <span className='bounce2' />
                          <span className='bounce3' />
                        </span>
                        <span className='label'>
                          <IntlMessages id='ENVIAR CODIGO' />
                        </span>
                      </Button>
                    ) : null}

                    {pregunta === 1 ? (
                      <Button
                        color='primary'
                        className={`btn-shadow btn-multiple-state ${
                          loading ? 'show-spinner' : ''
                        }`}
                        size='lg'
                        onClick={onForgotPassword}
                      >
                        <span className='spinner d-inline-block'>
                          <span className='bounce1' />
                          <span className='bounce2' />
                          <span className='bounce3' />
                        </span>
                        <span className='label'>
                          <IntlMessages id='GUARDAR' />
                        </span>
                      </Button>
                    ) : null}
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </Card>
      </Colxx>
    </Row>
  );
};

const mapStateToProps = ({ authUser }) => {
  const { forgotUserMail, loading, error } = authUser;
  return { forgotUserMail, loading, error };
};

export default connect(mapStateToProps, {
  forgotPasswordAction: forgotPassword
})(ForgotPassword);
