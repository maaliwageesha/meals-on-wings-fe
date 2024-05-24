import React, { useState } from 'react'
import { Header } from '../../layouts/Header/Header'
import { Form, Button } from 'react-bootstrap'
import { firestore } from '../../firebase'
import { collection, addDoc } from 'firebase/firestore'

const AddMenuItem = () => {
  const [itemName, setItemName] = useState('')
  const [itemPrice, setItemPrice] = useState('')
  const [itemQuantity, setItemQuantity] = useState('')
  const [itemWeight, setItemWeight] = useState('')
  const [currency, setCurrency] = useState('')
  const [itemPicture, setItemPicture] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (
      !itemName ||
      !itemPrice ||
      !itemQuantity ||
      !itemWeight ||
      !currency ||
      !itemPicture
    ) {
      alert('Please fill in all fields')
      return
    }

    try {
      const docRef = await addDoc(collection(firestore, 'items'), {
        item_name: itemName,
        item_price: itemPrice,
        item_quantity: itemQuantity,
        item_weight: itemWeight,
        currency: currency,
        item_pic: itemPicture,
      })
      console.log('Document written with ID: ', docRef.id)
      // Reset form fields
      setItemName('')
      setItemPrice('')
      setItemQuantity('')
      setItemWeight('')
      setCurrency('')
      setItemPicture('')
    } catch (e) {
      console.error('Error adding document: ', e)
    }
  }

  return (
    <>
      <Header />
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
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </div>
    </>
  )
}

export default AddMenuItem
