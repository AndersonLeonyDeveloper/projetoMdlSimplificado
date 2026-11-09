import { useCallback, useEffect, useState, type FormEvent } from 'react';

import { api } from '../api';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { Layout } from '../components/Layout';
import { useI18n } from '../i18n/I18nProvider';
import { adminNav, residentNav } from '../navigation';
import type { Area, Reservation, Slot } from '../types';

function todayLocal() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}

// Residents book and cancel; admins get a read-only table of every reservation.
export function ReservationsPage({ isAdmin }: { isAdmin: boolean }) {
  const { t, translateError, translateData } = useI18n();
  const [options, setOptions] = useState<{ areas: Area[]; slots: Slot[] }>({ areas: [], slots: [] });
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [area, setArea] = useState('');
  const [date, setDate] = useState('');
  const [slot, setSlot] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [canceling, setCanceling] = useState<Reservation | null>(null);

  const load = useCallback(async () => {
    const data = await api<{ items: Reservation[] }>('/reservations');
    setReservations(data.items);
  }, []);

  useEffect(() => {
    api<{ areas: Area[]; slots: Slot[] }>('/reservations/options').then(setOptions);
    load().catch((err) => setError(translateError(err, 'common.somethingWrong')));
  }, [load, translateError]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!area || !date || !slot) {
      setError(t('reservations.fieldsRequired'));
      return;
    }

    try {
      await api('/reservations', { method: 'POST', body: { area, date, slot } });
      setSuccess(t('reservations.confirmed'));
      setArea('');
      setDate('');
      setSlot('');
      await load();
    } catch (err) {
      setError(translateError(err, 'reservations.createFailed'));
    }
  }

  async function confirmCancel() {
    if (!canceling) return;
    setError('');
    setSuccess('');
    try {
      await api(`/reservations/${canceling.id}`, { method: 'DELETE' });
      setSuccess(t('reservations.canceled'));
      await load();
    } catch (err) {
      setError(translateError(err, 'reservations.cancelFailed'));
    } finally {
      setCanceling(null);
    }
  }

  return (
    <Layout nav={isAdmin ? adminNav : residentNav}>
      <h1 data-testid="reservations-title">{isAdmin ? t('reservations.titleAdmin') : t('reservations.titleResident')}</h1>

      {error && (
        <div role="alert" className="alert alert-error" data-testid="reservation-error">
          {error}
        </div>
      )}
      {success && (
        <div role="status" className="alert alert-success" data-testid="reservation-success">
          {success}
        </div>
      )}

      {!isAdmin && (
        <form className="card" onSubmit={handleSubmit} noValidate data-testid="reservation-form" style={{ marginBottom: '1.5rem' }}>
          <h2>{t('reservations.book')}</h2>
          <label>
            {t('reservations.area')}
            <select value={area} onChange={(event) => setArea(event.target.value)} data-testid="reservation-area">
              <option value="">{t('reservations.selectArea')}</option>
              {options.areas.map((item) => (
                <option key={item.id} value={item.id}>
                  {translateData('area', item.id, item.name)}
                </option>
              ))}
            </select>
          </label>
          <label>
            {t('reservations.date')}
            <input
              type="date"
              min={todayLocal()}
              value={date}
              onChange={(event) => setDate(event.target.value)}
              data-testid="reservation-date"
            />
          </label>
          <label>
            {t('reservations.slot')}
            <select value={slot} onChange={(event) => setSlot(event.target.value)} data-testid="reservation-slot">
              <option value="">{t('reservations.selectSlot')}</option>
              {options.slots.map((item) => (
                <option key={item.id} value={item.id}>
                  {translateData('slot', item.id, item.label)}
                </option>
              ))}
            </select>
          </label>
          <button type="submit" data-testid="reservation-submit">
            {t('reservations.submit')}
          </button>
        </form>
      )}

      {reservations.length === 0 ? (
        <p data-testid="reservations-empty">{t('reservations.empty')}</p>
      ) : (
        <table data-testid="reservation-table">
          <thead>
            <tr>
              {isAdmin && <th>{t('reservations.resident')}</th>}
              <th>{t('reservations.area')}</th>
              <th>{t('reservations.date')}</th>
              <th>{t('reservations.slot')}</th>
              <th>{t('reservations.status')}</th>
              {!isAdmin && <th />}
            </tr>
          </thead>
          <tbody>
            {reservations.map((item) => (
              <tr key={item.id} data-testid="reservation-row">
                {isAdmin && <td data-testid="reservation-resident">{item.residentName}</td>}
                <td data-testid="reservation-area-name">{translateData('area', item.area, item.areaName)}</td>
                <td data-testid="reservation-date-value">{item.date}</td>
                <td data-testid="reservation-slot-label">{translateData('slot', item.slot, item.slotLabel)}</td>
                <td>
                  <span className={`badge badge-${item.status}`} data-testid="reservation-status">
                    {translateData('status', item.status, item.status)}
                  </span>
                </td>
                {!isAdmin && (
                  <td>
                    {item.status === 'Confirmed' && (
                      <button type="button" className="danger" onClick={() => setCanceling(item)} data-testid="reservation-cancel">
                        {t('reservations.cancel')}
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {canceling && (
        <ConfirmDialog
          title={t('reservations.cancel')}
          message={t('reservations.cancelMessage', {
            area: translateData('area', canceling.area, canceling.areaName),
            date: canceling.date,
          })}
          confirmLabel={t('reservations.cancel')}
          onConfirm={confirmCancel}
          onCancel={() => setCanceling(null)}
        />
      )}
    </Layout>
  );
}
