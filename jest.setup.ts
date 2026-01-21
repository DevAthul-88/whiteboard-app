import '@testing-library/jest-dom';

global.alert = jest.fn();
global.confirm = jest.fn(() => true);