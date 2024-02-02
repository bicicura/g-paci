import Image from 'next/image'

// Componente para cada imagen con opacidad
const OverlayImage = ({ img, opacity }) => (
  <Image
    key={img}
    src={`/images/overlap-effect/${img}.jpg`}
    fill
    className="absolute inset-0 w-full h-full object-cover"
    style={{ opacity }}
  />
)

export default OverlayImage
