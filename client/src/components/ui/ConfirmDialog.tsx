import { useId, useState, useEffect } from 'react';
import Modal from './Modal';
import Button from './Button';
import Input from './Input';
import Field from './Field';

export interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  title: string;
  body: string;
  confirmLabel?: string;
  variant?: 'default' | 'type-to-confirm';
  confirmText?: string; // e.g. "DELETE"
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  body,
  confirmLabel = 'Confirm',
  variant = 'default',
  confirmText = 'DELETE',
}: ConfirmDialogProps) {
  const descriptionId = useId();
  const [inputVal, setInputVal] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) {
      setInputVal('');
      setLoading(false);
    }
  }, [open]);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const isMatch = variant === 'default' || inputVal === confirmText;
  const handleClose = () => {
    if (!loading) onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={title}
      size="sm"
      ariaDescribedBy={descriptionId}
      initialFocus={variant === 'type-to-confirm' ? '#confirm-input' : '[data-dialog-cancel]'}
      closeOnBackdrop={!loading}
      closeOnEscape={!loading}
    >
      <div className="flex flex-col gap-5">
        <p id={descriptionId} className="text-sm dark:text-zinc-300 text-zinc-600">
          {body}
        </p>

        {variant === 'type-to-confirm' && (
          <Field 
            label={`Type "${confirmText}" to confirm`} 
            id="confirm-input"
          >
            <Input
              id="confirm-input"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder={confirmText}
              autoComplete="off"
            />
          </Field>
        )}

        <div className="flex justify-end gap-3 mt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            disabled={loading}
            data-dialog-cancel
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={handleConfirm}
            loading={loading}
            disabled={!isMatch}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
export default ConfirmDialog;
