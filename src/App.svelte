<script>
import { genid, sha256, encrypt, decrypt } from './lib/crypto.js'
import { notify } from './lib/notifier.js'

import Intro from './components/Intro.svelte'
import Footer from './components/Footer.svelte'

const APP_NAME = import.meta.env.VITE_APP_NAME
const CRYPTO_SALT = import.meta.env.VITE_CRYPTO_SALT

let cpage = 'Encrypt'

const pages = [
  'Encrypt',
  'Decrypt',
]

const goToPage = (k) => {
  cpage = k
}

let passOne = ''
let passTwo = ''
let textInput = ''
let textOutput = ''

const onSubmit = async () => {
  if (!passOne) {
    return notify('Please enter password 1')
  } else if (!passTwo) {
    return notify('Please enter password 2')
  } else if (!textInput) {
    return notify(`Please enter text to ${cpage.toLowerCase()}`)
  }
  try {
    const password = await sha256([passOne, passTwo].join('-'), CRYPTO_SALT)
    const output = cpage === 'Encrypt' ?
      await encrypt(textInput, password, CRYPTO_SALT) :
      await decrypt(textInput, password, CRYPTO_SALT)
    textOutput = output
    notify(`${cpage}ed successfully`)
  } catch (err) {
    notify(`Incorrect passwords or wrong ${cpage.toLowerCase()}ed data`)
  }
}

const onReset = () => {
  passOne = ''
  passTwo = ''
  textInput = ''
  textOutput = ''
}

const copyTextFrom = (atarget) => {
  const txt = atarget === 'pass-one' ? passOne :
    atarget === 'pass-two' ? passTwo :
      atarget === 'output-text' ? textOutput : ''

  if (txt.length) {
    navigator.clipboard.writeText(txt)
    notify('Text copied')
  }
}

const generatePasswordTo = (atarget) => {
  if (atarget === 'pass-one') {
    passOne = genid(24)
  } else if (atarget === 'pass-two') {
    passTwo = genid(40)
  }
}


const onMouseClick = (e) => {
  const target = e.target
  if (target.classList.contains('cursor-pointer')) {
    const action = target.getAttribute('action')
    const atarget = target.getAttribute('atarget')
    if (!atarget || !action) {
      return false
    }
    if (action === 'switch') {
      return goToPage(atarget)
    } else if (action === 'copy') {
      return copyTextFrom(atarget)
    } else if (action === 'generate') {
      return generatePasswordTo(atarget)
    }
  }
}
</script>

<svelte:body on:click={onMouseClick} />

<main>
  <div class="row">
    <div class="col-12">
      <header>
        <nav class="nav">
          <div class="nav-left">
            <h1>{APP_NAME}</h1>
          </div>
          <div class="nav-right">
            <div>
              {#each pages as page}
                {#if page === cpage}
                  <span class="link cursor-default">{page}</span>
                {:else}
                  <span class="link cursor-pointer text-primary" action="switch" atarget="{page}">{page}</span>
                {/if}
              {/each}
            </div>
            <br><br>
          </div>
        </nav>
      </header>

      <form on:submit|preventDefault={onSubmit} on:reset|preventDefault={onReset}>
        <fieldset>
          <legend>Input</legend>
          <div class="row">
            <div class="col-6">
              <div class="col">
                <div class="col">
                  <span class="text-italic">Password 1:</span>
                  <div class="pull-right">
                    <span
                      class="tag is-small cursor-pointer"
                      action="generate"
                      atarget="pass-one"
                    >
                      Generate
                    </span>
                    <span
                      class="tag is-small cursor-pointer"
                      action="copy"
                      atarget="pass-one"
                    >
                      Copy
                    </span>
                  </div>
                </div>
                <div class="col">
                  <input type="text" bind:value={passOne}>
                </div>
              </div>
              <div class="col">
                <div class="col">
                  <span class="text-italic">Password 2:</span>
                  <div class="pull-right">
                    <span
                      class="tag is-small cursor-pointer"
                      action="generate"
                      atarget="pass-two"
                    >
                      Generate
                    </span>
                    <span
                      class="tag is-small cursor-pointer"
                      action="copy"
                      atarget="pass-two"
                    >
                      Copy
                    </span>
                  </div>
                </div>
                <div class="col">
                  <input type="text" bind:value={passTwo}>
                </div>
              </div>
            </div>
            <div class="col-6">
              <div class="col">
                <div class="col">
                  <span class="text-italic">Text you want to {cpage.toLowerCase()}:</span>
                </div>
                <div class="col">
                  <textarea rows="5" cols="48" class="no-resize" bind:value={textInput}></textarea>
                </div>
              </div>
            </div>
          </div>
          <div class="col">
            <div class="col">
              <div class="pull-right">
                <button class="button" type="reset">Reset</button>
                <button class="button primary" type="submit">{cpage} text</button>
              </div>
            </div>
          </div>
        </fieldset>
      </form>

      <fieldset>
        <legend>Output</legend>
        <div class="col">
          <div class="col">
            <span class="text-italic">Result:</span>
            <div class="pull-right">
              <span class="tag is-small cursor-pointer" action="copy" atarget="output-text">Copy</span>
            </div>
          </div>
          <div class="col">
            <textarea rows="10" cols="48" class="vertial-resize" bind:value={textOutput}></textarea>
          </div>
        </div>
      </fieldset>
    </div>
  </div>

  <Intro />
</main>

<Footer />

<style>
fieldset {
  margin-bottom: 20px;
  padding: 20px;
}
</style>
