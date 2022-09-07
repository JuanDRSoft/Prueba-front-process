import React, { useEffect, useState } from 'react';
import {
  Row,
  Card,
  CardTitle,
  Form,
  FormGroup,
  Label,
  Input,
  Button
} from 'reactstrap';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { registerUser } from 'redux/actions';

import IntlMessages from 'helpers/IntlMessages';
import { Colxx } from 'components/common/CustomBootstrap';
import { currentUser } from 'constants/defaultValues';
import { NotificationManager } from 'components/common/react-notifications';
import axios from 'axios';
import uri from 'constants/api';
import { setCurrentUser } from 'helpers/Utils';

const Register = () => {
  const [email, setEmail] = useState('');
  const [uid, setUid] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const correo = email.toLowerCase();
    setEmail(correo);
  }, [email]);

  const onUserRegister = async () => {
    if ([email, uid, name].includes('')) {
      NotificationManager.warning(
        'Todos los campos son obligatorios',
        'Register Failed',
        3000,
        null,
        null,
        ''
      );
      return;
    }

    try {
      setLoading(true);
      const data = await axios.post(`${uri}/lawyer`, {
        email,
        uid,
        name,
        phone
      });
      const { _id } = data.data;
      const item = {
        title: name,
        id: _id,
        uid: data.data.uid,
        ...currentUser
      };
      setCurrentUser(item);
      console.log(data);

      const now = new Date();
      const vigente = 1000 * 60 * 60 * 24 * 30;
      const fecha = now.getTime() + vigente;
      const endDate1 = new Date(fecha);

      const bodyData = {
        paymentDate: now,
        status: 'approved',
        lawyer: _id,
        amount: 0,
        voucher: 1,
        endDate: endDate1
      };

      const payment = await axios.post(`${uri}/payments`, bodyData);
      console.log(payment.data);

      NotificationManager.success(
        'Ya puedes iniciar sesión',
        'Register Success',
        3000,
        null,
        null,
        ''
      );

      setTimeout(() => {
        window.location.href = '/user/login';
        setLoading(false);
      }, 2500);
    } catch (error) {
      NotificationManager.error(error, 'Register Failed', 3000, null, null, '');
    }
  };

  return (
    <Row className='h-100'>
      <Colxx xxs='12' md='10' className='mx-auto my-auto'>
        <Card className='auth-card'>
          <div className='position-relative image-side '>
            <p className='text-white h2'>MVP APP PROCESS</p>
            <p className='white mb-0'>
              Llena este formulario con tus datos para registrarte. <br />
              Si ya tienes una cuenta, haz clic aqui en{' '}
              <NavLink to='/user/login' className='white'>
                login
              </NavLink>
              .
            </p>
          </div>
          <div className='form-side'>
            <NavLink to='/' className='white'>
              <span className='logo-single' />
            </NavLink>
            <CardTitle className='mb-4'>
              <IntlMessages id='user.register' />
            </CardTitle>
            <Form>
              <FormGroup className='form-group has-float-label  mb-4'>
                <Label>
                  <IntlMessages id='user.fullname' />
                </Label>
                <Input
                  type='name'
                  defaultValue={name}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </FormGroup>

              <FormGroup className='form-group has-float-label  mb-4'>
                <Label>
                  <IntlMessages id='Telefono' />
                </Label>
                <Input
                  type='phone'
                  defaultValue={phone}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </FormGroup>

              <FormGroup className='form-group has-float-label  mb-4'>
                <Label>
                  <IntlMessages id='user.email' />
                </Label>
                <Input
                  type='email'
                  defaultValue={email}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormGroup>

              <FormGroup className='form-group has-float-label  mb-4'>
                <Label>
                  <IntlMessages id='user.password' defaultValue={uid} />
                </Label>
                <Input
                  type='password'
                  value={uid}
                  onChange={(e) => setUid(e.target.value)}
                />
              </FormGroup>

              <div className='d-flex justify-content-end align-items-center'>
                <Button
                  color='primary'
                  className={`btn-shadow btn-multiple-state ${
                    loading ? 'show-spinner' : ''
                  }`}
                  size='lg'
                  onClick={() => onUserRegister()}
                >
                  <span className='spinner d-inline-block'>
                    <span className='bounce1' />
                    <span className='bounce2' />
                    <span className='bounce3' />
                  </span>
                  <span className='label'>
                    <IntlMessages id='user.register-button' />
                  </span>
                </Button>
              </div>
            </Form>
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
  registerUserAction: registerUser
})(Register);
