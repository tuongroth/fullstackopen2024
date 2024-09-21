import { render, screen, fireEvent } from '@testing-library/react';
import Togglable from './Togglable';

describe('Togglable component', () => {
  test('renders children when the button is clicked', () => {
    render(
      <Togglable buttonLabel="Show details">
        <div>Toggle content</div>
      </Togglable>
    );

    expect(screen.queryByText('Toggle content')).not.toBeInTheDocument();
    fireEvent.click(screen.getByText('Show details'));
    expect(screen.getByText('Toggle content')).toBeInTheDocument();
  });

  test('hides children when the button is clicked again', () => {
    render(
      <Togglable buttonLabel="Show details">
        <div>Toggle content</div>
      </Togglable>
    );

    fireEvent.click(screen.getByText('Show details'));
    expect(screen.getByText('Toggle content')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Hide'));
    expect(screen.queryByText('Toggle content')).not.toBeInTheDocument();
  });
});
