import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const DeleteConfirmDialog = ({
  id,
  name,
  token,
  onDelete,
  baseUrl = 'http://localhost:8800',
  endpoint,
  resourceName = 'item',
  consequencesList = [],
  setData,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);

    // Create loading toast
    const loadingToast = toast.loading(
      `Deleting ${resourceName.toLowerCase()}...`
    );

    try {
      await axios.delete(`${baseUrl}/${endpoint}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (setData) {
        setData((prevData) => prevData.filter((item) => item.id !== id));
      }

      if (onDelete) {
        onDelete(id);
      }

      // Dismiss loading toast and show success
      toast.dismiss(loadingToast);
      toast.success(`${resourceName} deleted successfully`, {
        description: `${resourceName} #${name} has been permanently removed`,
      });

      setIsOpen(false);
    } catch (error) {
      // Dismiss loading toast and show error
      toast.dismiss(loadingToast);
      toast.error(`Failed to delete ${resourceName.toLowerCase()}`, {
        description:
          error.response?.data?.message || 'An unexpected error occurred',
      });
      console.error(`Error deleting ${resourceName}:`, error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Default consequences if none provided
  const defaultConsequences = [
    `Permanently delete all ${resourceName} records`,
    'Remove all associated data',
    'This action cannot be undone',
  ];

  const displayConsequences =
    consequencesList.length > 0 ? consequencesList : defaultConsequences;

  return (
    <>
      <Button
        variant="danger"
        onClick={() => setIsOpen(true)}
        className="d-inline-flex align-items-center"
      >
        <Trash2 className="me-2" style={{ width: '1rem', height: '1rem' }} />
        Delete {resourceName}
      </Button>

      <Modal show={isOpen} onHide={() => setIsOpen(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="text-danger d-flex align-items-center">
            <Trash2
              className="me-2"
              style={{ width: '1.5rem', height: '1.5rem' }}
            />
            ⚠️ Dangerous Action ⚠️
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="h5 text-danger mb-3">
            You are about to permanently delete {resourceName} #{name}
          </p>
          <div className="bg-light border border-danger rounded p-3 mb-3">
            <p className="text-danger fw-bold">This action will:</p>
            <ul className="text-danger">
              {displayConsequences.map((consequence, index) => (
                <li key={index}>{consequence}</li>
              ))}
            </ul>
          </div>
          <p className="fw-bold">
            This action cannot be undone. Are you absolutely sure?
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setIsOpen(false)}
            disabled={isDeleting}
          >
            No, keep {resourceName}
          </Button>
          <Button variant="danger" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                />
                Deleting...
              </>
            ) : (
              'Yes, permanently delete'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DeleteConfirmDialog;
