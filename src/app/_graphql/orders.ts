import { PRODUCT } from './products'

export const ORDERS = `
  query Orders {
    Orders(limit: 300) {
      docs {
        id
        phone
        address {
          line1
          line2
          city
          postalCode
          country
        }
      }
    }
  }
`

export const ORDER = `
  query Order($id: String) {
    Orders(where: { id: { equals: $id } }) {
      docs {
        id
        orderedBy
        phone
        address {
          line1
          line2
          city
          postalCode
          country
        }
        items {
          product ${PRODUCT}
          title
          priceJSON
        }
      }
    }
  }
`
