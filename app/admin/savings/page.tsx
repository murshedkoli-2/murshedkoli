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

/** Formats complete account details as clean plain text for messaging */
function formatCopyDetails(a: SavingsAccount): string {
  const lines = [
    `🏦 Bank / Method: ${a.bank || 'Bank Transfer'}`,
    `👤 Account Name: ${a.name}`,
    `🔢 Account Number: ${a.accountNo || 'N/A'}`,
    a.type ? `📁 Account Type: ${a.type}` : null,
    a.currency ? `💱 Currency: ${a.currency}` : null,
    a.notes ? `📍 Branch / Routing / Notes: ${a.notes}` : null,
  ].filter(Boolean)

  return lines.join('\n')
}

/**
 * Draws a high-resolution (1200 x 740 px) luxury payment card onto an HTML5 Canvas.
 * Ready for high-DPI rendering and direct PNG image download.
 */
function generateCardCanvas(a: SavingsAccount): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  canvas.width = 1200
  canvas.height = 740
  const ctx = canvas.getContext('2d')
  if (!ctx) return canvas

  // Rounded card rectangle
  ctx.save()
  ctx.beginPath()
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(0, 0, 1200, 740, 40)
  } else {
    const r = 40, w = 1200, h = 740
    ctx.moveTo(r, 0)
    ctx.lineTo(w - r, 0)
    ctx.quadraticCurveTo(w, 0, w, r)
    ctx.lineTo(w, h - r)
    ctx.quadraticCurveTo(w, h, w - r, h)
    ctx.lineTo(r, h)
    ctx.quadraticCurveTo(0, h, 0, h - r)
    ctx.lineTo(0, r)
    ctx.quadraticCurveTo(0, 0, r, 0)
  }
  ctx.closePath()
  ctx.clip()

  // Base luxury dark gradient
  const bgGrad = ctx.createLinearGradient(0, 0, 1200, 740)
  bgGrad.addColorStop(0, '#0a192f')
  bgGrad.addColorStop(0.45, '#132742')
  bgGrad.addColorStop(1, '#030c1b')
  ctx.fillStyle = bgGrad
  ctx.fillRect(0, 0, 1200, 740)

  // Radial glow accents
  const glow1 = ctx.createRadialGradient(1080, 100, 10, 1080, 100, 520)
  glow1.addColorStop(0, 'rgba(56, 189, 248, 0.22)')
  glow1.addColorStop(1, 'rgba(56, 189, 248, 0)')
  ctx.fillStyle = glow1
  ctx.fillRect(0, 0, 1200, 740)

  const glow2 = ctx.createRadialGradient(120, 660, 10, 120, 660, 460)
  glow2.addColorStop(0, 'rgba(16, 185, 129, 0.18)')
  glow2.addColorStop(1, 'rgba(16, 185, 129, 0)')
  ctx.fillStyle = glow2
  ctx.fillRect(0, 0, 1200, 740)

  // Decorative concentric security lines
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)'
  ctx.lineWidth = 1.5
  for (let r = 240; r <= 840; r += 60) {
    ctx.beginPath()
    ctx.arc(1120, 90, r, 0, Math.PI * 2)
    ctx.stroke()
  }

  // Border stroke
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)'
  ctx.lineWidth = 2
  ctx.stroke()

  // 1. EMV Chip
  const chipX = 80, chipY = 75, chipW = 105, chipH = 78
  const chipGrad = ctx.createLinearGradient(chipX, chipY, chipX + chipW, chipY + chipH)
  chipGrad.addColorStop(0, '#fcd34d')
  chipGrad.addColorStop(0.5, '#d97706')
  chipGrad.addColorStop(1, '#b45309')
  ctx.fillStyle = chipGrad
  ctx.beginPath()
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(chipX, chipY, chipW, chipH, 12)
  } else {
    ctx.rect(chipX, chipY, chipW, chipH)
  }
  ctx.fill()
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.35)'
  ctx.lineWidth = 2
  ctx.stroke()

  // Inner chip micro-circuit lines
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.28)'
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(chipX + 32, chipY)
  ctx.lineTo(chipX + 32, chipY + chipH)
  ctx.moveTo(chipX + 73, chipY)
  ctx.lineTo(chipX + 73, chipY + chipH)
  ctx.moveTo(chipX, chipY + chipH / 2)
  ctx.lineTo(chipX + chipW, chipY + chipH / 2)
  ctx.stroke()

  // Wireless Contactless NFC Icon
  const nfcX = chipX + chipW + 32, nfcY = chipY + chipH / 2
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)'
  ctx.lineWidth = 3
  for (let i = 1; i <= 3; i++) {
    ctx.beginPath()
    ctx.arc(nfcX, nfcY, i * 11, -Math.PI / 3, Math.PI / 3)
    ctx.stroke()
  }

  // 2. Bank / Institution Title (Top Right)
  const bankTitle = (a.bank || 'BANK TRANSFER').toUpperCase()
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 36px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  ctx.textAlign = 'right'
  ctx.fillText(bankTitle, 1120, 110)

  // Type & Currency Tag
  const typeTag = [a.type, a.currency].filter(Boolean).join(' · ').toUpperCase() || 'OFFICIAL BENEFICIARY'
  ctx.fillStyle = '#38bdf8'
  ctx.font = '600 18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  ctx.fillText(typeTag, 1120, 145)

  // 3. Account Number Section
  ctx.textAlign = 'left'
  ctx.fillStyle = '#94a3b8'
  ctx.font = '600 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  ctx.fillText('ACCOUNT NUMBER', 80, 260)

  // Account Number (large, spaced, monospaced)
  const rawNo = a.accountNo?.trim() || 'NOT CONFIGURED'
  const formattedNo = rawNo.length > 8 && !rawNo.includes(' ')
    ? rawNo.replace(/(.{4})/g, '$1  ').trim()
    : rawNo

  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 44px "Courier New", Consolas, monospace'
  ctx.shadowColor = 'rgba(0, 0, 0, 0.6)'
  ctx.shadowBlur = 8
  ctx.shadowOffsetX = 0
  ctx.shadowOffsetY = 2
  ctx.fillText(formattedNo, 80, 320)
  ctx.shadowColor = 'transparent'
  ctx.shadowBlur = 0

  // 4. Beneficiary / Holder Name
  ctx.fillStyle = '#94a3b8'
  ctx.font = '600 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  ctx.fillText('ACCOUNT BENEFICIARY / HOLDER', 80, 410)

  ctx.fillStyle = '#f8fafc'
  ctx.font = 'bold 34px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  ctx.fillText((a.name || 'ACCOUNT HOLDER').toUpperCase(), 80, 460)

  // 5. Branch / Routing / Notes (if available)
  if (a.notes?.trim()) {
    ctx.fillStyle = '#94a3b8'
    ctx.font = '600 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    ctx.fillText('BRANCH / ROUTING / DETAILS', 80, 540)

    ctx.fillStyle = '#e2e8f0'
    ctx.font = '500 22px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    const notesText = a.notes.length > 75 ? a.notes.slice(0, 72) + '…' : a.notes
    ctx.fillText(notesText, 80, 580)
  }

  // 6. Footer Divider & Verification Seal
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(80, 640)
  ctx.lineTo(1120, 640)
  ctx.stroke()

  ctx.fillStyle = '#64748b'
  ctx.font = '500 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('🔒 OFFICIAL BENEFICIARY PAYMENT DETAILS · VERIFIED RECIPIENT', 80, 685)

  ctx.textAlign = 'right'
  ctx.fillStyle = '#10b981'
  ctx.font = 'bold 18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  ctx.fillText('✓ DIRECT WIRE / TRANSFER READY', 1120, 685)

  ctx.restore()
  return canvas
}

