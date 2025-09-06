// src/hooks/useFirestoreData.js

import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore'; 
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '../firebaseConfig';

export function useFirestoreData() {
  const [user, setUser] = useState(null);
  const [allUnits, setAllUnits] = useState([]);
  const [allBosses, setAllBosses] = useState([]);
  const [allEquipment, setAllEquipment] = useState([]);
  const [allGuides, setAllGuides] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // <-- Start as true
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        // If there's no user, we are not loading and there's no data. This is correct.
        setIsLoading(false);
        setAllUnits([]);
        setAllBosses([]);
        setAllEquipment([]);
        setAllGuides([]);
        return; // Stop execution here
      }

      // User exists, proceed with fetching data.
      // isLoading remains true until the first fetch completes.
      
      const unitsQuery = query(collection(db, "grand_summoners/data/units"), orderBy("Release_Order_Index", "asc"));
      const bossesQuery = query(collection(db, "grand_summoners/data/bosses"), orderBy("name", "asc"));
      const equipmentQuery = query(collection(db, "grand_summoners/data/equipment"), orderBy("Release_Order_Index", "asc"));
      const guidesRef = collection(db, "grand_summoners/data/quest_guides");

      const unsubUnits = onSnapshot(unitsQuery, 
        (snapshot) => { 
          setAllUnits(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))); 
          setIsLoading(false); // <-- THE FIX: Set loading to false ONLY after data arrives.
        }, 
        (err) => {
          setError("Failed to load units.");
          setIsLoading(false);
        }
      );
      
      const unsubBosses = onSnapshot(bossesQuery, (snapshot) => { setAllBosses(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))); }, (err) => setError("Failed to load bosses."));
      const unsubEquip = onSnapshot(equipmentQuery, (snapshot) => { setAllEquipment(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))); }, (err) => setError("Failed to load equipment."));
      const unsubGuides = onSnapshot(guidesRef, (snapshot) => { setAllGuides(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))); }, (err) => console.warn("Could not load guides."));
      
      return () => {
        unsubUnits();
        unsubBosses();
        unsubEquip();
        unsubGuides();
      };
    });
    return () => unsubscribeAuth();
  }, []);

  return { user, allUnits, allBosses, allEquipment, allGuides, isLoading, error };
}