import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { addDoc, collection, doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../API/fire';
import { Form, Button, Alert } from 'react-bootstrap';

const AuthRegister = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [nim, setNIM] = useState('');
  const [error, setError] = useState(null);

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      // Cek apakah email sudah terdaftar
      const existingUser = await getDoc(doc(db, 'users', email));
      if (existingUser.exists()) {
        throw new Error('Email already registered');
      }

      // Register user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save additional user data to Firestore
      await saveUserDataToFirestore(user.uid);

      // Save name and nim to local storage

      setError(null);
    } catch (error) {
      setError(error.message);
    }
  };

  const saveUserDataToFirestore = async (userId) => {
    const usersCollection = collection(db, 'users');

    try {
      // Save user data to Firestore
      await addDoc(usersCollection, {
        userId: userId,
        name: name,
        nim: nim,
      });
    } catch (error) {
      console.error('Error adding user data to Firestore:', error.message);
    }
  };

  return (
    <div>
      <Form>
        <Form.Group controlId="formName">
          <Form.Label>Name</Form.Label>
          <Form.Control type="text" placeholder="Enter your name" onChange={(e) => setName(e.target.value)} />
        </Form.Group>

        <Form.Group controlId="formNIM">
          <Form.Label>NIM</Form.Label>
          <Form.Control type="text" placeholder="Enter your NIM" onChange={(e) => setNIM(e.target.value)} />
        </Form.Group>

        <Form.Group controlId="formEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" placeholder="Enter email" onChange={(e) => setEmail(e.target.value)} />
        </Form.Group>

        <Form.Group controlId="formPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
        </Form.Group>

        {error && <Alert variant="danger">{error}</Alert>}

        <Button variant="success" type="submit" onClick={handleSignUp}>
          Sign Up
        </Button>
      </Form>
    </div>
  );
};

export default AuthRegister;
