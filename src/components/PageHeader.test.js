// src/components/PageHeader.test.js
import { render, screen } from '@testing-library/react';
import PageHeader from './PageHeader';

describe('PageHeader', () => {
  test('renders the title and subtitle', () => {
    render(<PageHeader title="Test Title" subtitle="Test Subtitle" />);
    
    // Check that title appears
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    // Check that subtitle appears
    expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
  });
});
