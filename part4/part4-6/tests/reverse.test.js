const reverse = require('../utils/for_testing').reverse;

describe('reverse function', () => {
  test('reverses a string', () => {
    expect(reverse('hello')).toBe('olleh');
  });
});
