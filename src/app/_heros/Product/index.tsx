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
            <label htmlFor="sizeSelect" className={classes.variantLabel}>
              Size
            </label>
            <select
              id="sizeSelect"
              className={classes.variantSelect}
              value={selectedSize}
              onChange={e => setSelectedSize(e.target.value)}
            >
              {sizeVariants.map((variant, index) => (
                <option key={index} value={variant.sizename}>
                  {variant.sizename}
                </option>
              ))}
            </select>
          </div>
        )}

        {colorVariants?.length > 0 && (
          <div className={classes.variantWrapper}>
            <label htmlFor="colorSelect" className={classes.variantLabel}>
              Color
            </label>
            <select
              id="colorSelect"
              className={classes.variantSelect}
              value={selectedColor}
              onChange={e => setSelectedColor(e.target.value)}
            >
              {colorVariants.map((variant, index) => (
                <option key={index} value={variant.colorname}>
                  {variant.colorname}
                </option>
              ))}
            </select>
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
