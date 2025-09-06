// src/components/SkeletonCard.test.js
import { render, screen } from '@testing-library/react';
import SkeletonCard from './SkeletonCard';

describe('SkeletonCard', () => {
  test('renders a single skeleton card placeholder', () => {
    render(<SkeletonCard />);
    expect(screen.getByTestId('skeleton-card')).toBeInTheDocument();
  });

  test('renders multiple skeleton cards when mapped', () => {
    render(
      <>
        {[...Array(3)].map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </>
    );
    expect(screen.getAllByTestId('skeleton-card')).toHaveLength(3);
  });
});
