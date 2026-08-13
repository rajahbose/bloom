/**
 * Deterministic Mulberry32 Pseudo-Random Number Generator (PRNG)
 * Ensures reproducible plant geometry rendering from a seed number.
 */
export class PRNG {
  private state: number;

  constructor(seed: number) {
    this.state = seed >>> 0;
  }

  /**
   * Returns a float between 0 (inclusive) and 1 (exclusive)
   */
  next(): number {
    let t = (this.state += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  /**
   * Returns a float between min and max
   */
  range(min: number, max: number): number {
    return min + this.next() * (max - min);
  }

  /**
   * Returns range centered around 0 with +/- variation
   */
  jitter(variation: number): number {
    return (this.next() - 0.5) * 2 * variation;
  }
}
