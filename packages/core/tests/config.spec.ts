import { describe, test, expect, beforeEach } from 'vitest';
import { RepoProvider } from '../src/types';
import { Config } from '../src/config';

let config: Config;
describe('config', () => {
  describe('defaults', () => {
    beforeEach(() => {
      config = new Config();
    });
    test('base', () => {
      expect(config.base).toEqual({
        mathjaxUrl: 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.5/MathJax.js',
        mathjaxConfig: 'TeX-AMS_CHTML-full,Safe',
      });
    });
    test('binder', () => {
      expect(config.binder).toEqual({
        repo: 'executablebooks/thebe-binder-base',
        ref: 'HEAD',
        binderUrl: 'https://mybinder.org',
        repoProvider: 'github',
      });
    });
    test('kernels', () => {
      expect(config.kernels).toEqual({
        path: '/',
        kernelName: 'python',
      });
    });
    test('saved sessions', () => {
      expect(config.savedSessions).toEqual({
        enabled: true,
        maxAge: 86400,
        storagePrefix: 'thebe-binder-',
      });
    });
    test('server settings', () => {
      expect(config.serverSettings).toEqual(
        expect.objectContaining({
          baseUrl: 'http://localhost:8888',
          token: expect.any(String),
          appendToken: true,
          wsUrl: 'ws://localhost:8888',
        }),
      );
    });
  });
});
