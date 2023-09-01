/**
 * This service is meant to be injected via webpack into the HTML head.
 * This can be useful for enabling plugin, etc that work outside of the react environment
 *
 * Requiring this package anywhere won't do anything at best, and may cause issues at worst.
 *
 * This is included in the bundle via webpack and included in the built `index.html`
 *
 * This is a js file simply because this just dumps it's content to dumped into the <head> tag of our index.html
 */
