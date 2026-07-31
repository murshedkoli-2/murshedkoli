'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { AdminShell } from '@/components/admin/AdminShell'
import { confirmDialog } from '@/components/ui/ConfirmDialog'
import { useAdminGuard } from '@/lib/admin/useAdminGuard'
import { adminFetch } from '@/lib/admin/adminFetch'

interface SavingsAccount {
  id?: string
  name: string
  bank?: string | null
  accountNo?: string | null
  type?: string | null
  currency: string
  amount: number
  notes?: string | null
  updatedAt?: string
}

function emptyAccount(): SavingsAccount {
  return { name: '', bank: '', accountNo: '', type: '', currency: 'BDT', amount: 0, notes: '' }
}

function formatAmountRaw(amount: number) {
  try {
    return new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(amount)
  } catch {
    return `${amount}`
  }
}

function formatAmount(amount: number, currency: string) {
  return `${formatAmountRaw(amount)} ${currency}`
}

const CARD_GRADIENTS = [
  'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
  'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
  'linear-gradient(135deg, #4b1248 0%, #f0c27b 100%)',
  'linear-gradient(135deg, #11998e 0%, #157954 100%)',
  'linear-gradient(135deg, #c31432 0%, #240b36 100%)',
  'linear-gradient(135deg, #2b5876 0%, #4e4376 100%)',
  'linear-gradient(135deg, #434343 0%, #000000 100%)'
]

function getCardGradient(id = '') {
  if (!id) return CARD_GRADIENTS[0]
  const sum = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return CARD_GRADIENTS[sum % CARD_GRADIENTS.length]
}

