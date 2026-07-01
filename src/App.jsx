import { useState } from 'react'
import './App.css'
import Gallery from './Gallery'

const API_ENDPOINT = 'https://api.thecatapi.com/v1/images/search?has_breeds=1&limit=1'
const BREEDS_ENDPOINT = 'https://api.thecatapi.com/v1/breeds'
const MAX_ATTEMPTS = 20

function App() {
  const [currentCat, setCurrentCat] = useState(null)
  const [banList, setBanList] = useState([])
  const [history, setHistory] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  async function discoverCat() {
    setIsLoading(true)
    setError('')

    try {
      for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
        const cat = await fetchCat()

        if (cat && !hasBannedAttribute(cat, banList)) {
          setCurrentCat(cat)
          setHistory((previousHistory) => [cat, ...previousHistory])
          return
        }
      }

      if (banList.length > 0) {
        setError('No cats matched your current ban list. Remove a banned value and try again.')
      } else {
        setError('The Cat API did not return breed details. Please try Discover again.')
      }
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Something went wrong.')
    } finally {
      setIsLoading(false)
    }
  }

  function addToBanList(value) {
    if (!value || banList.includes(value)) {
      return
    }

    setBanList((currentBanList) => [...currentBanList, value])
  }

  function removeFromBanList(value) {
    setBanList((currentBanList) => currentBanList.filter((item) => item !== value))
  }

  return (
    <main className="app-shell">
      <Gallery cats={history} onSelectCat={setCurrentCat} />

      <section className="discovery-panel" aria-live="polite">
        <header className="hero-panel">
          <p className="eyebrow">Cat discovery lab</p>
          <h1>Veni Vici!</h1>
          <p className="intro">Discover a new cat, then ban attributes to shape what appears next.</p>
          <button className="discover-button" type="button" onClick={discoverCat} disabled={isLoading}>
            {isLoading ? 'Discovering...' : 'Discover'}
          </button>
        </header>

        {error ? <p className="error-message">{error}</p> : null}
        {isLoading ? <p className="loading-message">Fetching a cat that matches your filters...</p> : null}

        <section className="result-card">
          {currentCat ? (
            <>
              <div className="cat-details">
                <h2>{currentCat.name}</h2>
                <div className="attribute-list" aria-label="Clickable cat attributes">
                  {currentCat.attributes.map((attribute) => (
                    <button
                      className="attribute-chip"
                      type="button"
                      key={attribute.label}
                      onClick={() => addToBanList(attribute.value)}
                    >
                      <span>{attribute.label}</span>
                      {attribute.value}
                    </button>
                  ))}
                </div>
              </div>
              <img className="cat-image" src={currentCat.imageUrl} alt={`${currentCat.name} cat`} />
            </>
          ) : (
            <div className="empty-state">
              <h2>Ready to discover?</h2>
              <p>Click Discover to fetch a random cat with breed details and an image.</p>
            </div>
          )}
        </section>
      </section>

      <aside className="ban-panel">
        <h2>Ban List</h2>
        <p>Click an attribute to ban it. Click a banned value here to remove it.</p>

        {banList.length === 0 ? (
          <p className="empty-ban-list">Nothing banned yet.</p>
        ) : (
          <div className="ban-list">
            {banList.map((value) => (
              <button className="ban-chip" type="button" key={value} onClick={() => removeFromBanList(value)}>
                {value}
              </button>
            ))}
          </div>
        )}
      </aside>
    </main>
  )
}

async function fetchCat() {
  const response = await fetch(API_ENDPOINT)

  if (!response.ok) {
    throw new Error('The Cat API could not find a cat right now. Please try again.')
  }

  const data = await response.json()
  const cat = formatCat(data[0])

  if (cat) {
    return cat
  }

  const breed = await fetchRandomBreed()
  const imageResponse = await fetch(`${API_ENDPOINT}&breed_ids=${breed.id}`)

  if (!imageResponse.ok) {
    throw new Error('The Cat API could not find an image for that breed. Please try again.')
  }

  const imageData = await imageResponse.json()

  return formatCat(imageData[0], breed)
}

async function fetchRandomBreed() {
  const response = await fetch(BREEDS_ENDPOINT)

  if (!response.ok) {
    throw new Error('The Cat API could not load breed details. Please try again.')
  }

  const breeds = await response.json()
  const randomIndex = Math.floor(Math.random() * breeds.length)

  return breeds[randomIndex]
}

function formatCat(catData, fallbackBreed) {
  const breed = catData?.breeds?.[0] || fallbackBreed

  if (!catData?.url || !breed?.name || !breed?.origin || !breed?.temperament) {
    return null
  }

  const lifeSpan = breed.life_span ? `${breed.life_span} years` : ''
  const weight = breed.weight?.imperial ? `${breed.weight.imperial} lbs` : ''
  const lifeOrWeight = lifeSpan || weight

  if (!lifeOrWeight) {
    return null
  }

  const attributes = [
    { label: 'Breed', value: breed.name },
    { label: 'Origin', value: breed.origin },
    { label: 'Temperament', value: breed.temperament },
    { label: breed.life_span ? 'Life span' : 'Weight', value: lifeOrWeight },
  ]

  return {
    id: catData.id,
    imageUrl: catData.url,
    name: breed.name,
    attributes,
  }
}

function hasBannedAttribute(cat, banList) {
  return cat.attributes.some((attribute) => banList.includes(attribute.value))
}

export default App
