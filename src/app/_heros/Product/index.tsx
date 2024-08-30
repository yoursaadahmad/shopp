'use client'

import React, { Fragment, useState } from 'react'

import { Category, Product } from '../../../payload/payload-types'
import { AddToCartButton } from '../../_components/AddToCartButton'
import { Gutter } from '../../_components/Gutter'
import { Media } from '../../_components/Media'
import { Price } from '../../_components/Price'

import classes from './index.module.scss'

export const ProductHero: React.FC<{ product: Product }> = ({ product }) => {
  const {
    title,
    categories,
    sizeVariants,
    colorVariants,
    meta: { image: metaImage, description } = {},
  } = product

  const [selectedSize, setSelectedSize] = useState<string | undefined>(sizeVariants?.[0]?.sizename)
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    colorVariants?.[0]?.colorname,
  )

  return (
    <Gutter className={classes.productHero}>
      <div className={classes.mediaWrapper}>
        {!metaImage && <div className={classes.placeholder}>No image</div>}
        {metaImage && typeof metaImage !== 'string' && (
          <Media imgClassName={classes.image} resource={metaImage} fill />
        )}
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
          <p className={classes.stock}> In stock</p>
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
