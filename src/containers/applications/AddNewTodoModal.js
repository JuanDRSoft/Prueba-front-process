import React from 'react';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
// import Select from 'react-select';
// import CustomSelectInput from 'components/common/CustomSelectInput';
import IntlMessages from 'helpers/IntlMessages';
import FormAnexos from 'views/app/detail/components/anexos/FormAnexos';

const AddNewTodoModal = ({ modalOpen, toggleModal, filingNumber, anexos }) => {
  return (
    <Modal
      isOpen={modalOpen}
      toggle={toggleModal}
      wrapClassName='modal-center'
      backdrop='static'
    >
      <ModalHeader toggle={toggleModal}>
        <IntlMessages id='Agregar Nuevo Anexo' />
          <p style={{ marginBottom: -10, marginTop: 5, color: '#0071bd' }}>
          Recuerda que la carpeta esta almacenada en servidores de la Rama
          Judicial, por lo tanto estará sujeta a las condiciones externas de
          disponibilidad ajenas a la app.{' '}
        </p>
      </ModalHeader>
      <ModalBody>
        <FormAnexos filingNumber={filingNumber} anexos={anexos} />
      </ModalBody>
    </Modal>
  );
};

export default AddNewTodoModal;
