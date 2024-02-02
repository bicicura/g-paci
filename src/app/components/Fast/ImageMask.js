import OverlayImage from './OverlayImage'

// Componente para cada máscara de imagen
const ImageMask = ({
  xImgs,
  imageOpacities,
  horizontalPercentage,
  maskWidth,
  id,
  left,
  transform,
}) => (
  <div
    id={id}
    style={{
      left,
      transform,
      width: maskWidth,
      height: '100%',
      position: 'absolute',
      overflow: 'hidden',
      transition:
        'left 0.5s cubic-bezier(0.25, 0.8, 0.25, 1), width 0.5s cubic-bezier(0.25, 0.8, 0.25, 1), transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)',
    }}
  >
    {xImgs.map((img, index) => (
      <OverlayImage
        img={img}
        opacity={imageOpacities[index]}
      />
    ))}
  </div>
)

export default ImageMask
