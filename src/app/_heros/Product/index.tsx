'use client'

import React, { Fragment, useEffect, useState } from 'react'
import { useKeenSlider } from 'keen-slider/react'

import { Category, Product } from '../../../payload/payload-types'
import { AddToCartButton } from '../../_components/AddToCartButton'
import { Gutter } from '../../_components/Gutter'
import { Media } from '../../_components/Media'
import { Price } from '../../_components/Price'

import 'keen-slider/keen-slider.min.css'

import classes from './index.module.scss'

export const ProductHero: React.FC<{ product: Product }> = ({ product }) => {
  const {
    title,
    categories,
    sizeVariants,
    colorVariants,
    gallery = [{}],
    meta: { image: metaImage, description } = {},
  } = product

  const [selectedSize, setSelectedSize] = useState<string | undefined>(sizeVariants?.[0]?.sizename)
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    colorVariants?.[0]?.colorname,
  )
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isImageVisible, setIsImageVisible] = useState<boolean>(false) // State for managing visibility

  const [sliderRef, slider] = useKeenSlider({
    loop: true,
    mode: 'snap',
    slides: { perView: 1 },
  })

  // Function to extract filename from URL
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

  // Generate media URLs for gallery items
  const galleryUrls = gallery?.map(item => {
    const mediaUrl = item?.media?.url // Adjust based on actual structure
    if (typeof mediaUrl === 'string') {
      const filename = extractFilenameFromUrl(mediaUrl)
      return filename ? `${process.env.NEXT_PUBLIC_SERVER_URL}/media/${filename}` : ''
    }
    return ''
  })

  // Handle image selection
  const handleImageSelect = (url: string) => {
    setIsImageVisible(false) // Hide current image
    setTimeout(() => {
      setSelectedImage(url)
      setIsImageVisible(true) // Show new image with smooth transition
    }, 500) // Delay to match the CSS transition time
  }

  // Handle returning to the meta image
  const handleReturnToMetaImage = () => {
    setIsImageVisible(false) // Hide current image
    setTimeout(() => {
      setSelectedImage(null)
      setIsImageVisible(true) // Show meta image with smooth transition
    }, 500) // Delay to match the CSS transition time
  }

  useEffect(() => {
    setIsImageVisible(true) // Show initial image
  }, [])

  return (
    <Gutter className={classes.productHero}>
      <div className={classes.mediaWrapper}>
        <div ref={sliderRef} className={`keen-slider ${classes.slider}`}>
          {/* Meta Image */}
          {selectedImage === null && metaImage && typeof metaImage !== 'string' && (
            <div
              className={`${classes.selectedImageWrapper} ${
                isImageVisible ? classes.show : ''
              } keen-slider__slide`}
            >
              <Media imgClassName={classes.selectedImage} resource={metaImage} fill />
            </div>
          )}

          {/* Gallery Images */}
          {galleryUrls?.map((url, index) => (
            <div
              key={index}
              className={`${classes.selectedImageWrapper} ${
                selectedImage === url && isImageVisible ? classes.show : ''
              } keen-slider__slide`}
              onClick={() => handleImageSelect(url)}
            >
              <img src={url} alt={`Gallery item ${index + 1}`} className={classes.selectedImage} />
            </div>
          ))}
        </div>

        {/* Return Button */}
      </div>

      {/* Details Section */}
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
        <div className={classes.description}>
          <h6>Description</h6>
          <p>{description}</p>
        </div>

        <AddToCartButton
          product={product}
          className={classes.addToCartButton}
          selectedSize={selectedSize}
          selectedColor={selectedColor}
        />
      </div>
    </Gutter>
  )
}
