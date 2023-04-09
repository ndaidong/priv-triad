<script>
const APP_NAME = import.meta.env.VITE_APP_NAME
</script>

<div class="row">
  <div class="col-12">
    <div class="col">
      <h3>Introduction</h3>
      <p>{APP_NAME} is a tool that enhances the security of sensitive information such as private keys or
      mnemonics for cryptocurrency wallets.</p>
      <p>Instead of directly storing the 24 words, you can
      use {APP_NAME} to encrypt them into a meaningless string, combined with two highly complex
      passwords.</p>
      <p>If these three pieces of information are kept in three different secret locations, the
      likelihood of losing the private key is extremely low, as the attacker must have the encrypted string and both passwords
      to decrypt it.</p>
      <center><img alt="Protected" src="/img/PrivTriad-Diagram.png"></center>
    </div>
  </div>
</div>
