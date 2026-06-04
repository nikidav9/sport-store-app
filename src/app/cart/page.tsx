'use client';
import '../tokens.css';

export default function CartPage() {
  return (
    <div className="p-md" style={{ fontFamily: 'var(--font-family-sans)' }}>
      <h1 style={{ color: 'var(--color-primary)', fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-bold)' }}>Ваша корзина</h1>
      <div style={{ marginTop: 'var(--spacing-lg)' }}>
        {/* Пример элемента в корзине */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-md)',
          borderBottom: 'var(--border-width-sm) solid var(--color-light)',
          paddingBottom: 'var(--spacing-md)',
          marginBottom: 'var(--spacing-md)'
        }}>
          <img src="https://via.placeholder.com/80" alt="Product in Cart" style={{ borderRadius: 'var(--border-radius-sm)' }} />
          <div style={{ flexGrow: 1 }}>
            <h2 style={{ fontSize: 'var(--font-size-md)', color: 'var(--color-dark)' }}>Название товара в корзине</h2>
            <p style={{ color: 'var(--color-secondary)', fontSize: 'var(--font-size-sm)' }}>1 шт. x 1200 ₽</p>
          </div>
          <p style={{ fontSize: 'var(--font-size-md)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-dark)' }}>1200 ₽</p>
          <button style={{
            backgroundColor: 'var(--color-danger)',
            color: 'var(--color-white)',
            border: 'none',
            padding: 'var(--spacing-xs) var(--spacing-sm)',
            borderRadius: 'var(--border-radius-sm)',
            cursor: 'pointer',
            fontSize: 'var(--font-size-sm)'
          }}>Удалить</button>
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          marginTop: 'var(--spacing-lg)',
          paddingTop: 'var(--spacing-md)',
          borderTop: 'var(--border-width-sm) solid var(--color-light)'
        }}>
          <p style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-dark)', marginRight: 'var(--spacing-md)' }}>Итого:</p>
          <p style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-primary)' }}>1200 ₽</p>
        </div>

        <button style={{
          backgroundColor: 'var(--color-success)',
          color: 'var(--color-white)',
          border: 'none',
          padding: 'var(--spacing-md) var(--spacing-lg)',
          borderRadius: 'var(--border-radius-md)',
          cursor: 'pointer',
          marginTop: 'var(--spacing-lg)',
          fontSize: 'var(--font-size-md)',
          width: '100%'
        }}>Перейти к оформлению</button>
      </div>
    </div>
  );
}