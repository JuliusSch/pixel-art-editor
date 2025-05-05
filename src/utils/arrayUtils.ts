export default class arrayUtils {

  static flattenGrid(grid: string[][]): string[] {
    return grid.flat()
  }
  
  static expandGrid(flatGrid: string[], width: number, height: number): string[][] {
    const expandedGrid: string[][] = []
    for (let i = 0; i < height; i++) {
      expandedGrid.push(flatGrid.slice(i * width, (i + 1) * width))
    }
    return expandedGrid
  }
}