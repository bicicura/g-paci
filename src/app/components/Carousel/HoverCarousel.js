import Image from 'next/image'

const HoverCarousel = props => {
  return (
    <div className={`transition-opacity duration-200 h-full ${props.opacity}`}>
      <Image
        src={`/images/work/the-ann-wagners/slide-1.jpg`}
        alt="hero image"
        className={'absolute top-0 left-0 object-contain w-full h-full'}
        priority
        fill={true}
        sizes="50vw"
      />
    </div>
  )
}

export default HoverCarousel
