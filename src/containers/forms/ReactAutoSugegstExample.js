import React, { useState, useEffect } from 'react';
import { injectIntl } from 'react-intl';
import ReactAutoSuggest from 'components/common/ReactAutoSuggest';
import clienteAxios from '../../config/axios';

const ReactAutoSugegstExample = ({ intl, process, setProcess }) => {
  const [options, setOptions] = useState([]);
  const { messages } = intl;

  useEffect(() => {
    const getAllData = async () => {
      const countDataAll = await clienteAxios.get('/process/all/bylawyer');
      setOptions(countDataAll.data);
    };

    getAllData();
  }, []);

  const data = options.map((item) => {
    return {
      filingNumber: item.filingNumber,
      despacho: item.despacho,
      sujetosProcesales: item.sujetosProcesales
    };
  });

  return (
    <ReactAutoSuggest
      placeholder={messages['form-components.type-a-cake']}
      value={process}
      onChange={(val) => setProcess(val)}
      data={data}
    />
  );
};

export default injectIntl(ReactAutoSugegstExample);
