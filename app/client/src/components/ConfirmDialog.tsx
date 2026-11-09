import { useI18n } from '../i18n/I18nProvider';

interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({ title, message, confirmLabel, onConfirm, onCancel }: ConfirmDialogProps) {
  const { t } = useI18n();

  return (
    <div className="modal-backdrop">
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="confirm-title" data-testid="confirm-dialog">
        <h2 id="confirm-title">{title}</h2>
        <p>{message}</p>
        <div className="row">
          <button type="button" className="danger" onClick={onConfirm} data-testid="confirm-dialog-confirm">
            {confirmLabel}
          </button>
          <button type="button" className="secondary" onClick={onCancel} data-testid="confirm-dialog-cancel">
            {t('common.cancel')}
          </button>
        </div>
      </div>
    </div>
  );
}
