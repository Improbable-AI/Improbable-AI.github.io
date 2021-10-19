export default function joinArray(array, separator) {
  return array.reduce((p, c, idx) => {
    if (idx === 0)
      return [c];
    else
      return [...p, separator, c];
  }, []);
}