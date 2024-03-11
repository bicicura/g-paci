import Image from 'next/image'
import useImgSlideEffect from '../hooks/useImgSlideEffect'
import CursorWithEffect2 from './CursorWithEffect2'
import styles from './Carousel/Carousel.module.css'
import CursorWithoutEffect2 from './CursorWithoutEffect2'
import Spinner from './Spinner'

const ImgSlideEffect = ({ onDismiss, opacity }) => {
  const {
    shouldShowFilter,
    cursorText,
    handleMouseMove,
    handleMouseEnter,
    handleMouseLeave,
    handleImageLoad,
    randomImg,
    homeEffectConfig,
    primaryImages,
    isLeaving,
    maskWidth,
    mousePosition,
    primaryImagesLoaded,
  } = useImgSlideEffect({ onDismiss, opacity })

  return shouldShowFilter ? (
    <div
      className={`${
        styles.customCursor
      } flex justify-center min-h-dvh opacity-0 lg:min-h-screen items-center w-full transition-opacity relative duration-300 ${
        opacity === 1 ? 'opacity-100' : ''
      }`}
    >
      {primaryImages && <CursorWithoutEffect2 cursorText={cursorText} />}
      <div
        className="flex justify-center items-center relative"
        style={{ maxHeight: '80vh', height: '80vh', aspectRatio: '4/5' }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => handleMouseEnter()}
        onMouseLeave={() => {
          handleMouseLeave()
        }}
        onClick={onDismiss}
      >
        {primaryImagesLoaded && <Spinner />}

        <div
          style={{ transform: 'translateX(100%)' }}
          className={
            'absolute -right-4 top-0 w-max mx-auto flex flex-col gap-y-1 transition-opacity'
          }
        >
          <span className="text-slate-400 text-sm leading-none">client</span>
          <span className="font-bold text-lg leading-none">{randomImg?.client}</span>
        </div>

        {primaryImages.length ? (
          <div className="w-full inset-0 absolute h-full overflow-hidden">
            <CursorWithEffect2 cursorText={cursorText} />
            {primaryImages && <CursorWithEffect2 cursorText={cursorText} />}
            <Image
              onLoad={() => handleImageLoad('primary')}
              style={{
                opacity: primaryImages.length > 1 ? (mousePosition <= 50 ? 1 : 0) : 1,
              }}
              src={primaryImages[0].url}
              className="w-full h-full object-cover transition-opacity"
              fill
              sizes="70vw"
              alt="Slide img"
              priority
            />
            {primaryImages.length > 1 && (
              <Image
                onLoad={() => handleImageLoad('primary')}
                style={{ opacity: mousePosition > 50 ? 1 : 0 }}
                src={primaryImages[1].url}
                fill
                className="w-full h-full object-cover transition-opacity"
                sizes="70vw"
                alt="Slide img"
                priority
              />
            )}
          </div>
        ) : homeEffectConfig.images.length ? (
          <div className="w-full inset-0 absolute h-full overflow-hidden">
            <CursorWithEffect2 cursorText={cursorText} />
            <Image
              onLoad={() => handleImageLoad('no-primary')}
              style={{
                opacity: 1,
              }}
              src={homeEffectConfig.images[0].url}
              className="w-full h-full object-cover transition-opacity"
              fill
              sizes="70vw"
              alt="Slide img"
              priority
            />
          </div>
        ) : null}
        <div
          style={{
            width: `${maskWidth}%`,
            left: `${mousePosition}%`,
            transform: `translateX(-50%)`,
            transition: 'all 90ms cubic-bezier(.57,.21,.69,1.25)',
          }}
          className="w-full h-full absolute"
        >
          {homeEffectConfig?.images?.map((img, index) => (
            <Image
              key={img.id}
              src={img.url}
              fill
              className="w-full h-full object-cover"
              sizes="70vw"
              alt="Slide img"
              style={{
                opacity: index === randomImg.id && !isLeaving ? 1 : 0,
                transitionProperty: isLeaving ? 'all' : '',
                transitionTimingFunction: isLeaving ? 'cubic-bezier(0.4, 0, 0.2, 1)' : '',
                transitionDuration: isLeaving ? '250ms' : '',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  ) : null
}

export default ImgSlideEffect
