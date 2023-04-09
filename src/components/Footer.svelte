<script>
const APP_NAME = import.meta.env.VITE_APP_NAME
const TRACKING_CODE = import.meta.env.VITE_TRACKING_CODE
</script>

<footer class="text-center">
  &copy;2023 {APP_NAME} - Maintain by <a href="https://twitter.com/ndaidong">@ndaidong</a>
  <br>
  <a href="https://github.com/ndaidong/priv-triad">Source code</a> &diamond; <a href="https://paypal.me/ndaidong">Donate</a>
</footer>

{#if TRACKING_CODE}
  <script async defer data-website-id="{TRACKING_CODE}" src="https://fbi.pwshub.com/cia.js"></script>
{/if}
