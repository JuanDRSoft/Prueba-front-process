import { Alert, Badge, Row } from 'reactstrap';
import React, { useEffect, useState } from 'react';
import clienteAxios from 'config/axios';
import { Colxx } from 'components/common/CustomBootstrap';

import IntlMessages from 'helpers/IntlMessages';
import Pagination from './Pagination';
import ContextMenuContainer from './ContextMenuContainer';
import DataListView from './DataListView';

function collect(props) {
  return { data: props.data };
}

const ListPageListing = ({
  items,
  authUser,
  selectedItems,
  onCheckItem,
  currentPage,
  totalPage,
  onContextMenuClick,
  onContextMenu,
  onChangePage
}) => {
  const [approved, setApproved] = useState(false);

  const { currentUser } = authUser;

  useEffect(() => {
    const getPayment = async () => {
      try {
        const paymentData = await clienteAxios.get(
          `/payments/lawyer/${currentUser.id}`
        );

        const countPayment = paymentData.data.length - 1;
        console.log(paymentData.data[countPayment]);

        if (paymentData.data[countPayment].status.includes('approved')) {
          setApproved(true);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getPayment();
    console.log(approved);
  }, []);

  const onClick = () => {
    window.location.href = '/app/blank-page/';
  };

  return (
    <Row>
      {approved ? null : (
        <Colxx xxs='12'>
          <Alert
            color='danger'
            className='rounded'
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <IntlMessages id='Su membresia se encuentra vencida, para continuar haciendo segumiento a sus casos debera realizar el pago de su factura' />
            <Badge
              color='danger'
              pill
              onClick={onClick}
              style={{ cursor: 'pointer' }}
            >
              REALIZAR PAGO
            </Badge>
          </Alert>
        </Colxx>
      )}

      {items.map((product) => {
        return (
          <DataListView
            key={product.filingNumber}
            proceso={product}
            isSelect={selectedItems.includes(product.filingNumber)}
            onCheckItem={onCheckItem}
            collect={collect}
            authUser={authUser}
          />
        );
      })}
      <Pagination
        currentPage={currentPage}
        totalPage={totalPage}
        onChangePage={(i) => onChangePage(i)}
      />
      <ContextMenuContainer
        onContextMenuClick={onContextMenuClick}
        onContextMenu={onContextMenu}
      />
    </Row>
  );
};

export default React.memo(ListPageListing);
