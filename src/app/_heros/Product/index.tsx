'use client'

import React, { Fragment, useState } from 'react'
import Zoom from 'react-medium-image-zoom'
import { useKeenSlider } from 'keen-slider/react'

import { Category, Product } from '../../../payload/payload-types'
import { AddToCartButton } from '../../_components/AddToCartButton'
import { Gutter } from '../../_components/Gutter'
import { Media } from '../../_components/Media'
import { Price } from '../../_components/Price'

import 'react-medium-image-zoom/dist/styles.css'
import 'keen-slider/keen-slider.min.css'

import classes from './index.module.scss'

export const ProductHero: React.FC<{ product: Product }> = ({ product }) => {
  const {
    title,
    categories,
    sizeVariants,
    colorVariants,
    gallery = [{ ...Media }],
    meta: { image: metaImage, description } = {},
  } = product

  const [selectedSize, setSelectedSize] = useState<string | undefined>(sizeVariants?.[0]?.sizename)
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    colorVariants?.[0]?.colorname,
  )
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isImageVisible, setIsImageVisible] = useState<boolean>(false)
  const [currentSlide, setCurrentSlide] = useState<number>(0)

  const [sliderRef, slider] = useKeenSlider<HTMLDivElement>({
    loop: true,
    mode: 'snap',
    slides: { perView: 1 },
    slideChanged(s) {
      const currentSlide = s.track.details.rel
      setCurrentSlide(currentSlide)
    },
  })

  const extractFilenameFromUrl = (url: string): string | null => {
    try {
      const urlObj = new URL(url)
      const pathname = urlObj.pathname
      const parts = pathname.split('/')
      return parts[parts.length - 1] || null
    } catch (error) {
      console.error('Invalid URL:', url, error)
      return null
    }
  }

  const galleryUrls = gallery?.map(item => {
    const mediaUrl = item?.media?.url
    if (typeof mediaUrl === 'string') {
      const filename = extractFilenameFromUrl(mediaUrl)
      return filename ? `${process.env.NEXT_PUBLIC_SERVER_URL}/media/${filename}` : ''
    }
    return ''
  })

  const handleImageSelect = (url: string, index: number) => {
    setSelectedImage(url)
  }

  const handleReturnToMetaImage = () => {
    setSelectedImage(null)
  }

  return (
    <Gutter className={classes.productHero}>
      <div className={classes.mediaWrapper}>
        <div ref={sliderRef} className={`keen-slider ${classes.slider}`}>
          {selectedImage === null && metaImage && typeof metaImage !== 'string' && (
            <div
              className={`${classes.selectedImageWrapper} ${
                isImageVisible ? classes.show : ''
              } keen-slider__slide`}
            >
              <Zoom>
                <Media imgClassName={classes.selectedImage} resource={metaImage} fill />
              </Zoom>
            </div>
          )}

          {galleryUrls?.map((url, index) => (
            <div
              key={index}
              className={`${classes.selectedImageWrapper} ${
                selectedImage === url && isImageVisible ? classes.show : ''
              } keen-slider__slide`}
              onClick={() => handleImageSelect(url, index)}
            >
              <Zoom>
                <img
                  src={url}
                  alt={`Gallery item ${index + 1}`}
                  className={classes.selectedImage}
                />
              </Zoom>
            </div>
          ))}
        </div>

        {/* Left Arrow */}
        <button
          className={`${classes.arrow} ${classes.arrowLeft}`}
          onClick={() => slider.current?.prev()}
        >
          &lt;
        </button>

        {/* Right Arrow */}
        <button
          className={`${classes.arrow} ${classes.arrowRight}`}
          onClick={() => slider.current?.next()}
        >
          &gt;
        </button>

        {/* Dots Navigation */}
        <div className={classes.dotsWrapper}>
          {galleryUrls?.map((_, idx) => (
            <button
              key={idx}
              onClick={() => slider.current?.moveToIdx(idx)}
              className={`${classes.dot} ${currentSlide === idx ? classes.activeDot : ''}`}
            ></button>
          ))}
        </div>
      </div>

      <div className={classes.details}>
        <h3 className={classes.title}>{title}</h3>

        <div className={classes.categoryWrapper}>
          <div className={classes.categories}>
            {categories?.map((category, index) => {
              const { title: categoryTitle } = category as Category
              const titleToUse = categoryTitle || 'Generic'
              const isLast = index === categories.length - 1

              return (
                <p key={index} className={classes.category}>
                  {titleToUse} {!isLast && <Fragment>, &nbsp;</Fragment>}
                  <span className={classes.separator}>|</span>
                </p>
              )
            })}
          </div>
          <p className={classes.stock}>In stock</p>
        </div>

        <Price product={product} button={false} />

        {sizeVariants?.length > 0 && (
          <div className={classes.variantWrapper}>
            <label className={classes.variantLabel}>Size</label>
            <div className={classes.pillGroup}>
              {sizeVariants.map((variant, index) => (
                <button
                  key={index}
                  className={`${classes.pill} ${
                    selectedSize === variant.sizename ? classes.activePill : ''
                  }`}
                  onClick={() => setSelectedSize(variant.sizename)}
                >
                  {variant.sizename}
                </button>
              ))}
            </div>
          </div>
        )}

        {colorVariants?.length > 0 && (
          <div className={classes.variantWrapper}>
            <label className={classes.variantLabel}>Color</label>
            <div className={classes.pillGroup}>
              {colorVariants.map((variant, index) => (
                <button
                  key={index}
                  className={`${classes.pill} ${
                    selectedColor === variant.colorname ? classes.activePill : ''
                  }`}
                  onClick={() => setSelectedColor(variant.colorname)}
                >
                  {variant.colorname}
                </button>
              ))}
            </div>
          </div>
        )}
        <AddToCartButton
          product={product}
          className={classes.addToCartButton}
          selectedSize={selectedSize}
          selectedColor={selectedColor}
        />
        <div className={classes.description}>
          <h6>Description</h6>
          <p>{description}</p>
        </div>
      </div>
    </Gutter>
  )
}
