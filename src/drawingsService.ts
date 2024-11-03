import { db, auth } from '../firebaseConfig'
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore'

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
        grid: expandGrid(data.grid, gridWidth, gridHeight),
      };
    }) as Drawing[];
  } catch (error) {
    console.error("Error fetching drawings: ", error);
    return []
  }
}

export async function saveDrawing(drawingName: string, grid: string[][]): Promise<void> {
  if (auth.currentUser) {
    const drawingData = {
      userId: auth.currentUser.uid,
      name: drawingName,
      grid: flattenGrid(grid)
    }
    try {
      await addDoc(collection(db, 'drawings'), drawingData)
    } catch (error) {
      console.error("Error saving drawing: ", error)
    }
      
    // const newSavedDrawings = [...savedDrawings, drawingData ]
    // setSavedDrawings(newSavedDrawings)
    // localStorage.setItem(LOCAL_STORAGE_KEYS.SAVED_DRAWINGS, JSON.stringify(newSavedDrawings))
    fetchDrawings(auth.currentUser.uid)
  }
}

function flattenGrid(grid: string[][]): string[] {
  return grid.flat()
}

function expandGrid(flatGrid: string[], width: number, height: number): string[][] {
  const expandedGrid: string[][] = []
  for (let i = 0; i < height; i++) {
    expandedGrid.push(flatGrid.slice(i * width, (i + 1) * width))
  }
  return expandedGrid
}