function Gallery({ cats, onSelectCat }) {
  return (
    <aside className="history-panel">
      <h2>History</h2>
      <p>Previously discovered cats appear here.</p>

      {cats.length === 0 ? (
        <p className="empty-history">No discoveries yet.</p>
      ) : (
        <div className="history-list">
          {cats.map((cat, index) => (
            <button
              className="history-item"
              type="button"
              key={`${cat.id}-${index}`}
              onClick={() => onSelectCat(cat)}
            >
              <img src={cat.imageUrl} alt={`${cat.name} thumbnail`} />
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      )}
    </aside>
  )
}

export default Gallery
