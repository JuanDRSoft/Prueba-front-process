import clienteAxios from 'config/axios';
import React, { useState, useEffect } from 'react';
import { Progress } from 'reactstrap';

const PreviewStatus = ({ collab, count }) => {
  const [countCollab, setCountCollab] = useState('');

  const { name, _id } = collab;

  useEffect(() => {
    const getCount = async () => {
      const data = await clienteAxios.get(`/process/count/${_id}`);
      setCountCollab(data.data);
    };

    getCount();
  }, [collab]);

  return (
    <div className='mb-3'>
      <p className='mb-2'>
        {name}
        <span className='float-right text-muted'>
          {countCollab[0]}/{count[0]}
        </span>
      </p>

      <Progress value={(countCollab[0] / count[0]) * 100} />
    </div>
  );
};

export default PreviewStatus;
