/* eslint-disable react/no-array-index-key */
import React from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { Card, CardBody, CardTitle } from 'reactstrap';

import IntlMessages from 'helpers/IntlMessages';

const Logs = ({ collaborator, getCollaboratorEdit, getRules }) => {
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
                          <button
                            type='button'
                            className='btn btn-link'
                            style={{ marginTop: -10 }}
                            // eslint-disable-next-line no-underscore-dangle
                            onClick={() => getCollaboratorEdit(log._id)}
                          >
                            <i className='simple-icon-pencil mr-1' />
                            Editar
                          </button>

                          <button
                            type='button'
                            className='btn btn-link'
                            style={{ marginTop: -10 }}
                            // eslint-disable-next-line no-underscore-dangle
                            onClick={() => getRules(log._id)}
                          >
                            <i className='simple-icon-equalizer mr-1' />
                            Reglas
                          </button>
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