export default function SavingsManager() {
  const ready = useAdminGuard()
  const [accounts, setAccounts] = useState<SavingsAccount[]>([])
  const [editing, setEditing] = useState<SavingsAccount | null>(null)
  const [saving, setSaving] = useState(false)
  const [actionState, setActionState] = useState<{ id: string; type: 'add' | 'expense' } | null>(null)
  const [amountDraft, setAmountDraft] = useState('')

  const load = useCallback(async () => {
    try {
      const res = await adminFetch('/api/savings')
      if (res.ok) setAccounts(await res.json())
      else toast.error('Could not load savings accounts.')
    } catch (error) {
      console.error('Savings load failed:', error)
      toast.error('Could not load savings accounts.')
    }
  }, [])

  useEffect(() => {
    if (ready) load()
  }, [ready, load])

  const totals = useMemo(() => {
    const byCurrency = new Map<string, number>()
    for (const a of accounts) {
      byCurrency.set(a.currency, (byCurrency.get(a.currency) ?? 0) + a.amount)
    }
    return Array.from(byCurrency.entries())
  }, [accounts])

  const save = async () => {
    if (!editing || !editing.name.trim()) {
      toast.error('Account name is required.')
      return
    }
    setSaving(true)
    try {
      const url = editing.id ? `/api/savings/${editing.id}` : '/api/savings'
      const method = editing.id ? 'PUT' : 'POST'
      const res = await adminFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...editing, amount: Number(editing.amount) || 0 }),
      })
      if (res.ok) {
        setEditing(null)
        await load()
        toast.success('Account saved.')
      } else {
        toast.error('Could not save account.')
      }
    } catch (error) {
      console.error('Savings save failed:', error)
      toast.error('Could not save account.')
    } finally {
      setSaving(false)
    }
  }

  const startAction = (a: SavingsAccount, type: 'add' | 'expense') => {
    setActionState(a.id ? { id: a.id, type } : null)
    setAmountDraft('')
  }

  const saveAmount = async (a: SavingsAccount) => {
    const inputNum = Number(amountDraft)
    if (Number.isNaN(inputNum)) {
      toast.error('Enter a valid amount.')
      return
    }

    const isExpense = actionState?.type === 'expense'
    const finalAmount = isExpense ? a.amount - inputNum : a.amount + inputNum

    try {
      const res = await adminFetch(`/api/savings/${a.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: finalAmount }),
      })
      if (res.ok) {
        setAccounts((prev) => prev.map((x) => (x.id === a.id ? { ...x, amount: finalAmount } : x)))
        setActionState(null)
        toast.success(isExpense ? 'Expense deducted.' : 'Money added.')
      } else {
        toast.error('Could not update amount.')
      }
    } catch (error) {
      console.error('Amount update failed:', error)
      toast.error('Could not update amount.')
    }
  }

  const remove = async (a: SavingsAccount) => {
    const ok = await confirmDialog({
      title: 'Delete this account?',
      description: <><strong>{a.name}</strong> and its recorded balance history will be permanently deleted.</>,
      confirmLabel: 'Delete account',
      tone: 'danger',
    })
    if (!ok) return
    try {
      const res = await adminFetch(`/api/savings/${a.id}`, { method: 'DELETE' })
      if (res.ok) {
        setAccounts((prev) => prev.filter((x) => x.id !== a.id))
        toast.success('Account deleted.')
      } else {
        toast.error('Could not delete account.')
      }
    } catch (error) {
      console.error('Delete failed:', error)
      toast.error('Could not delete account.')
    }
  }

  if (!ready) return null

  return (
    <>
      <style>{`
        .savings-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 24px;
          padding: 16px 0;
        }
        .savings-card {
          position: relative;
          border-radius: 20px;
          color: white;
          padding: 24px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.15);
          transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s ease;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          min-height: 220px;
        }
        .savings-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 15px 35px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.25);
        }
        .savings-card::after {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%);
          pointer-events: none;
        }
        .card-chip {
          width: 40px;
          height: 28px;
          background: linear-gradient(135deg, #e6c27a, #d4af37, #996515);
          border-radius: 4px;
          margin-bottom: 20px;
          position: relative;
          opacity: 0.9;
        }
        .card-chip::after {
          content: '';
          position: absolute;
          top: 25%; bottom: 25%; left: 30%; right: 30%;
          border: 1px solid rgba(0,0,0,0.2);
          border-radius: 2px;
        }
        .card-header-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }
        .card-bank {
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          opacity: 0.8;
          font-weight: 700;
        }
        .card-type {
          font-size: 11px;
          background: rgba(255, 255, 255, 0.2);
          padding: 4px 10px;
          border-radius: 20px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          backdrop-filter: blur(4px);
        }
        .card-name {
          font-size: 20px;
          font-weight: 600;
          margin-bottom: 2px;
          text-shadow: 0 1px 3px rgba(0,0,0,0.4);
        }
        .card-no {
          font-size: 14px;
          opacity: 0.7;
          font-family: 'Courier New', monospace;
          letter-spacing: 2px;
          margin-bottom: 16px;
        }
        .card-balance-box {
          margin-top: auto;
          margin-bottom: 16px;
        }
        .card-balance {
          font-size: 32px;
          font-weight: 700;
          letter-spacing: -0.5px;
          text-shadow: 0 2px 4px rgba(0,0,0,0.3);
          display: flex;
          align-items: baseline;
          gap: 6px;
        }
        .card-currency {
          font-size: 18px;
          font-weight: 500;
          opacity: 0.8;
        }
        .card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 10px;
        }
        .card-actions {
          display: flex;
          gap: 10px;
          opacity: 0;
          transform: translateY(10px);
          transition: opacity 0.3s ease, transform 0.3s ease;
        }
        .savings-card:hover .card-actions, .card-actions.visible {
          opacity: 1;
          transform: translateY(0);
        }
        .c-btn {
          background: rgba(255, 255, 255, 0.15);
          border: none;
          color: white;
          padding: 8px 14px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          backdrop-filter: blur(4px);
        }
        .c-btn:hover {
          background: rgba(255, 255, 255, 0.25);
          transform: scale(1.05);
        }
        .c-btn-icon {
          padding: 8px;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
        }
        .add-money-view {
          background: rgba(0, 0, 0, 0.4);
          border-radius: 12px;
          padding: 16px;
          margin-top: 10px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          backdrop-filter: blur(8px);
        }
        .add-money-view input {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: white;
          border-radius: 8px;
          padding: 10px 12px;
          font-size: 16px;
          width: 100%;
          outline: none;
          transition: border-color 0.2s;
        }
        .add-money-view input:focus {
          border-color: rgba(255, 255, 255, 0.8);
        }
        .add-money-view input::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }
        .add-money-actions {
          display: flex;
          gap: 8px;
        }
        .add-money-actions .c-btn {
          flex: 1;
        }
        .add-money-actions .c-btn.primary {
          background: #10b981;
          color: #fff;
        }
        .add-money-actions .c-btn.primary:hover {
          background: #059669;
        }
        .add-money-actions .c-btn.danger {
          background: #ef4444;
          color: #fff;
        }
        .add-money-actions .c-btn.danger:hover {
          background: #dc2626;
        }
      `}</style>
    <AdminShell
      active="savings"
      title="Savings"
      subtitle={
        totals.length > 0
          ? `Total: ${totals.map(([cur, sum]) => formatAmount(sum, cur)).join(' · ')}`
          : `${accounts.length} accounts`
      }
      actions={
        <button className="adm-btn amber" onClick={() => setEditing(emptyAccount())}>
          + New account
        </button>
      }
    >
      <div className="adm-panel">
        {editing && (
          <div className="adm-editor">
            <h3>{editing.id ? 'Edit account' : 'New account'}</h3>
            <div className="adm-form-grid">
              <div className="adm-field">
                <label className="adm-label">Account name</label>
                <input
                  className="adm-input"
                  value={editing.name}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  placeholder="e.g. Emergency fund"
                />
              </div>
              <div className="adm-field">
                <label className="adm-label">Bank / institution</label>
                <input
                  className="adm-input"
                  value={editing.bank ?? ''}
                  onChange={(e) => setEditing({ ...editing, bank: e.target.value })}
                  placeholder="e.g. DBBL"
                />
              </div>
              <div className="adm-field">
                <label className="adm-label">Account number</label>
                <input
                  className="adm-input"
                  value={editing.accountNo ?? ''}
                  onChange={(e) => setEditing({ ...editing, accountNo: e.target.value })}
                  placeholder="e.g. 123.456.789"
                />
              </div>
              <div className="adm-field">
                <label className="adm-label">Type</label>
                <input
                  className="adm-input"
                  value={editing.type ?? ''}
                  onChange={(e) => setEditing({ ...editing, type: e.target.value })}
                  placeholder="e.g. DPS, Savings, FDR"
                />
              </div>
              <div className="adm-field">
                <label className="adm-label">Amount</label>
                <input
                  className="adm-input"
                  type="number"
                  min={0}
                  step="0.01"
                  value={editing.amount}
                  onChange={(e) => setEditing({ ...editing, amount: Number(e.target.value) || 0 })}
                />
              </div>
              <div className="adm-field">
                <label className="adm-label">Currency</label>
                <select
                  className="adm-input"
                  value={editing.currency}
                  onChange={(e) => setEditing({ ...editing, currency: e.target.value })}
                >
                  <option value="BDT">BDT</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                </select>
              </div>
              <div className="adm-field adm-col-2">
                <label className="adm-label">Notes</label>
                <textarea
                  className="adm-textarea"
                  value={editing.notes ?? ''}
                  onChange={(e) => setEditing({ ...editing, notes: e.target.value })}
                  placeholder="Goal, maturity date, interest rate…"
                />
              </div>
            </div>
            <div className="adm-editor-actions">
              <button className="adm-btn amber" onClick={save} disabled={saving}>
                {saving ? 'Saving…' : 'Save account'}
              </button>
              <button className="adm-btn" onClick={() => setEditing(null)}>
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="adm-panel-head">
          <h2>Accounts ({accounts.length})</h2>
        </div>
        <div className="savings-grid">
          {accounts.length === 0 ? (
            <div className="adm-empty" style={{ gridColumn: '1 / -1' }}>No savings accounts yet. Add your first one.</div>
          ) : (
            accounts.map((a) => (
              <div className="savings-card" key={a.id} style={{ background: getCardGradient(a.id) }}>
                <div className="card-header-top">
                  <div className="card-chip" />
                  {a.type && <span className="card-type">{a.type}</span>}
                </div>
                
                <div className="card-bank">{a.bank || 'Vault'}</div>
                <div className="card-name">{a.name}</div>
                <div className="card-no">{a.accountNo ? `**** **** **** ${a.accountNo.slice(-4) || a.accountNo}` : '**** **** **** ****'}</div>
                
                {actionState?.id === a.id ? (
                  <div className="add-money-view">
                    <input
                      type="number"
                      step="0.01"
                      placeholder={actionState?.type === 'expense' ? "Enter expense amount..." : "Enter amount to add..."}
                      value={amountDraft}
                      onChange={(e) => setAmountDraft(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveAmount(a)
                        if (e.key === 'Escape') setActionState(null)
                      }}
                      autoFocus
                    />
                    <div className="add-money-actions">
                      <button className={`c-btn ${actionState?.type === 'expense' ? 'danger' : 'primary'}`} onClick={() => saveAmount(a)}>Confirm</button>
                      <button className="c-btn" onClick={() => setActionState(null)}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div className="card-balance-box">
                    <div className="card-balance">
                      {formatAmountRaw(a.amount)}
                      <span className="card-currency">{a.currency}</span>
                    </div>
                  </div>
                )}

                  <div className="card-footer">
                    <div className={`card-actions ${actionState?.id === a.id ? 'visible' : ''}`}>
                      <button className="c-btn" onClick={() => startAction(a, 'add')} title="Add money">
                        + Add
                      </button>
                      <button className="c-btn" onClick={() => startAction(a, 'expense')} title="Add expense">
                        - Expense
                      </button>
                      <button className="c-btn c-btn-icon" onClick={() => setEditing(a)} title="Edit details">
                        ✎
                      </button>
                    </div>
                  </div>
                </div>
            ))
          )}
        </div>
      </div>
    </AdminShell>
    </>
  )
}
