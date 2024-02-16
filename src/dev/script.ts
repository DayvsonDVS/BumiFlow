import { bumiFlow, props } from '../bumiFlow'
import '@/assets/scss/vars.scss'
import '@/assets/scss/main.scss'

const prop = props

const buttonStyles = bumiFlow('label')
  .base('text-black border-rounded')
  .hover('text-red  background-yellow')
  .build()

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div >    
    <h1>BumiFlow</h1>
    <div>
      <button type="button" class="${buttonStyles}"> Hello word </button>
    </div>
  </div>
`
