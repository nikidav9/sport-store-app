'use client';
import '../../tokens.css';

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const productId = params.id;

  return (
    <div className="p-md" style={{ fontFamily: 'var(--font-family-sans)' }}>
      <h1 style={{ color: 'var(--color-primary)', fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-bold)' }}>Детали товара #{productId}</h1>
      <div style={{ display: 'flex', gap: 'var(--spacing-xl)', marginTop: 'var(--spacing-lg)' }}>
        <div style={{ flex: 1 }}>
          <img src="https://via.placeholder.com/400" alt="Product Detail Image" style={{ maxWidth: '100%', borderRadius: 'var(--border-radius-md)' }} />
        </div>
        <div style={{ flex: 1, backgroundColor: 'var(--color-white)', padding: 'var(--spacing-lg)', borderRadius: 'var(--border-radius-md)' }}>
          <h2 style={{ fontSize: 'var(--font-size-lg)', color: 'var(--color-dark)' }}>Название товара {productId}</h2>
          <p style={{ color: 'var(--color-secondary)', fontSize: 'var(--font-size-md)', marginTop: 'var(--spacing-sm)' }}>Категория товара</p>
          <p style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-primary)', marginTop: 'var(--spacing-md)' }}>2500 ₽</p>
          <p style={{ marginTop: 'var(--spacing-md)', lineHeight: 1.6 }}>
            Подробное описание товара. Это место для размещения всей ключевой информации о продукте, его характеристиках, преимуществах и особенностях.
            Например: материал, размер, цвета, доступность и т.д.
          </p>
          <button style={{
            backgroundColor: 'var(--color-primary)',
            color: 'var(--color-white)',
            border: 'none',
            padding: 'var(--spacing-md) var(--spacing-lg)',
            borderRadius: 'var(--border-radius-md)',
            cursor: 'pointer',
            marginTop: 'var(--spacing-lg)',
            fontSize: 'var(--font-size-md)'
          }}>Добавить в корзину</button>
        </div>
      </div>
    </div>
  );
}