export default function SavingsManager() {
  const ready = useAdminGuard()
  const [accounts, setAccounts] = useState<SavingsAccount[]>([])
  const [editing, setEditing] = useState<SavingsAccount | null>(null)
  const [saving, setSaving] = useState(false)
  const [actionState, setActionState] = useState<{ id: string; type: 'add' | 'expense' } | null>(null)
  const [amountDraft, setAmountDraft] = useState('')

  // State for the Image Card preview & download modal
  const [sharingAccount, setSharingAccount] = useState<SavingsAccount | null>(null)
  const [sharingDataUrl, setSharingDataUrl] = useState<string | null>(null)

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

  const copyAllDetails = async (a: SavingsAccount) => {
    const text = formatCopyDetails(a)
    try {
      await navigator.clipboard.writeText(text)
      toast.success('All account details copied to clipboard!')
    } catch {
      toast.error('Failed to copy to clipboard.')
    }
  }

  const copyAccountNumber = async (num: string) => {
    try {
      await navigator.clipboard.writeText(num)
      toast.success('Account number copied!')
    } catch {
      toast.error('Failed to copy account number.')
    }
  }

  const downloadCardImage = (a: SavingsAccount) => {
    try {
      const canvas = generateCardCanvas(a)
      const dataUrl = canvas.toDataURL('image/png')
      const link = document.createElement('a')
      const cleanBank = (a.bank || 'Bank').replace(/[^a-zA-Z0-9_-]/g, '_')
      const cleanName = (a.name || 'Account').replace(/[^a-zA-Z0-9_-]/g, '_')
      link.download = `${cleanBank}_${cleanName}_Payment_Card.png`
      link.href = dataUrl
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      toast.success('Payment card image downloaded!')
    } catch (err) {
      console.error('Download card error:', err)
      toast.error('Could not generate card image.')
    }
  }

  const openShareModal = (a: SavingsAccount) => {
    setSharingAccount(a)
    try {
      const canvas = generateCardCanvas(a)
      setSharingDataUrl(canvas.toDataURL('image/png'))
    } catch {
      setSharingDataUrl(null)
    }
  }

  if (!ready) return null

  return (
    <>
      <style>{`
        .savings-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
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
          min-height: 250px;
        }
        .savings-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 36px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.25);
        }
        .savings-card::after {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 100%);
          pointer-events: none;
        }
        .card-chip {
          width: 40px;
          height: 28px;
          background: linear-gradient(135deg, #e6c27a, #d4af37, #996515);
          border-radius: 4px;
          position: relative;
          opacity: 0.95;
        }
        .card-chip::after {
          content: '';
          position: absolute;
          top: 25%; bottom: 25%; left: 30%; right: 30%;
          border: 1px solid rgba(0,0,0,0.25);
          border-radius: 2px;
        }
        .card-header-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 14px;
        }
        .card-bank {
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          opacity: 0.85;
          font-weight: 700;
        }
        .card-type-tag {
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
          font-size: 21px;
          font-weight: 700;
          margin-bottom: 4px;
          text-shadow: 0 1px 3px rgba(0,0,0,0.4);
          letter-spacing: -0.3px;
        }
        .card-no-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 10px;
          flex-wrap: wrap;
        }
        .card-no-val {
          font-size: 15px;
          font-weight: 700;
          font-family: 'Courier New', monospace;
          letter-spacing: 2px;
          color: #ffffff;
          text-shadow: 0 1px 3px rgba(0,0,0,0.5);
        }
        .c-mini-btn {
          background: rgba(255, 255, 255, 0.18);
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: #ffffff;
          border-radius: 6px;
          padding: 2px 7px;
          font-size: 11px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          backdrop-filter: blur(4px);
        }
        .c-mini-btn:hover {
          background: rgba(255, 255, 255, 0.35);
          transform: scale(1.04);
        }
        .card-notes {
          font-size: 11.5px;
          opacity: 0.85;
          margin-bottom: 12px;
          line-height: 1.35;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .card-balance-box {
          margin-top: auto;
          margin-bottom: 16px;
        }
        .card-balance {
          font-size: 30px;
          font-weight: 700;
          letter-spacing: -0.5px;
          text-shadow: 0 2px 4px rgba(0,0,0,0.3);
          display: flex;
          align-items: baseline;
          gap: 6px;
        }
        .card-currency {
          font-size: 17px;
          font-weight: 500;
          opacity: 0.85;
        }
        .card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 8px;
          margin-top: 10px;
          flex-wrap: wrap;
        }
        .card-actions-always {
          display: flex;
          gap: 6px;
          align-items: center;
          flex-wrap: wrap;
        }
        .card-actions-ops {
          display: flex;
          gap: 6px;
          align-items: center;
          margin-left: auto;
        }
        .c-btn {
          background: rgba(255, 255, 255, 0.16);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
          padding: 7px 11px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          backdrop-filter: blur(4px);
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }
        .c-btn:hover {
          background: rgba(255, 255, 255, 0.28);
          transform: translateY(-1px);
        }
        .c-btn.highlight {
          background: rgba(255, 255, 255, 0.22);
          border-color: rgba(255, 255, 255, 0.38);
        }
        .c-btn.highlight:hover {
          background: rgba(255, 255, 255, 0.38);
        }
        .c-btn-icon {
          padding: 7px;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
        }
        .c-btn.danger:hover {
          background: rgba(239, 68, 68, 0.45);
        }
        .add-money-view {
          background: rgba(0, 0, 0, 0.45);
          border-radius: 12px;
          padding: 14px;
          margin: 10px 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
          backdrop-filter: blur(8px);
        }
        .add-money-view input {
          background: rgba(255, 255, 255, 0.12);
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: white;
          border-radius: 8px;
          padding: 8px 12px;
          font-size: 15px;
          width: 100%;
          outline: none;
          transition: border-color 0.2s;
        }
        .add-money-view input:focus {
          border-color: rgba(255, 255, 255, 0.85);
        }
        .add-money-view input::placeholder {
          color: rgba(255, 255, 255, 0.55);
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
                  <label className="adm-label">Account Holder / Name *</label>
                  <input
                    className="adm-input"
                    value={editing.name}
                    onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                    placeholder="e.g. Morshed Al Main / Emergency Fund"
                  />
                </div>
                <div className="adm-field">
                  <label className="adm-label">Bank / Institution / Provider</label>
                  <input
                    className="adm-input"
                    value={editing.bank ?? ''}
                    onChange={(e) => setEditing({ ...editing, bank: e.target.value })}
                    placeholder="e.g. City Bank, BRAC Bank, bKash, DBBL"
                  />
                </div>
                <div className="adm-field">
                  <label className="adm-label">Account Number / Mobile Number</label>
                  <input
                    className="adm-input"
                    value={editing.accountNo ?? ''}
                    onChange={(e) => setEditing({ ...editing, accountNo: e.target.value })}
                    placeholder="e.g. 1234 5678 9012 3456"
                  />
                </div>
                <div className="adm-field">
                  <label className="adm-label">Account Type</label>
                  <input
                    className="adm-input"
                    value={editing.type ?? ''}
                    onChange={(e) => setEditing({ ...editing, type: e.target.value })}
                    placeholder="e.g. Savings, DPS, Mobile Banking, Current"
                  />
                </div>
                <div className="adm-field">
                  <label className="adm-label">Current Balance Amount</label>
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
                    <option value="BDT">BDT (৳)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                </div>
                <div className="adm-field adm-col-2">
                  <label className="adm-label">Branch / Routing Number / SWIFT / Notes</label>
                  <textarea
                    className="adm-textarea"
                    value={editing.notes ?? ''}
                    onChange={(e) => setEditing({ ...editing, notes: e.target.value })}
                    placeholder="e.g. Dhanmondi Branch, Routing No: 225270884, SWIFT: CIBLBDDH"
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
              <div className="adm-empty" style={{ gridColumn: '1 / -1' }}>
                No savings accounts yet. Click &quot;+ New account&quot; to add your first bank or mobile account.
              </div>
            ) : (
              accounts.map((a) => (
                <div className="savings-card" key={a.id} style={{ background: getCardGradient(a.id) }}>
                  <div className="card-header-top">
                    <div className="card-chip" />
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      {a.type && <span className="card-type-tag">{a.type}</span>}
                      <span className="card-type-tag" style={{ background: 'rgba(255,255,255,0.15)' }}>{a.currency}</span>
                    </div>
                  </div>
                  
                  <div className="card-bank">{a.bank || 'Vault'}</div>
                  <div className="card-name">{a.name}</div>
                  
                  {/* Account Number with Quick Copy */}
                  <div className="card-no-row">
                    <span className="card-no-val">{a.accountNo || 'No Number Added'}</span>
                    {a.accountNo && (
                      <button
                        className="c-mini-btn"
                        onClick={(e) => {
                          e.stopPropagation()
                          copyAccountNumber(a.accountNo!)
                        }}
                        title="Copy Account Number"
                      >
                        📋 Copy
                      </button>
                    )}
                  </div>

                  {a.notes ? (
                    <div className="card-notes" title={a.notes}>
                      📍 {a.notes}
                    </div>
                  ) : null}
                  
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
                    {/* Primary Sharing & Copy Actions */}
                    <div className="card-actions-always">
                      <button
                        className="c-btn highlight"
                        onClick={() => copyAllDetails(a)}
                        title="Copy all details to clipboard to send people"
                      >
                        📋 Copy Details
                      </button>
                      <button
                        className="c-btn highlight"
                        onClick={() => openShareModal(a)}
                        title="View payment card preview & download image"
                      >
                        🖼️ Card
                      </button>
                      <button
                        className="c-btn c-btn-icon"
                        onClick={() => downloadCardImage(a)}
                        title="Download card image directly"
                      >
                        ⬇️
                      </button>
                    </div>

                    {/* Operational Actions */}
                    <div className="card-actions-ops">
                      <button className="c-btn" onClick={() => startAction(a, 'add')} title="Add money">
                        +
                      </button>
                      <button className="c-btn" onClick={() => startAction(a, 'expense')} title="Add expense">
                        -
                      </button>
                      <button className="c-btn c-btn-icon" onClick={() => setEditing(a)} title="Edit details">
                        ✎
                      </button>
                      <button
                        className="c-btn c-btn-icon"
                        disabled
                        style={{ opacity: 0.35, cursor: 'not-allowed' }}
                        title="Delete is disabled"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* PAYMENT CARD PREVIEW & DOWNLOAD MODAL */}
        {sharingAccount && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.72)',
              backdropFilter: 'blur(8px)',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 16,
            }}
            onClick={() => setSharingAccount(null)}
          >
            <div
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 18,
                maxWidth: 680,
                width: '100%',
                maxHeight: '92vh',
                overflowY: 'auto',
                padding: 24,
                display: 'flex',
                flexDirection: 'column',
                gap: 18,
                boxShadow: '0 30px 70px rgba(0,0,0,0.35)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span>💳</span> Payment Card & Beneficiary Details
                  </h3>
                  <p style={{ margin: '4px 0 0', fontSize: 12.5, color: 'var(--ink-muted)' }}>
                    High-resolution card image and formatted details ready to send to clients or people for money transfer.
                  </p>
                </div>
                <button
                  className="adm-icon-btn"
                  onClick={() => setSharingAccount(null)}
                  title="Close Modal"
                  style={{ fontSize: 16, padding: '4px 8px' }}
                >
                  ✕
                </button>
              </div>

              {/* Generated High-Resolution Card Preview */}
              {sharingDataUrl && (
                <div
                  style={{
                    position: 'relative',
                    borderRadius: 14,
                    overflow: 'hidden',
                    boxShadow: '0 12px 32px rgba(0, 0, 0, 0.25)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    background: '#0a192f',
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={sharingDataUrl}
                    alt="Payment Card Preview"
                    style={{ width: '100%', height: 'auto', display: 'block' }}
                  />
                </div>
              )}

              {/* Account Details Breakdown Box */}
              <div
                style={{
                  background: 'var(--surface-2)',
                  border: '1px solid var(--border)',
                  borderRadius: 12,
                  padding: 16,
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: 12,
                  fontSize: 13,
                }}
              >
                <div>
                  <span style={{ fontSize: 11, textTransform: 'uppercase', color: 'var(--muted)', fontWeight: 600 }}>
                    👤 Account Name
                  </span>
                  <div style={{ fontWeight: 700, fontSize: 14, marginTop: 2 }}>
                    {sharingAccount.name}
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: 11, textTransform: 'uppercase', color: 'var(--muted)', fontWeight: 600 }}>
                    🏦 Bank / Provider
                  </span>
                  <div style={{ fontWeight: 700, fontSize: 14, marginTop: 2 }}>
                    {sharingAccount.bank || 'Bank Transfer'}
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: 11, textTransform: 'uppercase', color: 'var(--muted)', fontWeight: 600 }}>
                    🔢 Account Number
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                    <span style={{ fontWeight: 700, fontSize: 14, fontFamily: 'monospace' }}>
                      {sharingAccount.accountNo || 'N/A'}
                    </span>
                    {sharingAccount.accountNo && (
                      <button
                        className="adm-btn"
                        style={{ padding: '2px 6px', fontSize: 11 }}
                        onClick={() => copyAccountNumber(sharingAccount.accountNo!)}
                        title="Copy Account Number"
                      >
                        Copy
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: 11, textTransform: 'uppercase', color: 'var(--muted)', fontWeight: 600 }}>
                    📁 Type & Currency
                  </span>
                  <div style={{ fontWeight: 600, fontSize: 13, marginTop: 2 }}>
                    {[sharingAccount.type || 'Savings', sharingAccount.currency].join(' · ')}
                  </div>
                </div>

                {sharingAccount.notes && (
                  <div style={{ gridColumn: '1 / -1' }}>
                    <span style={{ fontSize: 11, textTransform: 'uppercase', color: 'var(--muted)', fontWeight: 600 }}>
                      📍 Branch / Routing / Notes
                    </span>
                    <div style={{ fontWeight: 500, fontSize: 13, marginTop: 2 }}>
                      {sharingAccount.notes}
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Actions */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 10,
                  borderTop: '1px solid var(--border)',
                  paddingTop: 14,
                }}
              >
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <button
                    className="adm-btn amber"
                    onClick={() => downloadCardImage(sharingAccount)}
                    style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600 }}
                  >
                    <span>⬇️</span> Download PNG Image
                  </button>
                  <button
                    className="adm-btn"
                    onClick={() => copyAllDetails(sharingAccount)}
                    style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                  >
                    <span>📋</span> Copy Formatted Text
                  </button>
                </div>

                <button className="adm-btn" onClick={() => setSharingAccount(null)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </AdminShell>
    </>
  )
}
