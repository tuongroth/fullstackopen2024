import { render, screen, fireEvent } from '@testing-library/react';
import BlogForm from './BlogForm';

describe('BlogForm component', () => {
  test('calls handleCreateBlog with the correct details when a new blog is created', () => {
    const mockHandleCreateBlog = jest.fn();
    render(<BlogForm handleCreateBlog={mockHandleCreateBlog} />);

    fireEvent.change(screen.getByRole('textbox', { name: /title/i }), {
      target: { value: 'New Blog Title' },
    });
    fireEvent.change(screen.getByRole('textbox', { name: /author/i }), {
      target: { value: 'New Author' },
    });
    fireEvent.change(screen.getByRole('textbox', { name: /url/i }), {
      target: { value: 'http://newblogurl.com' },
    });

    fireEvent.click(screen.getByText('Create'));

    expect(mockHandleCreateBlog).toHaveBeenCalledWith({
      title: 'New Blog Title',
      author: 'New Author',
      url: 'http://newblogurl.com',
      likes: 0,
    });
  });
});
