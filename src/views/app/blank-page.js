import React, { useEffect, useState } from 'react';
import { Row, Badge } from 'reactstrap';
import IntlMessages from 'helpers/IntlMessages';
import { Colxx, Separator } from 'components/common/CustomBootstrap';
import Breadcrumb from 'containers/navs/Breadcrumb';
import IconCardsCarousel, {
  IconCards
} from 'containers/dashboards/IconCardsCarousel';
import { getDate, getMonth, getYear } from 'date-fns';
import data, { membership } from 'data/iconCards';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import Logs from 'containers/dashboards/Logs';
import ProfileStatuses from 'containers/dashboards/ProfileStatuses';
import FormAuth from './detail/components/Proceso/FormAuth';
import FormAsistant from './detail/components/Proceso/FormAsistant';
import FormRules from './detail/components/Proceso/FormRules';
import clienteAxios from '../../config/axios';

const BlankPage = ({ match, authUser }) => {
  const [count, setCount] = useState({});
  const [lawyer, setLawyer] = useState({});
  const [collab, setCollab] = useState();
  const [payment, setPayment] = useState({});
  const [urlPago, setUrlPago] = useState('');
  const [approved, setApproved] = useState(false);
  const [collaborator, setCollaborator] = useState([]);
  const [edit, setEdit] = useState({});
  const [form, setForm] = useState(false);
  const [member, setMember] = useState();
  const [rol, setRol] = useState();

  const { currentUser } = authUser;
  const { endDate } = payment;

  useEffect(() => {
    const getLawyer = async () => {
      try {
        const lawyerData = await clienteAxios.get(
          `/collaborator/${currentUser.id}`
        );
        setLawyer(lawyerData.data);
        setCollab(lawyerData.data);
        setMember(lawyerData.data.membership);
        setRol(lawyerData.data.role);
      } catch (err) {
        console.log(err);
        console.log(rol);
      }
    };

    const getCount = async () => {
      const countData = await clienteAxios.get('/process/count/bylawyer');
      setCount(countData.data);
    };

    const getCollaborator = async () => {
      const dataCollaborator = await clienteAxios.get(
        '/collaborator/all/bylawyer'
      );
      setCollaborator(dataCollaborator.data);
    };

    getLawyer();
    getCollaborator();
    getCount();
  }, []);

  useEffect(() => {
    if (lawyer === null) {
      const getLawyer = async () => {
        try {
          const lawyerData = await clienteAxios.get(
            `/lawyer/${currentUser.id}`
          );
          setLawyer(lawyerData.data);
          setMember(lawyerData.data.membership);
          setRol(lawyerData.data.role);
        } catch (err) {
          console.log(err);
        }
      };
      getLawyer();
    }
    if (collab !== null) {
      const getPayment = async () => {
        try {
          const paymentData = await clienteAxios.get(
            `/payments/lawyer/${lawyer.lawyer}`
          );

          const countPayment = paymentData.data.length - 1;
          console.log(paymentData.data[countPayment]);

          if (paymentData.data[countPayment].status.includes('approved')) {
            setApproved(true);
            setPayment(paymentData.data[countPayment]);
          }
        } catch (error) {
          console.log(error);
        }
      };
      getPayment();
    } else {
      const getPayment = async () => {
        try {
          const paymentData = await clienteAxios.get(
            `/payments/lawyer/${currentUser.id}`
          );

          const countPayment = paymentData.data.length - 1;
          console.log(paymentData.data[countPayment]);

          if (paymentData.data[countPayment].status.includes('approved')) {
            setApproved(true);
            setPayment(paymentData.data[countPayment]);
          }
        } catch (error) {
          console.log(error);
        }
      };
      getPayment();
    }
  }, [lawyer, collab]);

  const invoice = () => {
    const price = count[1] * 500;
    return price;
  };

  const getCollaboratorEdit = async (id) => {
    setForm(false);
    try {
      // eslint-disable-next-line no-underscore-dangle
      const collabData = await clienteAxios.get(`/collaborator/${id}`);

      setEdit(collabData.data);
    } catch (error) {
      console.log(error);
    }
  };

  const formatDate = () => {
    const fecha = Date.parse(endDate);

    return `${Number(getDate(fecha)) > 9 ? '' : '0'}
      ${getDate(fecha)}-${Number(getMonth(fecha)) + 1 > 9 ? '' : '0'}${
      Number(getMonth(fecha)) + 1
    }-${getYear(fecha)}`;
  };

  const getRules = async (id) => {
    setForm(true);
    try {
      // eslint-disable-next-line no-underscore-dangle
      const collabData = await clienteAxios.get(`/collaborator/${id}`);
      console.log(collabData.data);
      setEdit(collabData.data);
    } catch (error) {
      console.log(error);
    }
  };

  const paymentMethod = async () => {
    const url = 'https://api.mercadopago.com/checkout/preferences';

    const body = {
      payer: { email: 'test_user_67773890@testuser.com' },
      items: [
        {
          id: lawyer.lawyer ? lawyer.lawyer : currentUser.id,
          title: 'Subscripción',
          currency_id: 'COP',
          description: 'pago de su factura mensual',
          picture_url: 'prueba',
          category_id: 'cat123',
          quantity: count[1],
          unit_price: 500
        }
      ],
      back_urls: {
        success: 'localhost:3000/app/blank-page/',
        failure: '/failure',
        pending: '/pending'
      },
      notification_url: 'https://paymenth-method.herokuapp.com/ipn'
    };

    const paymentData = await clienteAxios.post(url, body, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer APP_USR-7428682502971385-101011-3bf5f0f6dee905d73e5d94f0b7a527a3-1214673637`
      }
    });

    setUrlPago(paymentData.data.init_point);
  };

  useEffect(() => {
    paymentMethod();
  }, [count]);

  useEffect(() => {
    if (window.location.search.includes('approved')) {
      setApproved(true);
    }
  });

  const fnData = () => {
    data.forEach((element, i) => {
      data[i].value = count[i];
    });

    return <IconCardsCarousel data={data} />;
  };

  const membershipData = () => {
    membership.forEach((element, i) => {
      membership[i].value = approved ? (
        <p style={{ fontSize: 18 }}>
          <Badge color='success' pill>
            ACTIVA
          </Badge>
        </p>
      ) : (
        <p style={{ fontSize: 18 }}>
          <Badge color='danger' pill>
            VENCIDA
          </Badge>
        </p>
      );
      membership[1].value = (
        <p style={{ fontSize: 30, marginTop: 8 }}>
          {invoice()} <IntlMessages id='COP' />
        </p>
      );

      membership[2].value = (
        <p style={{ fontSize: 30, marginTop: 8 }}>{formatDate()}</p>
      );
    });

    return <IconCards data={membership} />;
  };

  return (
    <>
      <Row>
        <Colxx xxs='12'>
          <Breadcrumb heading='menu.blank-page' match={match} />
          <Separator className='mb-5' />
        </Colxx>
      </Row>
      <Row>
        <Colxx xxs='12' className='mb-1' /* style={{ marginBotton: '0px' }} */>
          {/*  <p>
            <IntlMessages id="menu.blank-page" />
          </p> */}
          {count && fnData()}
        </Colxx>
      </Row>
      {member && (
        <Row>
          <Colxx xxs='12' className='mb-1'>
            <h1>Membresía Y Facturación</h1>

            <div style={{ marginTop: 20 }}>{membershipData()}</div>

            {approved ? null : (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: 20
                }}
              >
                <iframe
                  width='100%'
                  height='600'
                  style={{ border: 'none' }}
                  id='inlineFrameExample'
                  title='Inline Frame Example'
                  src={urlPago}
                >
                  h
                </iframe>
              </div>
            )}
          </Colxx>
        </Row>
      )}

      {rol === 'Admin' ? (
        <>
          <Row className='mt-4'>
            <Colxx>
              <h1>Colaboradores</h1>
            </Colxx>
          </Row>
          <Row>
            <Colxx xxs='3' className='mb-1'>
              {form ? (
                <FormRules
                  lawyer={lawyer}
                  setCollaborator={setCollaborator}
                  collaborator={collaborator}
                  edit={edit}
                  setForm={setForm}
                  setEdit={setEdit}
                />
              ) : (
                <FormAsistant
                  lawyer={lawyer}
                  setCollaborator={setCollaborator}
                  collaborator={collaborator}
                  edit={edit}
                />
              )}
            </Colxx>

            <Colxx>
              <Logs
                collaborator={collaborator}
                getCollaboratorEdit={getCollaboratorEdit}
                edit={edit}
                getRules={getRules}
              />
            </Colxx>

            <Colxx xxs='3'>
              <ProfileStatuses collaborator={collaborator} count={count} />
            </Colxx>
          </Row>{' '}
          <Row className='mt-4'>
            <Colxx xxs='12' className='mb-1'>
              <h1>Datos de cuenta</h1>

              <div>
                <FormAuth lawyer={lawyer} />
              </div>
            </Colxx>
          </Row>{' '}
        </>
      ) : null}
    </>
  );
};

const mapStateToProps = ({ authUser }) => {
  return {
    authUser
  };
};
export default injectIntl(connect(mapStateToProps, {})(BlankPage));
