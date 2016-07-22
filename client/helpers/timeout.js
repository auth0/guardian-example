
export default function timeout() {
  return new Timeout();
}

class Timeout {
  constructor() {
    this.timeout = null
  }

  start({ createdAt, expiresIn }, cb) {
    this.clear(this.timeout);

    const left = expiresIn - (Date.now() - createdAt)

    if (left < 0) {
      return;
    }

    setTimeout(cb, left);
  }

  clear() {
    clearTimeout(this.timeout);
  }
}
