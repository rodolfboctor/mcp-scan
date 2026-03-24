import { describe, it, expect } from 'vitest';
import { maskPii, maskString } from '../../src/utils/privacy-engine.js';

describe('Privacy Engine', () => {
  describe('String Masking', () => {
    it('should mask emails', () => {
      const input = 'Contact me at admin@example.com for info.';
      const output = maskString(input);
      expect(output).toBe('Contact me at [EMAIL_MASKED] for info.');
    });

    it('should mask phone numbers', () => {
      const input = 'Call +1-555-123-4567 today.';
      const output = maskString(input);
      expect(output).toBe('Call [PHONE_MASKED] today.');
    });

    it('should mask credit cards', () => {
      const input = 'My card is 4111 1111 1111 1111';
      const output = maskString(input);
      expect(output).toBe('My card is [CREDIT_CARD_MASKED]');
    });

    it('should mask SSN', () => {
      const input = 'SSN: 123-45-6789';
      const output = maskString(input);
      expect(output).toBe('SSN: [SSN_MASKED]');
    });

    it('should mask IPv4', () => {
      const input = 'IP is 192.168.1.1';
      const output = maskString(input);
      expect(output).toBe('IP is [IP_MASKED]');
    });
  });

  describe('Recursive Object/Array Masking', () => {
    it('should mask deeply nested objects', () => {
      const input = {
        user: {
          name: 'John Doe',
          email: 'john.doe@test.com',
          details: {
            phone: '555-987-6543'
          }
        },
        ids: [1, 2, 'admin@thynkq.com']
      };

      // Create deep copy to avoid modifying test input literal reference
      const dataToMask = JSON.parse(JSON.stringify(input));
      const output = maskPii(dataToMask);

      expect(output.user.email).toBe('[EMAIL_MASKED]');
      expect(output.user.details.phone).toBe('[PHONE_MASKED]');
      expect(output.user.name).toBe('John Doe'); // Unchanged
      expect(output.ids[2]).toBe('[EMAIL_MASKED]');
      expect(output.ids[0]).toBe(1); // Unchanged
    });

    it('should respect options', () => {
       const input = { text: 'Email a@b.com, IP 1.2.3.4' };
       const data1 = JSON.parse(JSON.stringify(input));
       const out1 = maskPii(data1, { enabledPatterns: ['Email'] });
       expect(out1.text).toBe('Email [EMAIL_MASKED], IP 1.2.3.4');

       const data2 = JSON.parse(JSON.stringify(input));
       const out2 = maskPii(data2, { disabledPatterns: ['IPv4 Address'] });
       expect(out2.text).toBe('Email [EMAIL_MASKED], IP 1.2.3.4');
    });

    it('should run quickly on medium payloads', () => {
      const input = { text: 'Email admin@example.com '.repeat(50) };
      const start = performance.now();
      maskPii(input);
      const end = performance.now();
      expect(end - start).toBeLessThan(5); // Should easily take < 5ms
    });
  });
});
