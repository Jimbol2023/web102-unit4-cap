import { useMemo, useState } from 'react'
import './App.css'

const API_ENDPOINT = 'https://api.apiflash.com/v1/urltoimage'

const defaultForm = {
  url: 'https://codepath.org',
  width: 1280,
  height: 720,
  format: 'jpeg',
  noAds: true,
  noCookieBanners: true,
}

function App() {
  const [form, setForm] = useState(defaultForm)
  const [screenshots, setScreenshots] = useState([])
  const [latestScreenshot, setLatestScreenshot] = useState(null)
  const [status, setStatus] = useState('Ready to generate your first screenshot.')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const apiKey = import.meta.env.VITE_APIFLASH_ACCESS_KEY

  const queryPreview = useMemo(() => {
    const params = buildApiParams(form, 'hidden')

    return `${API_ENDPOINT}?${params.toString()}`
  }, [form])

  function updateField(field, value) {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    if (!apiKey) {
      setError('Missing ApiFlash access key. Add VITE_APIFLASH_ACCESS_KEY to your local .env file.')
      return
    }

    if (!form.url.trim()) {
      setError('Please enter a URL to capture.')
      return
    }

    setIsLoading(true)
    setStatus('Calling ApiFlash...')

    try {
      const params = buildApiParams(form, apiKey)
      const response = await fetch(`${API_ENDPOINT}?${params.toString()}`)

      if (!response.ok) {
        throw new Error('ApiFlash could not generate that screenshot. Check the URL and try again.')
      }

      const screenshotBlob = await response.blob()
      const imageUrl = URL.createObjectURL(screenshotBlob)
      const screenshot = {
        id: crypto.randomUUID(),
        imageUrl,
        capturedUrl: form.url,
        size: `${form.width} x ${form.height}`,
        format: form.format,
        createdAt: new Date().toLocaleString(),
      }

      setLatestScreenshot(screenshot)
      setScreenshots((currentScreenshots) => [screenshot, ...currentScreenshots])
      setStatus('Screenshot generated successfully!')
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Something went wrong.')
      setStatus('Generation failed.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="app-shell">
      <section className="hero-panel">
        <p className="eyebrow">ApiFlash Screenshot Lab</p>
        <h1>Build Your Own Screenshot! 📸</h1>
        <p className="intro">
          Choose a web page, set the image size, and generate screenshots with editable ApiFlash query parameters.
        </p>
      </section>

      <section className="builder-grid" aria-label="Screenshot builder">
        <form className="control-panel" onSubmit={handleSubmit}>
          <label>
            URL
            <input
              type="url"
              value={form.url}
              onChange={(event) => updateField('url', event.target.value)}
              placeholder="https://example.com"
              required
            />
          </label>

          <div className="field-row">
            <label>
              Width
              <input
                type="number"
                min="320"
                max="1920"
                value={form.width}
                onChange={(event) => updateField('width', Number(event.target.value))}
                required
              />
            </label>
            <label>
              Height
              <input
                type="number"
                min="240"
                max="1600"
                value={form.height}
                onChange={(event) => updateField('height', Number(event.target.value))}
                required
              />
            </label>
          </div>

          <label>
            Format
            <select value={form.format} onChange={(event) => updateField('format', event.target.value)}>
              <option value="jpeg">JPEG</option>
              <option value="png">PNG</option>
              <option value="webp">WEBP</option>
            </select>
          </label>

          <div className="toggle-list">
            <label className="toggle-field">
              <input
                type="checkbox"
                checked={form.noAds}
                onChange={(event) => updateField('noAds', event.target.checked)}
              />
              No ads
            </label>
            <label className="toggle-field">
              <input
                type="checkbox"
                checked={form.noCookieBanners}
                onChange={(event) => updateField('noCookieBanners', event.target.checked)}
              />
              No cookie banners
            </label>
          </div>

          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Generating...' : 'Generate Screenshot'}
          </button>
        </form>

        <section className="result-panel" aria-live="polite">
          <div className="status-card">
            <p className="status-label">Current API query/status</p>
            <code>{queryPreview}</code>
            <p>{status}</p>
          </div>

          {error ? <p className="error-message">{error}</p> : null}
          {isLoading ? <p className="loading-message">Loading screenshot from ApiFlash...</p> : null}

          <div className="screenshot-frame">
            {latestScreenshot ? (
              <img src={latestScreenshot.imageUrl} alt={`Screenshot of ${latestScreenshot.capturedUrl}`} />
            ) : (
              <p>Your latest screenshot will appear here.</p>
            )}
          </div>
        </section>
      </section>

      <section className="gallery-section">
        <div>
          <p className="eyebrow">Gallery</p>
          <h2>All screenshots generated so far</h2>
        </div>

        {screenshots.length === 0 ? (
          <p className="empty-gallery">No screenshots yet. Generate one to start your gallery.</p>
        ) : (
          <div className="gallery-grid">
            {screenshots.map((screenshot) => (
              <article className="gallery-card" key={screenshot.id}>
                <img src={screenshot.imageUrl} alt={`Screenshot of ${screenshot.capturedUrl}`} />
                <div>
                  <p>{screenshot.capturedUrl}</p>
                  <span>
                    {screenshot.size} · {screenshot.format.toUpperCase()} · {screenshot.createdAt}
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

function buildApiParams(form, accessKey) {
  const params = new URLSearchParams({
    access_key: accessKey,
    url: form.url,
    width: String(form.width),
    height: String(form.height),
    format: form.format,
    no_ads: form.noAds ? 'true' : 'false',
    no_cookie_banners: form.noCookieBanners ? 'true' : 'false',
  })

  return params
}

export default App
