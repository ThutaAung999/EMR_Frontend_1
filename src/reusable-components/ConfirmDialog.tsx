import { Modal, Button, Group } from '@mantine/core';

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ open, onClose, onConfirm }) => {
  return (
    <Modal opened={open} onClose={onClose} title="Confirm Delete">
      <div>Are you sure you want to delete this item?</div>
      <Group position="right" mt="md">
        <Button onClick={onClose} variant="outline">Cancel</Button>
        <Button onClick={onConfirm} color="red">Delete</Button>
      </Group>
    </Modal>
  );
};
