import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ContactError, ContactMessage, ContactService } from './contact.service';
import { environment } from '../../environments/environment';

const message: ContactMessage = {
  firstName: ' Jane ',
  lastName: 'Doe ',
  email: ' Jane+site@Example.com ',
  subject: 'Project Discussion',
  message: ' Hello there, let us talk. ',
};

describe('ContactService', () => {
  let service: ContactService;
  let http: HttpTestingController;
  const url = `${environment.apiUrl}/send-mail`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ContactService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
    vi.useRealTimers();
  });

  it('posts the API payload with trimmed fields and an empty honeypot', () => {
    service.sendMessage(message).subscribe();

    const req = http.expectOne(url);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      name: 'Jane Doe',
      from: 'Jane+site@Example.com',
      subject: 'Project Discussion',
      body: 'Hello there, let us talk.',
      website: '',
    });
    req.flush({ message: 'Message sent successfully' });
  });

  it('does not retry 4xx responses and maps 429 to a friendly error', () => {
    let error: ContactError | undefined;
    service.sendMessage(message).subscribe({ error: (e) => (error = e) });

    http.expectOne(url).flush({ error: 'Too many' }, { status: 429, statusText: 'Too Many Requests' });

    expect(error?.status).toBe(429);
    expect(error?.message).toContain('Too many messages');
  });

  it('retries 5xx responses with backoff before failing', () => {
    vi.useFakeTimers();
    let error: ContactError | undefined;
    service.sendMessage(message).subscribe({ error: (e) => (error = e) });

    http.expectOne(url).flush(null, { status: 502, statusText: 'Bad Gateway' });
    vi.advanceTimersByTime(1000);
    http.expectOne(url).flush(null, { status: 502, statusText: 'Bad Gateway' });
    vi.advanceTimersByTime(2000);
    http.expectOne(url).flush(null, { status: 502, statusText: 'Bad Gateway' });

    expect(error?.status).toBe(502);
  });

  it('succeeds when a retry after a network error succeeds', () => {
    vi.useFakeTimers();
    let response: unknown;
    service.sendMessage(message).subscribe((r) => (response = r));

    http.expectOne(url).error(new ProgressEvent('error'), { status: 0 });
    vi.advanceTimersByTime(1000);
    http.expectOne(url).flush({ message: 'ok' });

    expect(response).toEqual({ message: 'ok' });
  });
});
