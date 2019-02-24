/**
 * Entry point for the bundle file.
 * This should only be included in the bundle file.
 */
import * as FYSX from './';

declare global {
  interface Window {
    FYSX: typeof FYSX;
  }
}

window.FYSX = FYSX;
