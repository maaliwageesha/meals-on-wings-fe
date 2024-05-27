import React, { useEffect, useState } from 'react'
// import { Header } from '../../layouts/Header/Header'
import { Form, Button } from 'react-bootstrap'
import { firestore } from '../../firebase'
import { doc, updateDoc } from 'firebase/firestore'
import { useLocation, useNavigate } from 'react-router-dom'

export const EditMenuItem = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const item = location.state

  const [itemName, setItemName] = useState('')
  const [itemPrice, setItemPrice] = useState('')
  const [itemQuantity, setItemQuantity] = useState('')
  const [itemWeight, setItemWeight] = useState('')
  const [currency, setCurrency] = useState('')
  const [itemPicture, setItemPicture] = useState('')
  const [itemCategory, setItemCategory] = useState('')
  const [itemAvailability, setItemAvailability] = useState('')

  useEffect(() => {
    if (item) {
      setItemName(item.item_name)
      setItemPrice(item.item_price)
      setItemQuantity(item.item_quantity)
      setItemWeight(item.item_weight)
      setCurrency(item.currency)
      setItemPicture(item.item_pic)
      setItemCategory(item.category)
      setItemAvailability(item.availability)
    }
  }, [item])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (
      !itemName ||
      !itemPrice ||
      !itemQuantity ||
      !itemWeight ||
      !currency ||
      !itemPicture ||
      !itemCategory ||
      !itemAvailability
    ) {
      alert('Please fill in all fields')
      return
    }

    try {
      const docRef = doc(firestore, 'items', item.id)
      await updateDoc(docRef, {
        item_name: itemName,
        item_price: itemPrice,
        item_quantity: itemQuantity,
        item_weight: itemWeight,
        currency: currency,
        item_pic: itemPicture,
        category: itemCategory,
        availability: itemAvailability
      })
      console.log('Document updated with ID: ', item.id)
      navigate('/menu-management')
    } catch (e) {
      console.error('Error updating document: ', e)
    }
  }

  return (
    <>
      {/* <Header /> */}
      <div className="container" style={{ width: '60%' }}>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formItemName">
            <Form.Label>Item Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Item name"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formItemPrice">
            <Form.Label>Item Price</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter Item price"
              value={itemPrice}
              onChange={(e) => setItemPrice(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formItemQuantity">
            <Form.Label>Item Quantity</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter Item quantity"
              value={itemQuantity}
              onChange={(e) => setItemQuantity(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formItemWeight">
            <Form.Label>Item Weight</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter Item weight"
              value={itemWeight}
              onChange={(e) => setItemWeight(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formCurrency">
            <Form.Label>Currency</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formItemPicture">
            <Form.Label>Item Picture</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter item picture URL"
              value={itemPicture}
              onChange={(e) => setItemPicture(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formItemCategory">
            <Form.Label>Item Category</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter item category"
              value={itemCategory}
              onChange={(e) => setItemCategory(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formItemAvailability">
            <Form.Label>Item Availability</Form.Label>
            <Form.Check
              type="radio"
              name='itemAvailability'
              label='Sold Out'
              value="Sold Out"
              checked={itemAvailability === "Sold Out"}
              onChange={(e) => setItemAvailability(e.target.value)}
            />
            <Form.Check
              type="radio"
              name='itemAvailability'
              label='Available'
              value="Available"
              checked={itemAvailability === "Available"}
              onChange={(e) => setItemAvailability(e.target.value)}
            />
          </Form.Group>
          <Button variant="primary" style={{color: 'black'}} type="submit">
            Submit
          </Button>
        </Form>
      </div>
    </>
  )
}

