import CarouselSlide from './CarouselSlide'
import CursorWithEffect from '../CursorWithEffect.js'
import CursorWithoutEffect from '../CursorWithoutEffect'
import styles from './Carousel.module.css' // Importa el archivo de estilos

export default function Carousel() {
  return (
    <div className="flex justify-center w-full h-screen relative">
      <CursorWithoutEffect />

      <div
        className={`${styles.customCursor} relative w-[58rem] mx-auto border-2 border-green-500 overflow-hidden`}
      >
        <CarouselSlide />
        <CursorWithEffect />
      </div>
    </div>
  )
}
