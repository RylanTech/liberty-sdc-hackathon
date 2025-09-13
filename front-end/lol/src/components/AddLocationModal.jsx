import { Form, Row } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';

function AddLocationModal(props) {
    return (
        <Modal {...props} size='lg' aria-labelledby="contained-modal-title-vcenter">
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Using Grid in Modal
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="grid-example">
                <Container>
                    <Row>
                        
                        <div className='col-12 col-sm-4'>
                            Location
                            <Form.Control/>
                        </div>
                        <div className='col-12 col-sm-4'>
                            Category
                            <Form.Control/>
                        </div>
                        <div className='col-12 col-sm-4'>
                            State/Province
                            <Form.Control/>
                        </div>
                        
                    </Row>
                </Container>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default AddLocationModal