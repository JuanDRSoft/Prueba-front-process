/* eslint-disable react/no-array-index-key */
import React from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { Card, CardBody, CardTitle } from 'reactstrap';

import IntlMessages from 'helpers/IntlMessages';

const Logs = ({ collaborator }) => {
  return (
    <div>
      <Card>
        <CardBody>
          <CardTitle>
            <IntlMessages id='Colaboradores Registrados' />
          </CardTitle>
          <div className='dashboard-logs'>
            <PerfectScrollbar
              options={{ suppressScrollX: true, wheelPropagation: false }}
            >
              <table className='table table-sm table-borderless'>
                <tbody>
                  {collaborator.map((log, index) => {
                    return (
                      <tr key={index}>
                        <td>
                          <span className='log-indicator align-middle border-theme-2' />
                        </td>
                        <td>
                          <span className='font-weight-medium mr-5'>
                            {log.name}
                          </span>
                          <span className='text-muted'>{log.email}</span>
                        </td>
                        <td className='text-right'>
                          <span className='text-muted'>Editar</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </PerfectScrollbar>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
export default Logs;
