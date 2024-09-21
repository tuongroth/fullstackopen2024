import { render, screen, fireEvent } from '@testing-library/react';
import Blog from './Blog';

describe('Blog component', () => {
  const blog = {
    title: 'Test Blog Title',
    author: 'Test Author',
    url: 'http://testurl.com',
    likes: 10,
  };

  test('renders title and author, but not URL or likes by default', () => {
    render(<Blog blog={blog} />);
    expect(screen.getByText('Test Blog Title')).toBeInTheDocument();
    expect(screen.getByText('Test Author')).toBeInTheDocument();
    expect(screen.queryByText('http://testurl.com')).not.toBeInTheDocument();
    expect(screen.queryByText('10 likes')).not.toBeInTheDocument();
  });

  test('shows URL and likes when details button is clicked', () => {
    render(<Blog blog={blog} />);
    fireEvent.click(screen.getByText('Show details'));
    expect(screen.getByText('http://testurl.com')).toBeInTheDocument();
    expect(screen.getByText('10 likes')).toBeInTheDocument();
  });

  test('hides URL and likes when details button is clicked again', () => {
    render(<Blog blog={blog} />);
    fireEvent.click(screen.getByText('Show details'));
    fireEvent.click(screen.getByText('Hide details'));
    expect(screen.queryByText('http://testurl.com')).not.toBeInTheDocument();
    expect(screen.queryByText('10 likes')).not.toBeInTheDocument();
  });

  test('calls onLike handler twice when like button is clicked twice', () => {
    const mockOnLike = jest.fn();
    render(<Blog blog={blog} onLike={mockOnLike} />);
    fireEvent.click(screen.getByText('Show details'));
    fireEvent.click(screen.getByText('Like'));
    fireEvent.click(screen.getByText('Like'));
    expect(mockOnLike).toHaveBeenCalledTimes(2);
  });
});
