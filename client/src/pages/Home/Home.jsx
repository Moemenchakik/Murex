import { Link } from "react-router-dom";

function Home() {
  return (
    <main>
      <section className="hero">
        <div className="container" style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <div className="hero-content">
            <span className="hero-subtitle">Exclusive Collection 2026</span>
            <h1 className="hero-title">Timeless <br /> Elegance.</h1>
            <p className="hero-description">
              Discover our curated selection of high-end fashion, 
              meticulously designed for the modern individual who values 
              quality and sophisticated style.
            </p>
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              <Link to="/shop" className="btn-luxury">Shop Collection</Link>
              <Link to="/shop" className="btn-outline">New Arrivals</Link>
            </div>
          </div>
          <div className="hero-image-container">
            <img 
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop" 
              alt="Luxury Fashion" 
              className="hero-image"
            />
          </div>
        </div>
      </section>

      <section className="container">
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <span className="hero-subtitle">Curated For You</span>
          <h2 style={{ fontSize: '2.5rem' }}>Luxury Essentials</h2>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '2rem' }}>
          {/* Static placeholders for visual impact since DB is not connected */}
          <div className="product-card-luxury">
            <div className="product-image-wrapper">
              <img src="https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1000&auto=format&fit=crop" alt="Blazer" style={{ width: '100%', height: '450px', objectFit: 'cover' }} />
            </div>
            <div style={{ marginTop: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Tailored Wool Blazer</h3>
              <p style={{ color: 'var(--color-grey-medium)', fontSize: '0.9rem' }}>$450.00</p>
            </div>
          </div>

          <div className="product-card-luxury">
            <div className="product-image-wrapper">
              <img src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1000&auto=format&fit=crop" alt="Dress" style={{ width: '100%', height: '450px', objectFit: 'cover' }} />
            </div>
            <div style={{ marginTop: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Silk Evening Gown</h3>
              <p style={{ color: 'var(--color-grey-medium)', fontSize: '0.9rem' }}>$890.00</p>
            </div>
          </div>

          <div className="product-card-luxury">
            <div className="product-image-wrapper">
              <img src="https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1000&auto=format&fit=crop" alt="Shirt" style={{ width: '100%', height: '450px', objectFit: 'cover' }} />
            </div>
            <div style={{ marginTop: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Classic Cotton Shirt</h3>
              <p style={{ color: 'var(--color-grey-medium)', fontSize: '0.9rem' }}>$180.00</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;
