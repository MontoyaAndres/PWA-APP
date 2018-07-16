export const progressBar = () => (`
  <div class="Progress u-hide">
    <progress value="0" max="100" class="Progress-bar"></progress>
    <span class="Progress-advance"></span>
  </div>
  <div class="Progress-output"></div>
`);

export const progressStatus = data => {
  const d = document;
  const c = console.log;
  const progress = d.querySelectorAll('.Progress');

  progress.forEach(progress => {
    const advance = Math.floor((data.bytesTransferred / data.totalBytes) * 100)
    progress.querySelector('.Progress-bar').value = advance
    progress.querySelector('.Progress-advance').innerHTML = `${advance} %`
  })
}

export const showProgress = () => document.querySelectorAll('.Progress').forEach(bar => bar.classList.remove('u-hide'));

export const hideProgress = () => document.querySelectorAll('.Progress').forEach(bar => bar.classList.add('u-hide'));

export const clearProgress = () => {
  const d = document;
  d.querySelectorAll('.Progress-output').forEach(output => output.innerHTML = '')
  d.querySelectorAll('.Progress-bar').forEach(bar => bar.value = 0)
  d.querySelectorAll('.Progress-advance').forEach(advance => advance.innerHTML = '')
}
