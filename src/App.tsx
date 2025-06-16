import { useReducer, useRef, useState } from 'react'
import './App.css'
import { quickSortGenerator } from './QuickSort'

type Action = {type: "Continue" | "Stop"}
type State = {code: number, text: string}

function reducer(state: State, action: Action): State {
  switch(action.type) {
    case "Continue":
      state = {code: 1, text: "Stop"}
      return state
    case "Stop":
      state = {code: 0, text: "Sort"}
      return state
  }
}

function App() {
  const LENGTH = 50
  const customized_array = Array.from({length: LENGTH}, (_, i) => i+1)
                                .map(value => ({value, key: Math.random()}))
                                .sort((a, b) => a.key - b.key)
                                .map(({value}) => value)
  const [array, setArray] = useState<{body: number[], active: number[]}>({body: customized_array, active: []})
  const [state, dispatch] = useReducer(reducer, {code: 0, text: "Sort"})
  const cancel = useRef(false)

  function exitAndSleep(duration: number) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve("resolve")
      }, duration)
    })
  }

  function* bubbleSortGenerator(a: number[]) {
    for(let i = a.length-1; i > 0; i--) {
      for(let j = 0; j < i; j++) {
        if(a[j] > a[j+1]) {
          [a[j+1], a[j]] = [a[j], a[j+1]]
        }
        yield [Array.from(a, x => x), [j, j+1]] as [number[], number[]]
      }
    }
    yield [Array.from(a, x => x), []] as [number[], number[]]
    return a
  }

  async function bubbleSort() {
    const iterator: Generator<[number[], number[]]> = bubbleSortGenerator(array.body)
    // const iterator: Generator<[number[], number[]]> = quickSortGenerator(array.body)
    while(!cancel.current) {
      const {done, value: [body, active]} = iterator.next()
      if(done)
        break
      setArray({body: body, active: active})
      await exitAndSleep(10)
    }
    dispatch({type: "Stop"})
    // setArray(prev => ({...prev, active: []}))
  }

  function handleClick() {
    if(state.code === 0) {
      dispatch({type: "Continue"})
      cancel.current = false
      bubbleSort()
    }
    else if (state.code === 1) {
      cancel.current = true
    }
  }

  function shuffle() {
    const customized_array = Array.from({length: LENGTH}, (_, i) => i+1)
                                .map(value => ({value, key: Math.random()}))
                                .sort((a, b) => a.key - b.key)
                                .map(({value}) => value)
    setArray({body: customized_array, active: []})
  }

  function handleShuffleClick() {
    if(state.code === 0) {
      shuffle()
    }
  }

  return (
    <>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'end'
        }}
      >
        {array.body.map((item, index) => (
          <div key={index}
            style={{
              background: array.active.includes(index) ? "red" : "gray",
              height: 8*item,
              width: 20
            }}
          >
            
          </div>
        ))}
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={handleClick}
          // disabled={state.code === 1 ? true : false}
        >
          {state.text}
        </button>
        <button onClick={handleShuffleClick}
          disabled={state.code === 1 ? true : false}
        >
          Shuffle
        </button>
      </div>
    </>
  )
}

export default App