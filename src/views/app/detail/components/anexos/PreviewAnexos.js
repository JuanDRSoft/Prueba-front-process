import React, { useState, useEffect } from 'react';

import { Card, CardBody, CardTitle, Spinner } from 'reactstrap';

const PreviewAnexos = ({ anexo, loading }) => {
  const [https, setHttps] = useState('');

  useEffect(() => {
    if (anexo.url.includes('https://')) {
      setHttps('');
    } else {
      setHttps('https://');
    }
  }, []);
  return (
    <a href={`${https}${anexo.url}`} rel='noopener noreferrer' target='_blank'>
      <Card style={{ marginTop: 10, marginBottom: 10 }}>
        <CardBody>
          <CardTitle style={{ fontWeight: 'bold' }}>{anexo.name}</CardTitle>
          {loading ? (
            <div style={{ textAlign: 'center' }}>
              <Spinner color='primary' className='mb-1' size='lg' />
            </div>
          ) : (
            <div style={{}}>{anexo.url}</div>
          )}
        </CardBody>
      </Card>
    </a>
  );
};

export default PreviewAnexos;
