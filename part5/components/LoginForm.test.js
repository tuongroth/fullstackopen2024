import { render, screen, fireEvent } from '@testing-library/react';
import LoginForm from './LoginForm';

describe('LoginForm component', () => {
  test('calls handleLogin with the correct details when the form is submitted', () => {
    const mockHandleLogin = jest.fn();
    render(<LoginForm handleLogin={mockHandleLogin} />);

    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'testpassword' },
    });

    fireEvent.click(screen.getByText('Login'));

    expect(mockHandleLogin).toHaveBeenCalledWith({
      username: 'testuser',
      password: 'testpassword',
    });
  });
});
