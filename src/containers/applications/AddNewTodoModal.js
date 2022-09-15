import React from 'react';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
// import Select from 'react-select';
// import CustomSelectInput from 'components/common/CustomSelectInput';
import IntlMessages from 'helpers/IntlMessages';
import FormAnexos from 'views/app/detail/components/anexos/FormAnexos';

const AddNewTodoModal = ({ modalOpen, toggleModal, filingNumber }) => {
  return (
    <Modal
      isOpen={modalOpen}
      toggle={toggleModal}
      wrapClassName='modal-center'
      backdrop='static'
    >
      <ModalHeader toggle={toggleModal}>
        <IntlMessages id='Agregar Nuevo Anexo' />
      </ModalHeader>
      <ModalBody>
        <FormAnexos filingNumber={filingNumber} />
      </ModalBody>
    </Modal>
  );
};

export default AddNewTodoModal;
