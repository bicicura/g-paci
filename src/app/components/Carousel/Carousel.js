import CarouselSlide from './CarouselSlide'
import CursorWithEffect from '../CursorWithEffect.js'
import CursorWithoutEffect from '../CursorWithoutEffect'
import styles from './Carousel.module.css' // Importa el archivo de estilos

export default function Carousel() {
  return (
    <div
      className={`${styles.customCursor} flex justify-center w-full relative`}
      style={{ height: 'calc(100vh - 10rem)', margin: '5rem 0 5rem 0' }}
    >
      <CursorWithoutEffect />

      <div className="relative w-[58rem] mx-auto overflow-hidden">
        <CarouselSlide />
        <CursorWithEffect />
      </div>
    </div>
  )
}
