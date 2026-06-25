function Gallery({ images }) {
  return (
    <section className="gallery-section">
      <div>
        <p className="eyebrow">Gallery</p>
        <h2>All screenshots generated so far</h2>
      </div>

      {images.length === 0 ? (
        <p className="empty-gallery">No screenshots yet. Generate one to start your gallery.</p>
      ) : (
        <div className="gallery-grid">
          {images.map((image) => (
            <article className="gallery-card" key={image.id}>
              <img src={image.imageUrl} alt={`Screenshot of ${image.capturedUrl}`} />
              <div>
                <p>{image.capturedUrl}</p>
                <span>
                  {image.size} - {image.format.toUpperCase()} - {image.createdAt}
                </span>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

export default Gallery
