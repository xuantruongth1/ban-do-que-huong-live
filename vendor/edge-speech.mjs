import { EdgeTTS } from 'node-edge-tts';

const cached = new Map();
const inflight = new Map();
let active = 0;

export async function synthesize(text, gender = 'auto', rate = 1) {
  if (typeof text !== 'string' || !text.trim() || text.length > 1800) throw Error('Câu đọc phải từ 1 đến 1800 ký tự.');
  if (!['auto', 'female', 'male'].includes(gender)) throw Error('Giọng đọc không hợp lệ.');
  if (!Number.isFinite(rate) || rate < .5 || rate > 2) throw Error('Tốc độ đọc từ 0,5 đến 2.');
  const voice = gender === 'male' ? 'vi-VN-NamMinhNeural' : 'vi-VN-HoaiMyNeural';
  const speed = Math.round((rate - 1) * 100);
  const key = JSON.stringify([voice, speed, text]);
  if (cached.has(key)) return cached.get(key);
  if (inflight.has(key)) return inflight.get(key);
  if (active >= 2) throw Error('Giọng đọc đang bận, vui lòng thử lại.');
  const task = (async () => {
    active++;
    try {
      const tts = new EdgeTTS({ voice, lang: 'vi-VN', rate: (speed >= 0 ? '+' : '') + speed + '%',
        timeout: 12000, outputFormat: 'audio-24khz-48kbitrate-mono-mp3' });
      const chunks = [];
      for await (const chunk of tts.streamAudio(text)) if (Buffer.isBuffer(chunk)) chunks.push(chunk);
      const buffer = Buffer.concat(chunks);
      if (buffer.length < 200) throw Error('Dịch vụ giọng đọc chưa trả về âm thanh.');
      cached.set(key, buffer);
      while (cached.size > 60) cached.delete(cached.keys().next().value);
      return buffer;
    } finally { active--; }
  })();
  inflight.set(key, task);
  try { return await task; } finally { inflight.delete(key); }
}
