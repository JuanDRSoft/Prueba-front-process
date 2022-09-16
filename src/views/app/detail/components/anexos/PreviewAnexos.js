import clienteAxios from 'config/axios';
import React, { useState, useEffect } from 'react';

import { Button, Card, CardBody, CardTitle } from 'reactstrap';

const PreviewAnexos = ({ anexo, filingNumber, id }) => {
  const [https, setHttps] = useState('');

  const { name, url } = anexo;
  useEffect(() => {
    if (anexo.url.includes('https://')) {
      setHttps('');
    } else {
      setHttps('https://');
    }
  }, []);

  const deleteAnexo = async () => {
    await clienteAxios.delete(
      `/process/anexos/${filingNumber}/${id}?name=${name}`
    );
    window.location.reload();
  };

  return (
    <Card style={{ marginTop: 10, marginBottom: 10 }}>
      <CardBody
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <a href={`${https}${url}`} rel='noopener noreferrer' target='_blank'>
          <div>
            <CardTitle style={{ fontWeight: 'bold' }}>{name}</CardTitle>
            <div style={{}}>Clic para ir al enlace </div>
          </div>
        </a>

        <Button
          style={{
            backgroundColor: 'white',
            borderColor: 'white',
            display: 'flex',
            gap: 4,
            paddingTop: 20
          }}
          onClick={deleteAnexo}
        >
          <p style={{ color: 'black' }}>Eliminar</p>
          <i
            className='simple-icon-trash'
            style={{ color: 'black', paddingTop: 4 }}
          />
        </Button>
      </CardBody>
    </Card>
  );
};

export default PreviewAnexos;
