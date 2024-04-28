export function randomItemFromArr(arr) {
  return arr.splice((Math.random() * arr.length) | 0, 1)[0]
}

export function getRandomKey(obj) {
  return Object.keys(obj)[(Math.random() * Object.keys(obj).length) | 0]
}

export function startRunner(runnerStartZ = 0, cameraStartZ = 3) {
  const runnerEndZ = -3004
  const cameraEndZ = runnerStartZ - runnerEndZ + cameraStartZ

  return {
    from: { runnerZ: runnerStartZ, cameraZ: cameraStartZ },
    loop: { runnerZ: runnerEndZ, cameraZ: cameraEndZ }, // diff between from and loop vals should be same
    config: { mass: 400_000, friction: 500 },
  }
}

export function removeItemFromArray(arr, item) {
  const index = arr.indexOf(item)
  if (index > -1) {
    arr.splice(index, 1)
  }
}
export function getRandomItemAndPop(arr) {
  const item = randomItemFromArr(arr)
  removeItemFromArray(arr, item)
  return item
}
