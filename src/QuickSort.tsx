export function* quickSortGenerator(a: number[]) {
  let length = a.length
  let stack = new Array(length)
  stack.fill(0)
  let top = -1
  let [l, h] = [0, length-1]
  stack[++top] = l
  stack[++top] = h
  while(top >= 0) {
    h = stack[top--]
    l = stack[top--]

    let [i, j] = [l, h]
    let pivot = Math.round((l + h) / 2)
    let mid = a[pivot]
    while(i <= j) {
      if (a[i] < mid) {
        i++
      }
      else if (a[j] > mid) {
        j--
      }
      else {
        [a[i], a[j]] = [a[j], a[i]]
        i++
        j--
      }
      yield [Array.from(a, x => x), [i, j, pivot]] as [number[], number[]]
    }

    if (j > l) {
        stack[++top] = l;
        stack[++top] = j;
    }

    if (i < h) {
        stack[++top] = i;
        stack[++top] = h;
    }
  }
  yield [Array.from(a, x => x), []] as [number[], number[]]
  return a
}