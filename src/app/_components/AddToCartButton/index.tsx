'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import { Product } from '../../../payload/payload-types'
import { useCart } from '../../_providers/Cart'
import { Button, Props } from '../Button'

import classes from './index.module.scss'

export const AddToCartButton: React.FC<{
  product: Product
  quantity?: number
  className?: string
  appearance?: Props['appearance']
  selectedSize?: string
  selectedColor?: string
}> = ({
  product,
  quantity = 1,
  className,
  appearance = 'primary',
  selectedSize,
  selectedColor,
}) => {
  const { addItemToCart, isProductInCart, hasInitializedCart } = useCart()
  const [isInCart, setIsInCart] = useState<boolean>()
  const router = useRouter()

  useEffect(() => {
    setIsInCart(isProductInCart(product))
  }, [isProductInCart, product])

  const handleAddToCart = () => {
    addItemToCart({ product, quantity, selectedSize, selectedColor })
    router.push('/cart')
  }

  const handleDirectCheckout = () => {
    if (!isInCart) {
      addItemToCart({
        product,
        quantity,
        selectedSize,
        selectedColor,
      })
    }
    router.push('/checkout')
  }

  return (
    <div className={className}>
      <Button
        href={isInCart ? '/cart' : undefined}
        type={!isInCart ? 'button' : undefined}
        label={isInCart ? `✓ View in cart` : `Add to cart`}
        el={isInCart ? 'link' : undefined}
        appearance={appearance}
        className={[
          classes.addToCartButton,
          appearance === 'default' && isInCart && classes.green,
          !hasInitializedCart && classes.hidden,
        ]
          .filter(Boolean)
          .join(' ')}
        onClick={handleAddToCart}
      />
      <Button
        type="button"
        label="Buy Now"
        appearance="secondary" // Use a different appearance for distinction
        className={[classes.directCheckoutButton, !hasInitializedCart && classes.hidden]
          .filter(Boolean)
          .join(' ')}
        onClick={handleDirectCheckout}
      />
    </div>
  )
}
