import React, { useState, useEffect } from 'react';
import { firestore } from './../../firebase';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import './Delivery.css';