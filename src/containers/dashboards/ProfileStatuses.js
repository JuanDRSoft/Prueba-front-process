/* eslint-disable react/no-array-index-key */
import React from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { Card, CardBody, CardTitle } from 'reactstrap';

import IntlMessages from 'helpers/IntlMessages';
import PreviewStatus from './PreviewStatus';

const ProfileStatuses = ({ collaborator, count }) => {
  return (
    <Card>
      <CardBody>
        <CardTitle>
          <IntlMessages id='Procesos Colaboradores' />
        </CardTitle>

        <div className='dashboard-logs'>
          <PerfectScrollbar
            options={{ suppressScrollX: true, wheelPropagation: false }}
          >
            {collaborator.map((collab, index) => {
              return (
                <PreviewStatus collab={collab} key={index} count={count} />
              );
            })}
          </PerfectScrollbar>
        </div>
      </CardBody>
    </Card>
  );
};
export default ProfileStatuses;
