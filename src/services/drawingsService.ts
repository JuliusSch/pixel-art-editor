import { db, auth } from '../../config/firebaseConfig'
import { collection, query, where, getDocs, doc, setDoc, addDoc } from 'firebase/firestore'
import arrayUtils from '../utils/arrayUtils'

export interface Drawing {
  uid: string
  userId: string
  name: string
  grid: string[][]
}

const gridWidth = 16
const gridHeight = 16

export async function fetchDrawings(userId: string): Promise<Drawing[]> {
  const q = query(
    collection(db, "drawings"),
    where("userId", "==", userId)
  )

  console.log("Fetching drawings...");

  try {
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        uid: doc.id,
        name: data.name,
        grid: arrayUtils.expandGrid(data.grid, gridWidth, gridHeight),
      };
    }) as Drawing[];
  } catch (error) {
    console.error("Error fetching drawings: ", error);
    return []
  }
}

export async function saveDrawing(drawing: Drawing, grid: string[][]) : Promise<Drawing[]> {
  if (auth.currentUser) {
    const drawingData = {
      userId: auth.currentUser.uid,
      name: drawing.name,
      grid: arrayUtils.flattenGrid(grid),
    };
    try {
      console.log(drawing.uid)
      if (drawing.uid === undefined)
        await addDoc(collection(db, "drawings"), drawingData);
      else {
        const docRef = doc(collection(db, "drawings"), drawing.uid);
        await setDoc(docRef, drawingData, { merge: true });
      }
    } catch (error) {
      console.error("Error saving drawing: ", error);
    }
    return fetchDrawings(auth.currentUser.uid)
  }
  return []
}