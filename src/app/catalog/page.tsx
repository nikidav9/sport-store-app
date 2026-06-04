'use client';
import '../tokens.css';

export default function CatalogPage() {
  return (
    <div className="p-md" style={{ fontFamily: 'var(--font-family-sans)' }}>
      <h1 style={{ color: 'var(--color-primary)', fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-bold)' }}>Каталог товаров</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 'var(--spacing-md)' }}>
        {/* Пример карточки товара */}
        <div style={{
          border: 'var(--border-width-sm) solid var(--color-light)',
          borderRadius: 'var(--border-radius-md)',
          padding: 'var(--spacing-md)',
          backgroundColor: 'var(--color-white)'
        }}>
          <img src="https://via.placeholder.com/150" alt="Product Image" style={{ maxWidth: '100%', borderRadius: 'var(--border-radius-sm)' }} />
          <h2 style={{ fontSize: 'var(--font-size-md)', color: 'var(--color-dark)', marginTop: 'var(--spacing-sm)' }}>Название товара 1</h2>
          <p style={{ color: 'var(--color-secondary)', fontSize: 'var(--font-size-sm)' }}>Категория</p>
          <p style={{ fontSize: 'var(--font-size-md)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-primary)' }}>1200 ₽</p>
          <button style={{
            backgroundColor: 'var(--color-primary)',
            color: 'var(--color-white)',
            border: 'none',
            padding: 'var(--spacing-sm) var(--spacing-md)',
            borderRadius: 'var(--border-radius-sm)',
            cursor: 'pointer',
            marginTop: 'var(--spacing-sm)'
          }}>В корзину</button>
        </div>
        {/* Больше карточек товаров... */}
      </div>
    </div>
  );
}