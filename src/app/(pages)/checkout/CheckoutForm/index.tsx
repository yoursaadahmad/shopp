'use client'

import React, { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'

import { Button } from '../../../_components/Button'
import { Message } from '../../../_components/Message'
import { priceFromJSON } from '../../../_components/Price'
import { useCart } from '../../../_providers/Cart'

import classes from './index.module.scss'

export const CheckoutForm: React.FC<{}> = () => {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [address, setAddress] = useState({
    firstname: '',
    lastname: '',
    line1: '',
    line2: '',
    city: '',
    postalCode: '',
    country: '',
  })
  const [phone, setPhone] = useState('')
  const router = useRouter()
  const { cart, cartTotal } = useCart()

  const handleSubmit = useCallback(
    async e => {
      e.preventDefault()
      setIsLoading(true)

      try {
        // Validate that required fields are filled out
        if (!address.line1 || !address.city || !address.postalCode || !address.country || !phone) {
          throw new Error('Please fill out all required fields.')
        }

        const orderReq = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/orders`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            total: cartTotal.raw,
            items: (cart?.items || [])?.map(({ product, quantity }) => ({
              product: typeof product === 'string' ? product : product.id,
              quantity,
              price:
                typeof product === 'object' ? priceFromJSON(product.priceJSON, 1, true) : undefined,
            })),
            address, // Send the custom address object
            phone, // Send the phone number
          }),
        })

        if (!orderReq.ok) throw new Error(orderReq.statusText || 'Something went wrong.')

        const { error: errorFromRes, doc } = await orderReq.json()

        if (errorFromRes) throw new Error(errorFromRes)

        router.push(`/order-confirmation?order_id=${doc.id}`)
      } catch (err) {
        setError(`Error while submitting order: ${err.message}`)
        setIsLoading(false)
      }
    },
    [address, phone, cart, cartTotal, router],
  )

  return (
    <div className={classes.form}>
      <span className={classes.newspan}>Fill Your Information. Pay with cash on delivery</span>
      <form onSubmit={handleSubmit} className={classes.newform}>
        {error && <Message error={error} />}

        <div className="form-item">
          <label>First Name</label>
          <input
            type="text"
            value={address.firstname}
            onChange={e => setAddress({ ...address, firstname: e.target.value })}
            required
            className={classes.newform}
            placeholder="First Name"
          />
        </div>
        <div className="form-item">
          <label>Last Name</label>
          <input
            type="text"
            value={address.lastname}
            onChange={e => setAddress({ ...address, lastname: e.target.value })}
            required
            className={classes.newform}
            placeholder="Last Name"
          />
        </div>

        <div className="form-item">
          <label>Address Line 1</label>
          <input
            type="text"
            value={address.line1}
            onChange={e => setAddress({ ...address, line1: e.target.value })}
            required
            className={classes.newform}
            placeholder="Address Line 1"
          />
        </div>
        <div className="form-item">
          <label>Address Line 2</label>
          <input
            type="text"
            value={address.line2}
            onChange={e => setAddress({ ...address, line2: e.target.value })}
            className={classes.newform}
            placeholder="Address Line 2"
          />
        </div>

        <div className="form-item">
          <label>City</label>
          <input
            type="text"
            value={address.city}
            onChange={e => setAddress({ ...address, city: e.target.value })}
            required
            className={classes.newform}
            placeholder="City"
          />
        </div>
        <div className="form-item">
          <label>Postal Code</label>
          <input
            type="text"
            value={address.postalCode}
            onChange={e => setAddress({ ...address, postalCode: e.target.value })}
            required
            className={classes.newform}
            placeholder="Postal Code"
          />
        </div>

        <div className="form-item">
          <label>Country</label>
          <input
            type="text"
            value={address.country}
            onChange={e => setAddress({ ...address, country: e.target.value })}
            required
            className={classes.newform}
            placeholder="Country"
          />
        </div>
        <div className="form-item">
          <label>Phone Number</label>
          <input
            type="tel"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            required
            className={classes.newform}
            placeholder="Phone Number"
          />
        </div>
        <div className={classes.actions}>
          <Button label="Back to cart" href="/cart" appearance="secondary" />
          <Button
            label={isLoading ? 'Loading...' : 'Confirm Order'}
            type="submit"
            appearance="primary"
            disabled={isLoading}
          />
        </div>
      </form>
    </div>
  )
}

export default CheckoutForm
