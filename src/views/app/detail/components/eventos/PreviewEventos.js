import { Colxx } from 'components/common/CustomBootstrap';
import React from 'react';
import { Card, CardBody, CardTitle, Row } from 'reactstrap';

const PreviewEventos = ({ event }) => {
  const { title, creado, process, start, end } = event;

  const fecha = creado.split('T')[0];

  return (
    <Row className='mt-2'>
      <Colxx>
        <Card>
          <CardBody>
            <CardTitle
              style={{ display: 'flex', justifyContent: 'space-between' }}
            >
              {title}
              <p>{fecha}</p>
            </CardTitle>

            <div style={{ display: 'flex' }}>
              <i className='simple-icon-clock mr-2 mt-1' />
              <p>Inicia: {start}</p>
              <p className='ml-2 mr-2'>|</p>
              <p>Termina: {end}</p>
            </div>

            {process && <p>Proceso enlazado: {process}</p>}
          </CardBody>
        </Card>
      </Colxx>
    </Row>
  );
};

export default PreviewEventos;
