import React, { useState, useEffect } from 'react';
import { Row, Card, CardTitle, Label, FormGroup, Button } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';

import { Formik, Form, Field } from 'formik';
import { NotificationManager } from 'components/common/react-notifications';

import { loginUser } from 'redux/actions';
import { Colxx } from 'components/common/CustomBootstrap';
import IntlMessages from 'helpers/IntlMessages';
import axios from 'axios';
import uri from 'constants/api';
import { currentUser } from 'constants/defaultValues';
import { setCurrentUser } from 'helpers/Utils';

const validatePassword = (value) => {
  let error;
  if (!value) {
    error = 'Please enter your password';
  } else if (value.length < 4) {
    error = 'Value must be longer than 3 characters';
  }
  return error;
};

const validateEmail = (value) => {
  let error;
  if (!value) {
    error = 'Please enter your email address';
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
    error = 'Invalid email address';
  }
  return error;
};

const Login = ({ loading }) => {
  const [email, setEmail] = useState('');
  const [uid, setUid] = useState('');

  useEffect(() => {
    const correo = email.toLowerCase();
    setEmail(correo);
  }, [email]);

  const onCollaboratorLogin = async () => {
    validateEmail(email);
    validatePassword(uid);

    if (email !== '' && uid !== '') {
      // loginUserAction({ email, password }, history);

      try {
        const data = await axios.post(`${uri}/collaborator/find/email`, {
          email,
          uid
        });

        const { name, _id, role, lawyer, process, events, membership } =
          data.data;

        localStorage.setItem('token', _id);

        const item = {
          title: name,
          id: _id,
          uid: data.data.uid,
          rol: role,
          admin: lawyer,
          ruleProcess: process,
          ruleEvents: events,
          ruleMembership: membership,
          ...currentUser
        };
        setCurrentUser(item);
        console.log(data);

        window.location.href = '/app';
      } catch (err) {
        NotificationManager.warning(
          'el usuario no existe o sus credenciales son incorrectas',
          'Login Error',
          3000,
          null,
          null,
          ''
        );
      }
    }
  };

  const onUserLogin = async () => {
    validateEmail(email);
    validatePassword(uid);

    if (email !== '' && uid !== '') {
      // loginUserAction({ email, password }, history);

      try {
        const data = await axios.post(`${uri}/lawyer/find/email`, {
          email,
          uid
        });

        const { name, _id } = data.data;

        localStorage.setItem('token', _id);

        const item = {
          title: name,
          id: _id,
          uid: data.data.uid,
          ruleProcess: true,
          ruleEvents: true,
          ruleMembership: true,
          ...currentUser
        };
        setCurrentUser(item);
        console.log(data);

        window.location.href = '/app';
      } catch (error) {
        onCollaboratorLogin();
      }
    }
  };

  const initialValues = { email, uid };

  return (
    <Row className='h-100'>
      <Colxx xxs='12' md='10' className='mx-auto my-auto'>
        <Card className='auth-card'>
          <div className='position-relative image-side '>
            <p className='text-white h2'>MVP APP PROCESS</p>
            <p className='white mb-0'>
              Ingresa tus datos para iniciar sesión.
              <br />
              Si aun no estas registrado, haz clic aqui en{' '}
              <NavLink to='/user/register' style={{ color: 'white' }}>
                registrarte
              </NavLink>
              .
            </p>
          </div>
          <div className='form-side'>
            <NavLink to='/' className='white'>
              <span className='logo-single' />
            </NavLink>
            <CardTitle className='mb-4'>
              <IntlMessages id='user.login-title' />
            </CardTitle>

            <Formik initialValues={initialValues} onSubmit={onUserLogin}>
              {({ errors, touched }) => (
                <Form className='av-tooltip tooltip-label-bottom'>
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
                    {errors.email && touched.email && (
                      <div className='invalid-feedback d-block'>
                        {errors.email}
                      </div>
                    )}
                  </FormGroup>
                  <FormGroup className='form-group has-float-label'>
                    <Label>
                      <IntlMessages id='user.password' />
                    </Label>
                    <Field
                      className='form-control'
                      type='password'
                      name='password'
                      value={uid}
                      onChange={(e) => setUid(e.target.value)}
                    />
                    {errors.uid && touched.uid && (
                      <div className='invalid-feedback d-block'>
                        {errors.uid}
                      </div>
                    )}
                  </FormGroup>
                  <div className='d-flex justify-content-between align-items-center'>
                    <NavLink to='/user/forgot-password'>
                      <IntlMessages id='user.forgot-password-question' />
                    </NavLink>

                    <Button
                      color='primary'
                      className={`btn-shadow btn-multiple-state ${
                        loading ? 'show-spinner' : ''
                      }`}
                      size='lg'
                    >
                      <span className='spinner d-inline-block'>
                        <span className='bounce1' />
                        <span className='bounce2' />
                        <span className='bounce3' />
                      </span>
                      <span className='label'>
                        <IntlMessages id='user.login-button' />
                      </span>
                    </Button>
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
  const { loading, error } = authUser;
  return { loading, error };
};

export default connect(mapStateToProps, {
  loginUserAction: loginUser
})(Login);
