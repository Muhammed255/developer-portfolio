import { routes } from './app.routes';

describe('routes', () => {
  it('serves home at the root and redirects /home there', () => {
    expect(routes.find((r) => r.path === '')?.loadComponent).toBeDefined();
    expect(routes.find((r) => r.path === 'home')?.redirectTo).toBe('');
  });

  it('uses the /experiences path that the links point to', () => {
    expect(routes.some((r) => r.path === 'experiences')).toBe(true);
    expect(routes.some((r) => r.path === 'experience')).toBe(false);
  });

  it('has no blog routes', () => {
    expect(routes.some((r) => r.path?.startsWith('blog'))).toBe(false);
  });
});
