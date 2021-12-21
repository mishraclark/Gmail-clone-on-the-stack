import { onBeforeUnmount } from 'vue'
  
let useKeydown = (keyCombos: any[]) => {
  let onKeydown = (event: { key: any }) => {
    let kc = keyCombos.find((kc: { key: any }) => kc.key == event.key)
    if(kc) {
      kc.fn()
    }
  }

  window.addEventListener('keydown', onKeydown)
  onBeforeUnmount(()=>{
    window.removeEventListener('keydown', onKeydown)
  })
}

export default useKeydown;