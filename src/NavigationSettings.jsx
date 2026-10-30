import { useEffect, useMemo, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { useApi } from '../context/ApiContext'
import { navigation as fallbackNavigation } from '../data/navigation'
import { defaultSocialLinks, resolveSocialLinks } from '../data/socialLinks'

let nextEditorId = 0
const editorId = () => `editor-${Date.now()}-${nextEditorId++}`

function decorate(items) {
  return items.map((item) => ({
    ...item,
    _editorId: item._id || editorId(),
    children: (item.children || []).map((child) => ({
      ...child,
      _editorId: child._id || editorId(),
    })),
  }))
}

function payloadFor(items) {
  return items.map(({ label, link, children }) => ({
    label,
    link,
    children: children.map(({ label: childLabel, link: childLink }) => ({
      label: childLabel,
      link: childLink,
    })),
  }))
}

function animateReorder(elements, update) {
  const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  const previousPositions = new Map()

  if (!reduceMotion) {
    elements.forEach((element, key) => {
      if (element) previousPositions.set(key, element.getBoundingClientRect())
    })
  }

  flushSync(update)
  if (reduceMotion) return

  elements.forEach((element, key) => {
    const previous = previousPositions.get(key)
    if (!element || !previous) return
    const current = element.getBoundingClientRect()
    const deltaX = previous.left - current.left
    const deltaY = previous.top - current.top
    if (Math.abs(deltaX) < 1 && Math.abs(deltaY) < 1) return

    if (typeof element.animate !== 'function') return

    element.animate(
      [
        { transform: `translate(${deltaX}px, ${deltaY}px)`, zIndex: '10' },
        { transform: 'translate(0, 0)', zIndex: '10' },
      ],
      { duration: 360, easing: 'cubic-bezier(.22, 1, .36, 1)' },
    )
  })
}

function Field({ label, value, onChange, placeholder }) {
  return (
    <label className="grid gap-1.5">
      <span className="text-xs font-bold tracking-wide text-slate-500 uppercase dark:text-slate-400">{label}</span>
      <input
        className="h-11 rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-300 focus:border-[#e82634] focus:ring-4 focus:ring-red-100 dark:border-white/[.1] dark:bg-[#0d1520] dark:text-slate-100 dark:placeholder:text-slate-600 dark:focus:border-[#e82634] dark:focus:ring-red-950/50"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required
      />
    </label>
  )
}

export default function NavigationSettings() {
  const { getAdminSettings, saveAdminSettings } = useApi()
  const [items, setItems] = useState(() => decorate(fallbackNavigation))
  const [socialLinks, setSocialLinks] = useState(defaultSocialLinks)
  const [initializing, setInitializing] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState(null)
  const [expandedItems, setExpandedItems] = useState({})
  const itemElements = useRef(new Map())
  const childElements = useRef(new Map())

  useEffect(() => {
    let active = true
    getAdminSettings()
      .then(({ data }) => {
        if (!active) return
        const decoratedItems = decorate(data.topNavigation)
        setItems(decoratedItems)
        setSocialLinks(resolveSocialLinks({ data }))
        setExpandedItems(decoratedItems[0] ? { [decoratedItems[0]._editorId]: true } : {})
      })
      .catch((error) => active && setMessage({ type: 'warning', text: `${error.message}. Local defaults are shown until the API is available.` }))
      .finally(() => active && setInitializing(false))
    return () => { active = false }
  }, [getAdminSettings])

  const childCount = useMemo(
    () => items.reduce((total, item) => total + item.children.length, 0),
    [items],
  )

  const updateItem = (index, field, value) => {
    setItems((current) => current.map((item, itemIndex) => (
      itemIndex === index ? { ...item, [field]: value } : item
    )))
  }

  const updateChild = (itemIndex, childIndex, field, value) => {
    setItems((current) => current.map((item, index) => index === itemIndex ? {
      ...item,
      children: item.children.map((child, indexOfChild) => (
        indexOfChild === childIndex ? { ...child, [field]: value } : child
      )),
    } : item))
  }

  const moveItem = (index, direction) => {
    const target = index + direction
    if (target < 0 || target >= items.length) return
    animateReorder(itemElements.current, () => {
      setItems((current) => {
        const updated = [...current]
        ;[updated[index], updated[target]] = [updated[target], updated[index]]
        return updated
      })
    })
  }

  const moveChild = (itemIndex, childIndex, direction) => {
    const target = childIndex + direction
    if (target < 0 || target >= items[itemIndex].children.length) return
    animateReorder(childElements.current, () => {
      setItems((current) => current.map((item, index) => {
        if (index !== itemIndex) return item
        const children = [...item.children]
        ;[children[childIndex], children[target]] = [children[target], children[childIndex]]
        return { ...item, children }
      }))
    })
  }

  const save = async () => {
    setSaving(true)
    setMessage(null)
    try {
      const { data } = await saveAdminSettings(payloadFor(items), socialLinks)
      const decoratedItems = decorate(data.topNavigation)
      setItems(decoratedItems)
      setSocialLinks(resolveSocialLinks({ data }))
      setExpandedItems(decoratedItems[0] ? { [decoratedItems[0]._editorId]: true } : {})
      setMessage({ type: 'success', text: 'Settings saved. The public header and footer now use these links.' })
    } catch (error) {
      setMessage({ type: 'error', text: error.message })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
        <div>
          <p className="text-sm font-bold text-[#d51f2c]">Settings</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950 dark:text-white">Website links</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500 dark:text-slate-400">Manage the top navigation and the social media destinations used in both the public header and footer.</p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={() => {
              const decoratedItems = decorate(fallbackNavigation)
              setItems(decoratedItems)
              setSocialLinks(defaultSocialLinks)
              setExpandedItems(decoratedItems[0] ? { [decoratedItems[0]._editorId]: true } : {})
            }}
            className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-white/[.1] dark:bg-white/[.06] dark:text-slate-200 dark:hover:bg-white/[.1]"
          >
            Load defaults
          </button>
          <button
            type="button"
            onClick={save}
            disabled={saving || initializing}
            className="h-11 rounded-xl bg-[#e82634] px-5 text-sm font-bold text-white shadow-[0_8px_22px_rgba(232,38,52,.24)] hover:bg-[#cf1f2c] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save settings'}
          </button>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
        <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 dark:border-white/[.09] dark:bg-white/[.045]">{items.length} top-level links</span>
        <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 dark:border-white/[.09] dark:bg-white/[.045]">{childCount} dropdown links</span>
        {initializing && <span className="rounded-full bg-amber-50 px-3 py-1.5 text-amber-700">Loading API settings…</span>}
      </div>

      {message && (
        <div className={`mt-5 rounded-xl border px-4 py-3 text-sm font-semibold ${message.type === 'success'
          ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
          : message.type === 'warning'
            ? 'border-amber-200 bg-amber-50 text-amber-800'
            : 'border-red-200 bg-red-50 text-red-700'}`}
        >
          {message.text}
        </div>
      )}

      <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_30px_rgba(15,23,42,.04)] dark:border-white/[.08] dark:bg-[#111a27] dark:shadow-[0_14px_40px_rgba(0,0,0,.18)]">
        <div className="border-b border-slate-100 bg-slate-50/75 px-4 py-4 dark:border-white/[.07] dark:bg-white/[.025] sm:px-5">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">Social media links</h2>
          <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">These destinations are shared by every social icon in the website header and footer.</p>
        </div>
        <div className="grid gap-4 p-4 sm:grid-cols-2 sm:p-5">
          {[
            ['x', 'X (Twitter)', 'https://x.com/your-page'],
            ['facebook', 'Facebook', 'https://facebook.com/your-page'],
            ['youtube', 'YouTube', 'https://youtube.com/@your-channel'],
            ['linkedin', 'LinkedIn', 'https://linkedin.com/company/your-page'],
          ].map(([platform, label, placeholder]) => (
            <Field
              key={platform}
              label={label}
              value={socialLinks[platform]}
              onChange={(value) => setSocialLinks((current) => ({ ...current, [platform]: value }))}
              placeholder={placeholder}
            />
          ))}
        </div>
      </section>

      <div className="mt-6 grid gap-4">
        {items.map((item, itemIndex) => {
          const expanded = Boolean(expandedItems[item._editorId])
          const panelId = `navigation-panel-${item._editorId}`
          return (
            <article
              key={item._editorId}
              ref={(element) => {
                if (element) itemElements.current.set(item._editorId, element)
                else itemElements.current.delete(item._editorId)
              }}
              className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_30px_rgba(15,23,42,.04)] transition-[border-color,background-color,box-shadow] dark:border-white/[.08] dark:bg-[#111a27] dark:shadow-[0_14px_40px_rgba(0,0,0,.18)]"
            >
              <header className={`flex flex-wrap items-center justify-between gap-2 bg-slate-50/75 px-3 py-2.5 transition-colors sm:gap-3 sm:px-4 dark:bg-white/[.025] ${expanded ? 'border-b border-slate-100 dark:border-white/[.07]' : ''}`}>
                <button
                  type="button"
                  onClick={() => setExpandedItems((current) => current[item._editorId] ? {} : { [item._editorId]: true })}
                  className="flex min-w-0 flex-[1_1_100%] items-center gap-3 rounded-xl px-1 py-1.5 text-left outline-none transition hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-[#e82634] sm:min-w-[210px] sm:flex-[1_1_210px] dark:hover:bg-white/[.05]"
                  aria-expanded={expanded}
                  aria-controls={panelId}
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-slate-900 text-xs font-bold text-white dark:bg-[#080d15]">{itemIndex + 1}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-bold text-slate-900 dark:text-white">{item.label || 'Untitled navigation item'}</span>
                    <span className="mt-0.5 block text-xs text-slate-400 dark:text-slate-500">{item.children.length} dropdown links</span>
                  </span>
                  <span className={`mr-1 grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-slate-200 bg-white text-lg text-slate-500 transition-transform duration-300 dark:border-white/[.09] dark:bg-white/[.04] dark:text-slate-300 ${expanded ? 'rotate-180' : ''}`} aria-hidden="true">⌄</span>
                </button>
                <div className="flex w-full justify-end gap-1.5 sm:w-auto">
                  <button type="button" onClick={() => moveItem(itemIndex, -1)} disabled={itemIndex === 0} className="h-8 rounded-lg border border-slate-200 bg-white px-2.5 text-sm font-bold text-slate-600 disabled:opacity-30 dark:border-white/[.1] dark:bg-white/[.05] dark:text-slate-300" aria-label={`Move ${item.label} up`}>↑</button>
                  <button type="button" onClick={() => moveItem(itemIndex, 1)} disabled={itemIndex === items.length - 1} className="h-8 rounded-lg border border-slate-200 bg-white px-2.5 text-sm font-bold text-slate-600 disabled:opacity-30 dark:border-white/[.1] dark:bg-white/[.05] dark:text-slate-300" aria-label={`Move ${item.label} down`}>↓</button>
                  <button
                    type="button"
                    onClick={() => {
                      setItems((current) => current.filter((_, index) => index !== itemIndex))
                      setExpandedItems((current) => {
                        if (!current[item._editorId]) return current
                        const next = { ...current }
                        delete next[item._editorId]
                        return next
                      })
                    }}
                    className="h-8 rounded-lg border border-red-100 bg-red-50 px-3 text-xs font-bold text-red-600 hover:bg-red-100"
                  >
                    Delete
                  </button>
                </div>
              </header>

              <div
                id={panelId}
                aria-hidden={!expanded}
                className={`grid transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(.22,1,.36,1)] ${expanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
              >
                <div className="overflow-hidden" inert={!expanded}>
                  <div className="p-4 sm:p-5">
                    <div className={`grid gap-4 ${item.children.length === 0 ? 'md:grid-cols-2' : ''}`}>
                      <Field label="Label" value={item.label} onChange={(value) => updateItem(itemIndex, 'label', value)} placeholder="Packaging Services" />
                      {item.children.length === 0 ? (
                        <Field label="Link" value={item.link} onChange={(value) => updateItem(itemIndex, 'link', value)} placeholder="#services or /services" />
                      ) : (
                        <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-3 text-xs leading-5 text-slate-500 dark:border-white/[.1] dark:bg-white/[.025] dark:text-slate-400">
                          This main item is a dropdown trigger. Visitors choose one of its dropdown links instead of opening a parent page.
                        </p>
                      )}
                    </div>

                    <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-3 sm:p-4 dark:border-white/[.08] dark:bg-[#0d1520]">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">Dropdown links</h3>
                          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Optional links displayed below this menu item.</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setItems((current) => current.map((currentItem, index) => index === itemIndex ? {
                            ...currentItem,
                            children: [...currentItem.children, { label: 'New dropdown link', link: '#new-link', _editorId: editorId() }],
                          } : currentItem))}
                          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-sm hover:border-slate-300 dark:border-white/[.1] dark:bg-white/[.06] dark:text-slate-200 dark:hover:bg-white/[.1]"
                        >
                          + Add dropdown link
                        </button>
                      </div>

                      <div className="mt-3 grid gap-2.5">
                        {item.children.length === 0 && (
                          <p className="rounded-lg border border-dashed border-slate-300 bg-white px-4 py-5 text-center text-xs text-slate-400 dark:border-white/[.12] dark:bg-white/[.025] dark:text-slate-500">No dropdown links. This item will behave as a regular link.</p>
                        )}
                        {item.children.map((child, childIndex) => (
                          <div
                            key={child._editorId}
                            ref={(element) => {
                              if (element) childElements.current.set(child._editorId, element)
                              else childElements.current.delete(child._editorId)
                            }}
                            className="relative grid gap-2 rounded-xl border border-slate-200 bg-white p-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] md:items-end dark:border-white/[.08] dark:bg-white/[.025]"
                          >
                            <Field label="Child label" value={child.label} onChange={(value) => updateChild(itemIndex, childIndex, 'label', value)} placeholder="Packaging Development" />
                            <Field label="Child link" value={child.link} onChange={(value) => updateChild(itemIndex, childIndex, 'link', value)} placeholder="#packaging-development" />
                            <div className="flex gap-1.5 md:h-11 md:items-stretch">
                              <button type="button" onClick={() => moveChild(itemIndex, childIndex, -1)} disabled={childIndex === 0} className="grid h-11 min-w-11 place-items-center rounded-xl border border-slate-200 bg-white text-sm font-black text-slate-600 transition hover:-translate-y-0.5 hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-25 disabled:hover:translate-y-0 dark:border-white/[.1] dark:bg-white/[.05] dark:text-slate-300" aria-label={`Move ${child.label} up`}>↑</button>
                              <button type="button" onClick={() => moveChild(itemIndex, childIndex, 1)} disabled={childIndex === item.children.length - 1} className="grid h-11 min-w-11 place-items-center rounded-xl border border-slate-200 bg-white text-sm font-black text-slate-600 transition hover:translate-y-0.5 hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-25 disabled:hover:translate-y-0 dark:border-white/[.1] dark:bg-white/[.05] dark:text-slate-300" aria-label={`Move ${child.label} down`}>↓</button>
                              <button
                                type="button"
                                onClick={() => setItems((current) => current.map((currentItem, index) => index === itemIndex ? {
                                  ...currentItem,
                                  children: currentItem.children.filter((_, indexOfChild) => indexOfChild !== childIndex),
                                } : currentItem))}
                                className="h-11 rounded-xl border border-red-100 bg-red-50 px-3 text-xs font-bold text-red-600 hover:bg-red-100"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          )
        })}
      </div>

      <button
        type="button"
        onClick={() => {
          const id = editorId()
          setItems((current) => [...current, { label: 'New navigation link', link: '#new-link', children: [], _editorId: id }])
          setExpandedItems({ [id]: true })
        }}
        className="mt-5 w-full rounded-2xl border-2 border-dashed border-slate-300 bg-white/60 py-5 text-sm font-bold text-slate-600 transition hover:border-[#e82634] hover:bg-red-50 hover:text-[#d51f2c] dark:border-white/[.12] dark:bg-white/[.035] dark:text-slate-400 dark:hover:border-[#e82634] dark:hover:bg-red-950/20 dark:hover:text-red-300"
      >
        + Add top-level navigation link
      </button>
    </div>
  )
}
